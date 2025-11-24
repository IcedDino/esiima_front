document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/extracurriculares`, {
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
                cell.colSpan = 11;
                cell.textContent = 'No hay actividades extracurriculares para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(activity => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = activity.id;
                    row.insertCell().textContent = activity.nombre;
                    row.insertCell().textContent = activity.descripcion;
                    row.insertCell().textContent = activity.tipo;
                    row.insertCell().textContent = new Date(activity.fecha_inicio).toLocaleDateString();
                    row.insertCell().textContent = new Date(activity.fecha_fin).toLocaleDateString();
                    row.insertCell().textContent = activity.cupo_maximo;
                    row.insertCell().textContent = activity.cupo_actual;
                    row.insertCell().textContent = activity.responsable_id;
                    row.insertCell().textContent = activity.activo ? 'Sí' : 'No';
                    row.insertCell().textContent = new Date(activity.created_at).toLocaleString();
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar las actividades extracurriculares.');
        }
    } catch (error) {
        console.error('Error al cargar las actividades extracurriculares:', error);
        alert('Ocurrió un error al cargar las actividades extracurriculares.');
    }
});