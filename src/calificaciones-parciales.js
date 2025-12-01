document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/calificaciones/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched calificaciones data:', data); // Log the data for debugging
            const tableBody = document.getElementById('calificaciones-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 6;
                cell.textContent = 'No hay calificaciones para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(calificacion => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = calificacion.materia.nombre;
                    row.insertCell().textContent = calificacion.grupo.nombre;
                    row.insertCell().textContent = calificacion.parcial1 || 'N/A';
                    row.insertCell().textContent = calificacion.parcial2 || 'N/A';
                    row.insertCell().textContent = calificacion.parcial3 || 'N/A';
                    row.insertCell().textContent = calificacion.promedio || 'N/A';
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar las calificaciones.');
        }
    } catch (error) {
        console.error('Error al cargar las calificaciones:', error);
        alert('Ocurrió un error al cargar las calificaciones.');
    }
});