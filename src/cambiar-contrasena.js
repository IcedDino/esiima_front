document.getElementById('change-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Las nuevas contraseñas no coinciden.');
        return;
    }

    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/users/me/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });

        if (response.ok) {
            alert('Contraseña cambiada exitosamente.');
            window.location.href = '/pages/main.html';
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cambiar la contraseña.');
        }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        alert('Ocurrió un error al cambiar la contraseña.');
    }
});