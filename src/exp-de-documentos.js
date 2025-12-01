document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch documents
    try {
        const response = await fetch(`${backendUrl}/documentos/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('documentos-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 2; // Adjusted colSpan for 2 columns
                cell.textContent = 'No hay documentos para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(doc => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = doc.nombre;
                    row.insertCell().textContent = doc.entregado ? 'SI' : 'NO';
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar los documentos.');
        }
    } catch (error) {
        console.error('Error al cargar los documentos:', error);
        alert('Ocurrió un error al cargar los documentos.');
    }
});