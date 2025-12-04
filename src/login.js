document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    try {
        const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('studentName', data.full_name);
                
                // Store role in localStorage (convert backend role to frontend format)
                // Backend returns "teacher" or "student", frontend expects "Docente" or "student"
                if (data.role === 'teacher') {
                    localStorage.setItem('userRole', 'Docente');
                    window.location.href = '/pages/teacher/asistencia.html';
                } else if (data.role === 'student') {
                    localStorage.setItem('userRole', 'student');
                    localStorage.setItem('documentsRequired', data.requires_documents ? 'true' : 'false');
                    if (data.requires_documents) {
                        alert(`Debes subir documentos obligatorios: ${(data.missing_documents || []).join(', ')}`);
                        window.location.href = '/pages/exp-de-documentos.html';
                    } else {
                        window.location.href = '/pages/situacion-actual.html';
                    }
                } else {
                    localStorage.setItem('userRole', data.role || 'student');
                    window.location.href = '/pages/situacion-actual.html';
                }
            } else {
                alert("Login successful but no token received.");
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});
