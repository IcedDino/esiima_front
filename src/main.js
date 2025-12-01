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
    // Helper function to safely set the text content of an element if it exists
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    };

    // 1. Construct Full Name safely
    const nombreCompleto = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno || ''}`.trim();

    // Store in localStorage so the global header can display the name
    try {
        localStorage.setItem('studentName', nombreCompleto);
    } catch (e) {
        console.warn('No se pudo guardar el nombre del alumno en localStorage', e);
    }

    // 2. Extract Career Name safely (it's nested inside plan_estudio -> carrera)
    const carreraNombre = data.plan_estudio?.carrera?.nombre || 'N/A';

    // --- Header Section (present on all pages) ---
    setText('ciclo-escolar', '2025-1');
    setText('nivel-estudios', 'Licenciatura');
    setText('carrera', carreraNombre);
    setText('semestre-grupo', `${data.cuatrimestre_actual}° Cuatrimestre`);
    setText('nombre-alumno-header', nombreCompleto);
    setText('cursa-actualmente', 'SÍ'); // Assumed active

    // --- Info Section (only on situacion-actual page) ---
    setText('id-personal', data.matricula || 'N/A');
    setText('nombre-alumno-info', nombreCompleto);
    setText('situacion-academica', 'Regular'); // Default (missing in JSON)
    setText('promedio-acumulado', data.promedio_general || '0.0');
    setText('alto-riesgo', 'NO');
    setText('adeuda-materias', '0');
    setText('generacion', '2025');
}