document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch non-approved subjects
    try {
        const response = await fetch(`${backendUrl}/materias/no-aprobadas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('materias-no-aprobadas-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 2;
                cell.textContent = 'No hay materias no aprobadas para solicitar examen.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(materia => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = materia.nombre;
                    const checkboxCell = row.insertCell();
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = materia.id;
                    checkboxCell.appendChild(checkbox);
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar las materias no aprobadas.');
        }
    } catch (error) {
        console.error('Error al cargar las materias no aprobadas:', error);
        alert('Ocurrió un error al cargar las materias no aprobadas.');
    }

    // Handle form submission
    document.getElementById('solicitud-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const selectedMaterias = [];
        const checkboxes = document.querySelectorAll('#materias-no-aprobadas-table-body input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            selectedMaterias.push(checkbox.value);
        });

        if (selectedMaterias.length === 0) {
            alert('Debes seleccionar al menos una materia.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/solicitudes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    materias: selectedMaterias
                })
            });

            if (response.ok) {
                alert('Solicitud enviada exitosamente.');
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Error al enviar la solicitud.');
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Ocurrió un error al enviar la solicitud.');
        }
    });
});