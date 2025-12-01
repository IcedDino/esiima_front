document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    let allKardexData = {}; // Store all kardex data

    // Function to render kardex for a specific semester
    function renderKardex(semestre) {
        const kardexDisplayContainer = document.getElementById('kardex-display-container');
        kardexDisplayContainer.innerHTML = ''; // Clear previous content

        if (!allKardexData[semestre] || allKardexData[semestre].length === 0) {
            kardexDisplayContainer.innerHTML = `<p>No hay datos de kardex para el Semestre ${semestre}.</p>`;
            return;
        }

        const semestreDiv = document.createElement('div');
        semestreDiv.innerHTML = `<br><span class="Titulo">Kardex del Semestre ${semestre}</span>`;
        
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
                ${allKardexData[semestre].map(materia => `
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
        semestreDiv.appendChild(table);
        kardexDisplayContainer.appendChild(semestreDiv);
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
            const semestreSelect = document.getElementById('semestre-select');
            
            if (Object.keys(allKardexData).length === 0) {
                semestreSelect.innerHTML = '<option value="">No hay semestres disponibles</option>';
                document.getElementById('kardex-display-container').innerHTML = '<p>No hay datos de kardex para mostrar.</p>';
            } else {
                // Populate semester select options
                Object.keys(allKardexData).sort((a, b) => parseInt(a) - parseInt(b)).forEach(semestre => {
                    const option = document.createElement('option');
                    option.value = semestre;
                    option.textContent = `Semestre ${semestre}`;
                    semestreSelect.appendChild(option);
                });

                // Set initial display to the first semester
                if (semestreSelect.options.length > 0) {
                    renderKardex(semestreSelect.value);
                }

                // Add event listener for semester change
                semestreSelect.addEventListener('change', (event) => {
                    renderKardex(event.target.value);
                    document.getElementById('partial-grades-container').style.display = 'none'; // Hide partial grades when changing semester
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
            const partialGradesTableBody = document.getElementById('partial-grades-table-body');

            partialGradesTitle.textContent = `Calificaciones Parciales para: ${materiaNombre}`;
            partialGradesTableBody.innerHTML = ''; // Clear previous content
            partialGradesContainer.style.display = 'block';

            try {
                const response = await fetch(`${backendUrl}/calificaciones/parciales/materia/${materiaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        const row = partialGradesTableBody.insertRow();
                        const cell = row.insertCell();
                        cell.colSpan = 2;
                        cell.textContent = 'No hay calificaciones parciales para esta materia.';
                        cell.style.textAlign = 'center';
                    } else {
                        data.forEach(grade => {
                            const row = partialGradesTableBody.insertRow();
                            row.insertCell().textContent = grade.parcial;
                            row.insertCell().textContent = grade.calificacion;
                        });
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Error al cargar las calificaciones parciales.');
                }
            } catch (error) {
                console.error('Error al cargar las calificaciones parciales:', error);
                alert('Ocurrió un error al cargar las calificaciones parciales.');
            }
        }
    });

    // Handle hide partial grades button click
    document.getElementById('hide-partial-grades').addEventListener('click', function() {
        document.getElementById('partial-grades-container').style.display = 'none';
    });
});