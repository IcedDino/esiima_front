document.addEventListener('DOMContentLoaded', async () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    // 1. Retrieve the token from LocalStorage
    const token = localStorage.getItem('accessToken');

    // 2. If no token exists, redirect immediately to login
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/alumnos/me`, {
            headers: {
                // 3. Send the token in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            populateStudentData(data);
        } else {
            console.error('Failed to fetch student data:', await response.text());
            // If the token is invalid (expired), clear it and redirect
            localStorage.removeItem('accessToken');
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