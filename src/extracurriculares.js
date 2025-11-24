document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/extracurriculares/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('extracurriculares-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 8;
                cell.textContent = 'No estás inscrito en ninguna actividad extracurricular.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(enrollment => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = enrollment.extracurricular.nombre;
                    row.insertCell().textContent = enrollment.extracurricular.descripcion;
                    row.insertCell().textContent = enrollment.extracurricular.tipo;
                    row.insertCell().textContent = new Date(enrollment.fecha_inscripcion).toLocaleDateString();
                    row.insertCell().textContent = enrollment.calificacion || 'N/A';
                    row.insertCell().textContent = enrollment.horas_cumplidas;
                    row.insertCell().textContent = enrollment.completado ? 'Sí' : 'No';
                    row.insertCell().textContent = enrollment.fecha_completado ? new Date(enrollment.fecha_completado).toLocaleDateString() : 'N/A';
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar tus actividades extracurriculares.');
        }
    } catch (error) {
        console.error('Error al cargar tus actividades extracurriculares:', error);
        alert('Ocurrió un error al cargar tus actividades extracurriculares.');
    }
});