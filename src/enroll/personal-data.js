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
                await response.json();
                alert('Datos personales registrados con éxito. Inicia sesión para continuar.');
                window.location.href = '/index.html';
            } else {
                let message = `Error al registrar datos personales (HTTP ${response.status})`;
                try {
                    const text = await response.text();
                    try {
                        const json = JSON.parse(text);
                        if (json.detail || json.message) {
                            message += `: ${json.detail || json.message}`;
                        } else {
                            message += `: ${text.slice(0, 200)}`;
                        }
                    } catch {
                        message += `: ${text.slice(0, 200)}`;
                    }
                } catch {
                    // ignore
                }
                alert(message);
            }
        } catch (error) {
            console.error('Error durante el registro de datos personales:', error);
            alert(`Ocurrió un error al registrar los datos personales: ${error?.name || 'Error'} - ${error?.message || 'Load failed'}. Posible CORS o servidor no disponible.`);
        }
    });
});
