document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch student info
    try {
        const response = await fetch(`${backendUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('ciclo-escolar').textContent = user.ciclo_escolar || 'N/A';
            document.getElementById('nivel-estudios').textContent = user.nivel_estudios || 'N/A';
            document.getElementById('carrera').textContent = user.carrera || 'N/A';
            document.getElementById('semestre-grupo').textContent = user.semestre_grupo || 'N/A';
            document.getElementById('nombre-alumno').textContent = user.nombre || 'N/A';
            document.getElementById('cursa-actualmente').textContent = user.cursa_actualmente || 'N/A';
            document.getElementById('promedio-semestral').textContent = user.promedio_semestral || 'N/A';
        } else {
            console.error('Error al cargar la información del alumno.');
        }
    } catch (error) {
        console.error('Error al cargar la información del alumno:', error);
    }

    // Fetch kardex data
    try {
        const response = await fetch(`${backendUrl}/kardex/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const kardexContainer = document.getElementById('kardex-container');
            
            if (Object.keys(data).length === 0) {
                kardexContainer.innerHTML = '<p>No hay datos de kardex para mostrar.</p>';
            } else {
                for (const semestre in data) {
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
                            ${data[semestre].map(materia => `
                                <tr>
                                    <td class="Dinforma">${materia.clave}</td>
                                    <td class="Dinforma">${materia.materia}</td>
                                    <td class="Dinforma">${materia.oports_agotadas}</td>
                                    <td class="Dinforma">${materia.alto_riesgo ? 'SI' : 'NO'}</td>
                                    <td class="Dinforma">${materia.periodo}</td>
                                    <td class="Dinforma">${materia.calificacion}</td>
                                    <td class="Dinforma">${materia.tipo_examen}</td>
                                    <td class="Dinforma"><a href="#">Calificaciones</a></td>
                                    <td class="Dinforma">-</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    `;
                    semestreDiv.appendChild(table);
                    kardexContainer.appendChild(semestreDiv);
                }
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar el kardex.');
        }
    } catch (error) {
        console.error('Error al cargar el kardex:', error);
        alert('Ocurrió un error al cargar el kardex.');
    }
});