document.addEventListener('DOMContentLoaded', async () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/alumnos/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            populateStudentData(data);
        } else {
            // Token is invalid or expired
            localStorage.removeItem('accessToken');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
});

function populateStudentData(data) {
    // 1. Construct Full Name safely
    const nombreCompleto = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno || ''}`.trim();

    // 2. Extract Career Name safely (it's nested inside plan_estudio -> carrera)
    const carreraNombre = data.plan_estudio?.carrera?.nombre || 'N/A';

    // --- Header Section ---
    // These fields are missing in the JSON, so we use placeholders or static values
    document.getElementById('ciclo-escolar').textContent = '2025-1';
    document.getElementById('nivel-estudios').textContent = 'Licenciatura';

    // Mapped Fields
    document.getElementById('carrera').textContent = carreraNombre;
    document.getElementById('semestre-grupo').textContent = `${data.cuatrimestre_actual}° Cuatrimestre`;
    document.getElementById('nombre-alumno-header').textContent = nombreCompleto;
    document.getElementById('cursa-actualmente').textContent = 'SÍ'; // Assumed active

    // --- Info Section ---
    document.getElementById('id-personal').textContent = data.matricula || 'N/A'; // Mapped 'matricula' to 'id-personal'
    document.getElementById('nombre-alumno-info').textContent = nombreCompleto;
    document.getElementById('situacion-academica').textContent = 'Regular'; // Default (missing in JSON)
    document.getElementById('promedio-acumulado').textContent = data.promedio_general || '0.0';
    document.getElementById('alto-riesgo').textContent = 'NO';
    document.getElementById('adeuda-materias').textContent = '0';
    document.getElementById('generacion').textContent = '2025';
}