document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

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
                cell.colSpan = 3;
                cell.textContent = 'No hay documentos para mostrar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(doc => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = doc.nombre;
                    row.insertCell().textContent = doc.entregado ? 'SI' : 'NO';
                    
                    const actionsCell = row.insertCell();
                    if (!doc.entregado) {
                        const uploadButton = document.createElement('button');
                        uploadButton.textContent = 'Subir';
                        uploadButton.className = 'btn btn-primary btn-sm';
                        uploadButton.onclick = () => {
                            fileInput.onchange = async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    await uploadDocument(doc.id, file);
                                }
                            };
                            fileInput.click();
                        };
                        actionsCell.appendChild(uploadButton);
                    }
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

    async function uploadDocument(docId, file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${backendUrl}/documentos/${docId}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Documento subido con éxito.');
                location.reload(); // Refresh the page to show the updated status
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Error al subir el documento.');
            }
        } catch (error) {
            console.error('Error al subir el documento:', error);
            alert('Ocurrió un error al subir el documento.');
        }
    }
});