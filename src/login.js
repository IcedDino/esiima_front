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
            // 1. Parse the JSON response to get the token
            const data = await response.json();

            // 2. Save the token to LocalStorage explicitly
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                window.location.href = '/main.html';
            } else {
                console.error("Token missing in response");
                alert("Login successful but no token received.");
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
    }
});