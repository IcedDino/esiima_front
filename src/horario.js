document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    //Random line to force deploy

    // Fetch horario data
    try {
        const response = await fetch(`${backendUrl}/horario/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('horario-table-body');
            
            if (Object.keys(data).length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 7;
                cell.textContent = 'No hay horario para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                for (const hora in data) {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = hora;
                    const dias = data[hora];
                    row.insertCell().textContent = dias.LUNES || '';
                    row.insertCell().textContent = dias.MARTES || '';
                    row.insertCell().textContent = dias.MIERCOLES || '';
                    row.insertCell().textContent = dias.JUEVES || '';
                    row.insertCell().textContent = dias.VIERNES || '';
                    row.insertCell().textContent = dias.SABADO || '';
                }
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar el horario.');
        }
    } catch (error) {
        console.error('Error al cargar el horario:', error);
        alert('Ocurrió un error al cargar el horario.');
    }
});