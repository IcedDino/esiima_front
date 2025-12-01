document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch student info
    try {
        const response = await fetch(`${backendUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('ciclo-escolar').textContent = user.ciclo_escolar || 'N/A';
            document.getElementById('nivel-estudios').textContent = user.nivel_estudios || 'N/A';
            document.getElementById('carrera').textContent = user.carrera || 'N/A';
            document.getElementById('semestre-grupo').textContent = user.semestre_grupo || 'N/A';
            document.getElementById('nombre-alumno').textContent = user.nombre || 'N/A';
            document.getElementById('cursa-actualmente').textContent = user.cursa_actualmente || 'N/A';
        } else {
            console.error('Error al cargar la información del alumno.');
        }
    } catch (error) {
        console.error('Error al cargar la información del alumno:', error);
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
                cell.colSpan = 4;
                cell.textContent = 'No hay documentos para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(doc => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = doc.clave_doc;
                    row.insertCell().textContent = doc.nombre;
                    row.insertCell().textContent = doc.entregado ? 'SI' : 'NO';
                    row.insertCell().textContent = doc.observaciones || '--';
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