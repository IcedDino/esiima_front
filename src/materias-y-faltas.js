document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch materias y faltas data
    try {
        const response = await fetch(`${backendUrl}/materias/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('materias-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 9;
                cell.textContent = 'No hay materias para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(materia => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = materia.horas_semana;
                    row.insertCell().textContent = materia.nombre;
                    row.insertCell().textContent = materia.semestre;
                    row.insertCell().textContent = materia.grupo;
                    row.insertCell().textContent = materia.faltas_permitidas;
                    row.insertCell().textContent = materia.total_faltas;
                    row.insertCell().textContent = materia.horas_teoricas;
                    row.insertCell().textContent = materia.horas_practicas;
                    
                    const detalleCell = row.insertCell();
                    const detalleLink = document.createElement('a');
                    detalleLink.href = '#';
                    detalleLink.textContent = 'Detalle';
                    detalleLink.dataset.materiaId = materia.id;
                    detalleLink.dataset.materiaNombre = materia.nombre;
                    detalleCell.appendChild(detalleLink);
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar las materias y faltas.');
        }
    } catch (error) {
        console.error('Error al cargar las materias y faltas:', error);
        alert('Ocurrió un error al cargar las materias y faltas.');
    }

    // Handle "Detalle" click
    document.getElementById('materias-table-body').addEventListener('click', async function(event) {
        if (event.target.tagName === 'A' && event.target.textContent === 'Detalle') {
            event.preventDefault();
            const materiaId = event.target.dataset.materiaId;
            const materiaNombre = event.target.dataset.materiaNombre;
            const detalleContainer = document.getElementById('detalle-faltas-container');
            const detalleMateria = document.getElementById('detalle-faltas-materia');
            const detalleTableBody = document.getElementById('detalle-faltas-table-body');

            detalleMateria.textContent = `Detalle de Faltas para: ${materiaNombre}`;
            detalleTableBody.innerHTML = ''; // Clear previous details
            detalleContainer.style.display = 'block';

            try {
                const response = await fetch(`${backendUrl}/faltas/me/${materiaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        const row = detalleTableBody.insertRow();
                        const cell = row.insertCell();
                        cell.textContent = 'No hay faltas registradas para esta materia.';
                    } else {
                        data.forEach(falta => {
                            const row = detalleTableBody.insertRow();
                            row.insertCell().textContent = new Date(falta.fecha).toLocaleDateString();
                        });
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Error al cargar el detalle de faltas.');
                }
            } catch (error) {
                console.error('Error al cargar el detalle de faltas:', error);
                alert('Ocurrió un error al cargar el detalle de faltas.');
            }
        }
    });
});