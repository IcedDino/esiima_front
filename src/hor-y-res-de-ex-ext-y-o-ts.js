document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch exam data
    try {
        const response = await fetch(`${backendUrl}/examenes/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('examenes-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 5;
                cell.textContent = 'No hay exámenes para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(examen => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = examen.materia;
                    row.insertCell().textContent = examen.semestre;
                    row.insertCell().textContent = examen.calificacion;
                    row.insertCell().textContent = examen.maestro;
                    row.insertCell().textContent = examen.lugar_fecha_hora;
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar los exámenes.');
        }
    } catch (error) {
        console.error('Error al cargar los exámenes:', error);
        alert('Ocurrió un error al cargar los exámenes.');
    }
});