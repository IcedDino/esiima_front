document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('documents-login-form');
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('studentName', data.full_name);
          localStorage.setItem('userRole', data.role || 'student');
          alert('Acceso correcto. Ahora sube tus documentos obligatorios.');
          window.location.href = '/pages/enroll/documents.html';
        } else {
          alert('Login correcto pero no se recibió token.');
        }
      } else {
        const err = await response.json();
        alert(err.detail || 'Error de acceso.');
      }
    } catch (error) {
      console.error('Error de acceso para documentos:', error);
      alert('Ocurrió un error al acceder.');
    }
  });
});
