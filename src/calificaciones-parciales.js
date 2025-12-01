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
            const tableHead = document.getElementById('calificaciones-table-head');
            const tableBody = document.getElementById('calificaciones-table-body');
            
            if (!tableHead || !tableBody) {
                console.error('Table head or body element not found!');
                return;
            }

            if (data.length === 0) {
                const headerRow = tableHead.insertRow();
                const th = document.createElement('th');
                th.className = 'EtiquetaEnc';
                th.textContent = 'Materia';
                headerRow.appendChild(th);

                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 1; // Only Materia header
                cell.textContent = 'No hay calificaciones para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                // Dynamically create headers
                const headerRow = tableHead.insertRow();
                const materiaTh = document.createElement('th');
                materiaTh.className = 'EtiquetaEnc';
                materiaTh.textContent = 'Materia';
                headerRow.appendChild(materiaTh);

                const grupoTh = document.createElement('th');
                grupoTh.className = 'EtiquetaEnc';
                grupoTh.textContent = 'Grupo';
                headerRow.appendChild(grupoTh);

                let partialKeys = [];
                if (data.length > 0 && typeof data[0] === 'object') {
                    partialKeys = Object.keys(data[0]).filter(key => key.startsWith('parcial') || key === 'promedio');
                    partialKeys.sort((a, b) => {
                        if (a.startsWith('parcial') && b.startsWith('parcial')) {
                            return parseInt(a.replace('parcial', '')) - parseInt(b.replace('parcial', ''));
                        }
                        if (a === 'promedio') return 1; // 'promedio' should come last
                        if (b === 'promedio') return -1;
                        return 0;
                    });
                }


                partialKeys.forEach(key => {
                    const th = document.createElement('th');
                    th.className = 'EtiquetaEnc';
                    th.textContent = key.replace('parcial', 'Parcial ').replace('promedio', 'Promedio Final');
                    headerRow.appendChild(th);
                });

                // Populate table body
                data.forEach(calificacion => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = calificacion.materia?.nombre || 'N/A';
                    row.insertCell().textContent = calificacion.grupo?.nombre || 'N/A';
                    partialKeys.forEach(key => {
                        row.insertCell().textContent = calificacion[key] || 'N/A';
                    });
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