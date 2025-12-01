document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch user data
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
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('email').value = user.email;
            document.getElementById('calle').value = user.calle || '';
            document.getElementById('num_ext').value = user.num_ext || '';
            document.getElementById('num_int').value = user.num_int || '';
            document.getElementById('colonia').value = user.colonia || '';
            document.getElementById('codigo_postal').value = user.codigo_postal || '';
            document.getElementById('municipio').value = user.municipio || '';
            document.getElementById('estado').value = user.estado || '';
            document.getElementById('telefono').value = user.telefono || '';
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar los datos del usuario.');
        }
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        alert('Ocurrió un error al cargar los datos del usuario.');
    }

    // Handle form submission
    document.getElementById('datos-personales-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const updatedUser = {
            email: document.getElementById('email').value,
            calle: document.getElementById('calle').value,
            num_ext: document.getElementById('num_ext').value,
            num_int: document.getElementById('num_int').value,
            colonia: document.getElementById('colonia').value,
            codigo_postal: document.getElementById('codigo_postal').value,
            municipio: document.getElementById('municipio').value,
            estado: document.getElementById('estado').value,
            telefono: document.getElementById('telefono').value,
        };

        try {
            const response = await fetch(`${backendUrl}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                alert('Datos actualizados exitosamente.');
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Error al actualizar los datos.');
            }
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            alert('Ocurrió un error al actualizar los datos.');
        }
    });
});