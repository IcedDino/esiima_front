document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personal-data-form');
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellidoPaterno = document.getElementById('apellidoPaterno').value;
        const apellidoMaterno = document.getElementById('apellidoMaterno').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const curp = document.getElementById('curp').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/enroll/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    fechaNacimiento,
                    curp,
                    email,
                    password
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Assuming the backend returns a temporary token or user ID for the enrollment process
                // or directly logs in the user and provides an accessToken
                if (data.access_token) {
                    localStorage.setItem('accessToken', data.access_token);
                    localStorage.setItem('studentName', data.student_name);
                    localStorage.setItem('userRole', 'student'); // New students are students
                }
                alert('Datos personales registrados con éxito. Ahora sube tus documentos.');
                window.location.href = '/pages/enroll/documents.html';
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Error al registrar datos personales.');
            }
        } catch (error) {
            console.error('Error durante el registro de datos personales:', error);
            alert('Ocurrió un error al registrar los datos personales.');
        }
    });
});