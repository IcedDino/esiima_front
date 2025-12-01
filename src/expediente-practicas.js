document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/practicas/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('practicas-prof-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 9;
                cell.textContent = 'No hay información de prácticas profesionales para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(practica => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = practica.empresa;
                    row.insertCell().textContent = practica.puesto;
                    row.insertCell().textContent = practica.area;
                    row.insertCell().textContent = practica.horas_requeridas;
                    row.insertCell().textContent = practica.horas_cumplidas;
                    row.insertCell().textContent = new Date(practica.fecha_inicio).toLocaleDateString();
                    row.insertCell().textContent = new Date(practica.fecha_fin).toLocaleDateString();
                    row.insertCell().textContent = practica.estatus_id; // You might want to map this ID to a name
                    
                    const docsCell = row.insertCell();
                    if (practica.documento_url) {
                        const docLink = document.createElement('a');
                        docLink.href = practica.documento_url;
                        docLink.textContent = 'Ver Documento';
                        docLink.target = '_blank';
                        docsCell.appendChild(docLink);
                    }
                    if (practica.carta_aceptacion_url) {
                        const cartaLink = document.createElement('a');
                        cartaLink.href = practica.carta_aceptacion_url;
                        cartaLink.textContent = 'Ver Carta';
                        cartaLink.target = '_blank';
                        docsCell.appendChild(document.createElement('br'));
                        docsCell.appendChild(cartaLink);
                    }
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar la información de prácticas profesionales.');
        }
    } catch (error) {
        console.error('Error al cargar la información de prácticas profesionales:', error);
        alert('Ocurrió un error al cargar la información de prácticas profesionales.');
    }
});