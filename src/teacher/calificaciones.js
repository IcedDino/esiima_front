document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const token = localStorage.getItem('accessToken');

    if (localStorage.getItem('userRole') !== 'docente') {
        alert('Acceso denegado. Esta página es solo para profesores.');
        window.location.href = '/index.html';
        return;
    }

    const groupsContainer = document.getElementById('groups-container');
    const gradesContainer = document.getElementById('grades-container');
    const groupsTableBody = document.getElementById('groups-table-body');
    const gradesTableBody = document.getElementById('grades-table-body');
    const saveGradesBtn = document.getElementById('save-grades-btn');
    const backToGroupsBtn = document.getElementById('back-to-groups-btn');
    const gradesTitle = document.getElementById('grades-title');

    let selectedGroup = null;

    // --- 1. Fetch and Display Active Groups ---
    async function loadGroups() {
        try {
            // ASSUMED ENDPOINT: GET /api/teacher/groups
            const response = await fetch(`${backendUrl}/teacher/groups`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar los grupos.');
            
            const groups = await response.json();

            groupsTableBody.innerHTML = '';
            if (groups.length === 0) {
                groupsTableBody.innerHTML = '<tr><td colspan="3">No tienes grupos activos.</td></tr>';
                return;
            }

            groups.forEach(group => {
                const row = groupsTableBody.insertRow();
                row.innerHTML = `
                    <td>${group.materia.nombre}</td>
                    <td>${group.nombre}</td>
                    <td><button class="btn btn-info btn-sm details-btn" data-group-id="${group.id}">Detalles</button></td>
                `;
            });

            document.querySelectorAll('.details-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const groupId = e.target.getAttribute('data-group-id');
                    selectedGroup = groups.find(g => g.id == groupId);
                    showGradesTable();
                });
            });
        } catch (error) {
            console.error(error);
            groupsTableBody.innerHTML = `<tr><td colspan="3">Simulación: No se pudo conectar. Usando datos de ejemplo.</td></tr>`;
            const dummyGroups = [{ id: 1, materia: { nombre: 'Cálculo (Ejemplo)' }, nombre: 'A-101' }];
            dummyGroups.forEach(group => {
                 const row = groupsTableBody.insertRow();
                 row.innerHTML = `<td>${group.materia.nombre}</td><td>${group.nombre}</td><td><button class="btn btn-info btn-sm details-btn" data-group-id="${group.id}">Detalles</button></td>`;
            });
            document.querySelector('.details-btn').addEventListener('click', () => {
                selectedGroup = dummyGroups[0];
                showGradesTable();
            });
        }
    }

    // --- 2. Show Student Grades Table ---
    async function showGradesTable() {
        groupsContainer.style.display = 'none';
        gradesContainer.style.display = 'block';
        gradesTitle.textContent = `Calificaciones - ${selectedGroup.materia.nombre} (${selectedGroup.nombre})`;

        try {
            // ASSUMED ENDPOINT: GET /api/groups/{groupId}/grades
            const response = await fetch(`${backendUrl}/groups/${selectedGroup.id}/grades`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar las calificaciones.');
            const gradesData = await response.json();

            gradesTableBody.innerHTML = '';
            gradesData.forEach(studentGrade => {
                const row = gradesTableBody.insertRow();
                row.dataset.studentId = studentGrade.student.id;
                row.innerHTML = `
                    <td>${studentGrade.student.matricula}</td>
                    <td>${studentGrade.student.nombre}</td>
                    <td><input type="number" class="form-control grade-input" data-partial="1" value="${studentGrade.parcial1 || ''}" min="0" max="10" step="0.1"></td>
                    <td><input type="number" class="form-control grade-input" data-partial="2" value="${studentGrade.parcial2 || ''}" min="0" max="10" step="0.1"></td>
                    <td><input type="number" class="form-control grade-input" data-partial="3" value="${studentGrade.parcial3 || ''}" min="0" max="10" step="0.1"></td>
                    <td class="average-cell"></td>
                `;
                updateAverage(row);
            });

            gradesTableBody.querySelectorAll('.grade-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    updateAverage(e.target.closest('tr'));
                });
            });

        } catch (error) {
            console.error(error);
            gradesTableBody.innerHTML = `<tr><td colspan="6">Simulación: No se pudo conectar. Usando datos de ejemplo.</td></tr>`;
            const dummyGrades = [{ student: { id: 101, matricula: '2020101', nombre: 'Juan Pérez (Ejemplo)' }, parcial1: 8.5, parcial2: 9.0, parcial3: 7.5 }];
            dummyGrades.forEach(studentGrade => {
                const row = gradesTableBody.insertRow();
                row.dataset.studentId = studentGrade.student.id;
                row.innerHTML = `<td>${studentGrade.student.matricula}</td><td>${studentGrade.student.nombre}</td><td><input type="number" class="form-control grade-input" data-partial="1" value="${studentGrade.parcial1 || ''}"></td><td><input type="number" class="form-control grade-input" data-partial="2" value="${studentGrade.parcial2 || ''}"></td><td><input type="number" class="form-control grade-input" data-partial="3" value="${studentGrade.parcial3 || ''}"></td><td class="average-cell"></td>`;
                updateAverage(row);
            });
             gradesTableBody.querySelectorAll('.grade-input').forEach(input => {
                input.addEventListener('input', (e) => updateAverage(e.target.closest('tr')));
            });
        }
    }

    // --- 3. Update Average Calculation ---
    function updateAverage(row) {
        const inputs = row.querySelectorAll('.grade-input');
        let total = 0;
        let count = 0;
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                total += value;
                count++;
            }
        });
        const average = count > 0 ? (total / count).toFixed(2) : '';
        row.querySelector('.average-cell').textContent = average;
    }

    // --- 4. Save Grades ---
    async function saveGrades() {
        const gradesData = [];
        const rows = gradesTableBody.querySelectorAll('tr[data-student-id]');
        rows.forEach(row => {
            const studentId = row.dataset.studentId;
            const parcial1 = row.querySelector('[data-partial="1"]').value;
            const parcial2 = row.querySelector('[data-partial="2"]').value;
            const parcial3 = row.querySelector('[data-partial="3"]').value;
            gradesData.push({
                student_id: studentId,
                parcial1: parcial1 ? parseFloat(parcial1) : null,
                parcial2: parcial2 ? parseFloat(parcial2) : null,
                parcial3: parcial3 ? parseFloat(parcial3) : null,
            });
        });

        try {
            // ASSUMED ENDPOINT: POST /api/groups/{groupId}/grades
            const response = await fetch(`${backendUrl}/groups/${selectedGroup.id}/grades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gradesData)
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.detail || 'Error al guardar las calificaciones.');
            }
            
            alert('Calificaciones guardadas con éxito.');
            loadGroups(); // Go back to the groups list
            gradesContainer.style.display = 'none';
            groupsContainer.style.display = 'block';

        } catch (error) {
            console.error(error);
            alert(`Error en simulación: ${error.message}`);
        }
    }

    // --- Event Listeners for Buttons ---
    saveGradesBtn.addEventListener('click', saveGrades);
    backToGroupsBtn.addEventListener('click', () => {
        gradesContainer.style.display = 'none';
        groupsContainer.style.display = 'block';
    });

    // --- Initial Load ---
    loadGroups();
});