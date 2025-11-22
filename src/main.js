document.addEventListener('DOMContentLoaded', async () => {
    // 1. REMOVE the LocalStorage check. We can't see the cookie from JS.
    // const token = localStorage.getItem('accessToken');
    // if (!token) ...

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    try {
        // 2. Update the fetch request
        const response = await fetch(`${backendUrl}/alumnos/me`, {
            // REMOVE Authorization Header
            // headers: { 'Authorization': `Bearer ${token}` },

            // ADD credentials: 'include'. This tells the browser to send the cookie.
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            populateStudentData(data);
        } else {
            // If the cookie is missing or invalid, the backend returns 401.
            // THIS is where we redirect to login.
            console.error('Failed to fetch student data:', await response.text());
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
});

function populateStudentData(data) {
    // Header section
    document.getElementById('ciclo-escolar').textContent = data.ciclo_escolar || 'N/A';
    document.getElementById('nivel-estudios').textContent = data.nivel_estudios || 'N/A';
    document.getElementById('carrera').textContent = data.carrera || 'N/A';
    document.getElementById('semestre-grupo').textContent = data.semestre_grupo || 'N/A';
    document.getElementById('nombre-alumno-header').textContent = data.nombre_completo || 'N/A';
    document.getElementById('cursa-actualmente').textContent = data.cursa_actualmente || 'N/A';

    // Info section
    document.getElementById('id-personal').textContent = data.id_personal || 'N/A';
    document.getElementById('nombre-alumno-info').textContent = data.nombre_completo || 'N/A';
    document.getElementById('situacion-academica').textContent = data.situacion_academica || 'N/A';
    document.getElementById('promedio-acumulado').textContent = data.promedio_acumulado || 'N/A';
    document.getElementById('alto-riesgo').textContent = data.alto_riesgo ? 'SÍ' : 'NO';
    document.getElementById('adeuda-materias').textContent = data.adeuda_materias || '0';
    document.getElementById('generacion').textContent = data.generacion || 'N/A';
}