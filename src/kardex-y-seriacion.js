document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    let allKardexData = {}; // Store all kardex data

    // Function to render kardex for a specific cuatrimestre
    function renderKardex(cuatrimestre) {
        const kardexDisplayContainer = document.getElementById('kardex-display-container');
        kardexDisplayContainer.innerHTML = ''; // Clear previous content

        if (!allKardexData[cuatrimestre] || allKardexData[cuatrimestre].length === 0) {
            kardexDisplayContainer.innerHTML = `<p>No hay datos de kardex para el Cuatrimestre ${cuatrimestre}.</p>`;
            return;
        }

        const cuatrimestreDiv = document.createElement('div'); // Corrected variable name
        cuatrimestreDiv.innerHTML = `<br><span class="Titulo">Kardex del Cuatrimestre ${cuatrimestre}</span>`;
        
        const table = document.createElement('table');
        table.className = 'table table-bordered';
        table.innerHTML = `
            <thead>
                <tr>
                    <th class="EtiquetaEnc">Clave</th>
                    <th class="EtiquetaEnc">Materia</th>
                    <th class="EtiquetaEnc">Oports. Agotadas</th>
                    <th class="EtiquetaEnc">Alto Riesgo Academ.</th>
                    <th class="EtiquetaEnc">Periodo</th>
                    <th class="EtiquetaEnc">Calif.</th>
                    <th class="EtiquetaEnc">Tipo de Examen</th>
                    <th class="EtiquetaEnc">Detalle de Califs.</th>
                    <th class="EtiquetaEnc">Materias Seriadas</th>
                </tr>
            </thead>
            <tbody>
                ${allKardexData[cuatrimestre].map(materia => `
                    <tr>
                        <td class="Dinforma">${materia.clave}</td>
                        <td class="Dinforma">${materia.materia}</td>
                        <td class="Dinforma">${materia.oports_agotadas}</td>
                        <td class="Dinforma">${materia.alto_riesgo ? 'SI' : 'NO'}</td>
                        <td class="Dinforma">${materia.periodo}</td>
                        <td class="Dinforma">${materia.calificacion}</td>
                        <td class="Dinforma">${materia.tipo_examen}</td>
                        <td class="Dinforma"><a href="#" class="calificaciones-link" data-materia-id="${materia.id}" data-materia-nombre="${materia.materia}">Calificaciones</a></td>
                        <td class="Dinforma">-</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        cuatrimestreDiv.appendChild(table);
        kardexDisplayContainer.appendChild(cuatrimestreDiv);
    }

    // Fetch all kardex data
    try {
        const response = await fetch(`${backendUrl}/kardex/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            allKardexData = await response.json();
            const cuatrimestreSelect = document.getElementById('semestre-select');
            
            if (Object.keys(allKardexData).length === 0) {
                cuatrimestreSelect.innerHTML = '<option value="">No hay cuatrimestres disponibles</option>';
                document.getElementById('kardex-display-container').innerHTML = '<p>No hay datos de kardex para mostrar.</p>';
            } else {
                // Populate cuatrimestre select options
                Object.keys(allKardexData).sort((a, b) => parseInt(a) - parseInt(b)).forEach(cuatrimestre => {
                    const option = document.createElement('option');
                    option.value = cuatrimestre;
                    option.textContent = `Cuatrimestre ${cuatrimestre}`;
                    cuatrimestreSelect.appendChild(option);
                });

                // Set initial display to the first cuatrimestre
                if (cuatrimestreSelect.options.length > 0) {
                    renderKardex(cuatrimestreSelect.value);
                }

                // Add event listener for cuatrimestre change
                cuatrimestreSelect.addEventListener('change', (event) => {
                    renderKardex(event.target.value);
                    document.getElementById('partial-grades-container').style.display = 'none'; // Hide partial grades when changing cuatrimestre
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar el kardex.');
        }
    } catch (error) {
        console.error('Error al cargar el kardex:', error);
        alert('Ocurrió un error al cargar el kardex.');
    }

    // Handle "Calificaciones" link click
    document.getElementById('kardex-display-container').addEventListener('click', async function(event) {
        if (event.target.classList.contains('calificaciones-link')) {
            event.preventDefault();
            const materiaId = event.target.dataset.materiaId;
            const materiaNombre = event.target.dataset.materiaNombre;
            const partialGradesContainer = document.getElementById('partial-grades-container');
            const partialGradesTitle = document.getElementById('partial-grades-materia-title');
            const partialGradesTableHead = document.getElementById('partial-grades-table-head');
            const partialGradesTableBody = document.getElementById('partial-grades-table-body');

            partialGradesTitle.textContent = `Calificaciones Parciales para: ${materiaNombre}`;
            partialGradesTableHead.innerHTML = ''; // Clear previous headers
            partialGradesTableBody.innerHTML = ''; // Clear previous content
            
            try {
                const response = await fetch(`${backendUrl}/calificaciones/parciales/materia/${materiaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json(); // data is now expected to be an array
                    console.log('Fetched partial grades data:', data); // Log the data for debugging

                    if (data && data.length > 0) {
                        const headerRow = partialGradesTableHead.insertRow();
                        
                        // Add "Unidad" header
                        const unidadTh = document.createElement('th');
                        unidadTh.className = 'EtiquetaEnc';
                        unidadTh.textContent = 'Unidad';
                        headerRow.appendChild(unidadTh);

                        // Add "Calificación" header
                        const calificacionTh = document.createElement('th');
                        calificacionTh.className = 'EtiquetaEnc';
                        calificacionTh.textContent = 'Calificación';
                        headerRow.appendChild(calificacionTh);

                        // Populate table body with each partial grade
                        data.forEach(partial => {
                            const row = partialGradesTableBody.insertRow();
                            row.insertCell().textContent = partial.unidad || 'N/A';
                            row.insertCell().textContent = partial.calificacion || 'N/A';
                        });
                    } else {
                        const row = partialGradesTableBody.insertRow();
                        const cell = row.insertCell();
                        cell.colSpan = 2; // Span two columns: Unidad, Calificación
                        cell.textContent = 'No hay calificaciones parciales para esta materia.';
                        cell.style.textAlign = 'center';
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Error al cargar las calificaciones parciales.');
                }
            } catch (error) {
                console.error('Error al cargar las calificaciones parciales:', error);
                alert('Ocurrió un error al cargar las calificaciones parciales.');
            }
            partialGradesContainer.style.display = 'block'; // Show container after data is loaded
        }
    });

    // Handle hide partial grades button click
    document.getElementById('hide-partial-grades').addEventListener('click', function() {
        document.getElementById('partial-grades-container').style.display = 'none';
    });
});