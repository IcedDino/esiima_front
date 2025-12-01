document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch requisitos data
    try {
        const response = await fetch(`${backendUrl}/requisitos/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('requisitos-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 4;
                cell.textContent = 'No hay requisitos para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(requisito => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = requisito.nombre;
                    row.insertCell().textContent = requisito.unidades_a_cubrir;
                    row.insertCell().textContent = requisito.tipo_unidad;
                    row.insertCell().textContent = requisito.unidades_cubiertas;
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar los requisitos de titulación.');
        }
    } catch (error) {
        console.error('Error al cargar los requisitos de titulación:', error);
        alert('Ocurrió un error al cargar los requisitos de titulación.');
    }
});