document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/serviciosocial/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('servicio-social-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 9;
                cell.textContent = 'No hay información de servicio social para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(servicio => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = servicio.institucion;
                    row.insertCell().textContent = servicio.dependencia;
                    row.insertCell().textContent = servicio.programa;
                    row.insertCell().textContent = servicio.horas_requeridas;
                    row.insertCell().textContent = servicio.horas_cumplidas;
                    row.insertCell().textContent = new Date(servicio.fecha_inicio).toLocaleDateString();
                    row.insertCell().textContent = new Date(servicio.fecha_fin).toLocaleDateString();
                    row.insertCell().textContent = servicio.estatus_id; // You might want to map this ID to a name
                    
                    const docsCell = row.insertCell();
                    if (servicio.documento_url) {
                        const docLink = document.createElement('a');
                        docLink.href = servicio.documento_url;
                        docLink.textContent = 'Ver Documento';
                        docLink.target = '_blank';
                        docsCell.appendChild(docLink);
                    }
                    if (servicio.carta_aceptacion_url) {
                        const cartaLink = document.createElement('a');
                        cartaLink.href = servicio.carta_aceptacion_url;
                        cartaLink.textContent = 'Ver Carta';
                        cartaLink.target = '_blank';
                        docsCell.appendChild(document.createElement('br'));
                        docsCell.appendChild(cartaLink);
                    }
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar la información de servicio social.');
        }
    } catch (error) {
        console.error('Error al cargar la información de servicio social:', error);
        alert('Ocurrió un error al cargar la información de servicio social.');
    }
});