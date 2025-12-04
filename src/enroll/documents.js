document.addEventListener('DOMContentLoaded', async function() {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('Necesitas acceder para subir documentos.');
    window.location.href = '/pages/enroll/documents-login.html';
    return;
  }

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

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
        location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Error al subir el documento.');
      }
    } catch (error) {
      console.error('Error al subir el documento:', error);
      alert('Ocurrió un error al subir el documento.');
    }
  }

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
      const tableBody = document.getElementById('enroll-documents-table-body');

      if (!Array.isArray(data) || data.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 3;
        cell.textContent = 'No hay documentos para mostrar.';
        cell.style.textAlign = 'center';
      } else {
        let deliveredCount = 0;
        let mandatoryCount = 0;
        data.forEach(doc => {
          const row = tableBody.insertRow();
          row.insertCell().textContent = doc.nombre;
          row.insertCell().textContent = doc.entregado ? 'Entregado' : 'Pendiente';

          const actionsCell = row.insertCell();
          const uploadBtn = document.createElement('button');
          uploadBtn.className = 'btn btn-primary btn-sm';
          uploadBtn.textContent = 'Subir';
          uploadBtn.disabled = doc.entregado === true;
          uploadBtn.addEventListener('click', () => {
            fileInput.onchange = () => {
              const file = fileInput.files[0];
              if (file) uploadDocument(doc.id, file);
              fileInput.value = '';
            };
            fileInput.click();
          });
          actionsCell.appendChild(uploadBtn);

          if (doc.entregado) deliveredCount++;
          mandatoryCount++;
        });

        const finishBtn = document.getElementById('finish-enrollment-btn');
        if (finishBtn) {
          finishBtn.style.display = deliveredCount >= mandatoryCount ? 'inline-block' : 'none';
          finishBtn.addEventListener('click', () => {
            alert('¡Gracias! Has completado la carga de documentos. Puedes iniciar sesión ahora.');
            window.location.href = '/index.html';
          });
        }
      }
    } else {
      const errorData = await response.json();
      alert(errorData.detail || 'Error al cargar documentos.');
    }
  } catch (error) {
    console.error('Error al cargar documentos:', error);
    alert('Ocurrió un error al cargar los documentos.');
  }
});
