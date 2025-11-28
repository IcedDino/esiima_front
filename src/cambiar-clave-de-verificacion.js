document.getElementById('change-verification-key-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const currentVerificationKey = document.getElementById('current-verification-key').value;
    const newVerificationKey = document.getElementById('new-verification-key').value;
    const confirmVerificationKey = document.getElementById('confirm-verification-key').value;

    if (newVerificationKey !== confirmVerificationKey) {
        alert('Las nuevas claves de verificación no coinciden.');
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
        const response = await fetch(`${backendUrl}/users/me/verification-key`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                current_verification_key: currentVerificationKey,
                new_verification_key: newVerificationKey
            })
        });

        if (response.ok) {
            alert('Clave de verificación cambiada exitosamente.');
            window.location.href = '/pages/main.html';
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cambiar la clave de verificación.');
        }
    } catch (error) {
        console.error('Error al cambiar la clave de verificación:', error);
        alert('Ocurrió un error al cambiar la clave de verificación.');
    }
});