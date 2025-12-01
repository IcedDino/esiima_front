document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use a fallback for the assumed API
    const token = localStorage.getItem('accessToken');

    if (localStorage.getItem('userRole') !== 'Docente') {
        alert('Acceso denegado. Esta página es solo para profesores.');
        window.location.href = '/index.html';
        return;
    }

    const groupsContainer = document.getElementById('groups-container');
    const calendarContainer = document.getElementById('calendar-container');
    const attendanceContainer = document.getElementById('attendance-container');
    const groupsTableBody = document.getElementById('groups-table-body');
    const calendarDiv = document.getElementById('calendar');
    const attendanceTableBody = document.getElementById('attendance-table-body');
    const saveAttendanceBtn = document.getElementById('save-attendance-btn');
    const backToCalendarBtn = document.getElementById('back-to-calendar-btn');
    const calendarTitle = document.getElementById('calendar-title');
    const attendanceTitle = document.getElementById('attendance-title');

    let selectedGroup = null;
    let currentDate = new Date();

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
                    showCalendar();
                });
            });
        } catch (error) {
            console.error(error);
            groupsTableBody.innerHTML = `<tr><td colspan="3">Simulación: No se pudo conectar al backend. Usando datos de ejemplo.</td></tr>`;
            // Fallback to dummy data on error
            const dummyGroups = [{ id: 1, materia: { nombre: 'Cálculo (Ejemplo)' }, nombre: 'A-101' }];
            dummyGroups.forEach(group => {
                 const row = groupsTableBody.insertRow();
                 row.innerHTML = `<td>${group.materia.nombre}</td><td>${group.nombre}</td><td><button class="btn btn-info btn-sm details-btn" data-group-id="${group.id}">Detalles</button></td>`;
            });
            document.querySelector('.details-btn').addEventListener('click', () => {
                selectedGroup = dummyGroups[0];
                showCalendar();
            });
        }
    }

    // --- 2. Show and Generate Calendar ---
    function showCalendar() {
        groupsContainer.style.display = 'none';
        attendanceContainer.style.display = 'none';
        calendarContainer.style.display = 'block';
        calendarTitle.textContent = `Calendario de Asistencia - ${selectedGroup.materia.nombre} (${selectedGroup.nombre})`;
        
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }

    function generateCalendar(year, month) {
        calendarDiv.innerHTML = ''; // Clear previous calendar

        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-center mb-3';
        
        const prevMonthBtn = document.createElement('button');
        prevMonthBtn.className = 'btn btn-outline-secondary';
        prevMonthBtn.textContent = '<';
        prevMonthBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        };

        const monthYearTitle = document.createElement('h4');
        monthYearTitle.textContent = `${new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}`;

        const nextMonthBtn = document.createElement('button');
        nextMonthBtn.className = 'btn btn-outline-secondary';
        nextMonthBtn.textContent = '>';
        nextMonthBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        };

        header.appendChild(prevMonthBtn);
        header.appendChild(monthYearTitle);
        header.appendChild(nextMonthBtn);
        calendarDiv.appendChild(header);

        const table = document.createElement('table');
        table.className = 'table table-bordered text-center';
        
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th></tr>';
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row.innerHTML += '<td></td>';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cell = document.createElement('td');
                    cell.textContent = date;
                    cell.style.cursor = 'pointer';
                    cell.onclick = () => {
                        const selectedDate = new Date(year, month, date);
                        showAttendanceList(selectedDate);
                    };
                    row.appendChild(cell);
                    date++;
                }
            }
            tbody.appendChild(row);
            if (date > daysInMonth) break;
        }
        table.appendChild(tbody);
        calendarDiv.appendChild(table);
    }

    // --- 3. Show Student Attendance List ---
    async function showAttendanceList(date) {
        calendarContainer.style.display = 'none';
        attendanceContainer.style.display = 'block';
        const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        attendanceTitle.textContent = `Registrar Asistencia - ${formattedDate}`;
        
        try {
            // ASSUMED ENDPOINT: GET /api/groups/{groupId}/students
            const studentsResponse = await fetch(`${backendUrl}/groups/${selectedGroup.id}/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!studentsResponse.ok) throw new Error('Error al cargar los alumnos.');
            const students = await studentsResponse.json();

            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
            // ASSUMED ENDPOINT: GET /api/groups/{groupId}/attendance?date=YYYY-MM-DD
            const attendanceResponse = await fetch(`${backendUrl}/groups/${selectedGroup.id}/attendance?date=${dateString}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const existingAttendance = attendanceResponse.ok ? await attendanceResponse.json() : [];

            attendanceTableBody.innerHTML = '';
            students.forEach(student => {
                const studentAttendance = existingAttendance.find(a => a.student_id === student.id);
                const isPresent = studentAttendance?.status === 'presente';
                const isAbsent = studentAttendance?.status === 'ausente';

                const row = attendanceTableBody.insertRow();
                row.dataset.studentId = student.id;
                row.innerHTML = `
                    <td>${student.matricula}</td>
                    <td>${student.nombre}</td>
                    <td><input type="radio" name="asistencia-${student.id}" value="presente" ${isPresent || !studentAttendance ? 'checked' : ''}></td>
                    <td><input type="radio" name="asistencia-${student.id}" value="ausente" ${isAbsent ? 'checked' : ''}></td>
                `;
            });
            
            saveAttendanceBtn.onclick = () => saveAttendance(date);

        } catch (error) {
            console.error(error);
            attendanceTableBody.innerHTML = `<tr><td colspan="4">Simulación: No se pudo conectar. Usando datos de ejemplo.</td></tr>`;
            // Fallback to dummy data
            const dummyStudents = [{ id: 101, matricula: '2020101', nombre: 'Juan Pérez (Ejemplo)' }];
            dummyStudents.forEach(student => {
                const row = attendanceTableBody.insertRow();
                row.dataset.studentId = student.id;
                row.innerHTML = `<td>${student.matricula}</td><td>${student.nombre}</td><td><input type="radio" name="asistencia-${student.id}" value="presente" checked></td><td><input type="radio" name="asistencia-${student.id}" value="ausente"></td>`;
            });
            saveAttendanceBtn.onclick = () => alert('Asistencia guardada (simulado).');
        }
    }

    // --- 4. Save Attendance ---
    async function saveAttendance(date) {
        const attendanceData = [];
        const rows = attendanceTableBody.querySelectorAll('tr[data-student-id]');
        rows.forEach(row => {
            const studentId = row.dataset.studentId;
            const selectedStatus = row.querySelector('input[type="radio"]:checked').value;
            attendanceData.push({ student_id: studentId, status: selectedStatus });
        });

        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            // ASSUMED ENDPOINT: POST /api/groups/{groupId}/attendance
            const response = await fetch(`${backendUrl}/groups/${selectedGroup.id}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date: dateString, attendance: attendanceData })
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.detail || 'Error al guardar la asistencia.');
            }
            
            alert('Asistencia guardada con éxito.');
            showCalendar();

        } catch (error) {
            console.error(error);
            alert(`Error en simulación: ${error.message}`);
        }
    }

    // --- Event Listeners for Buttons ---
    backToCalendarBtn.addEventListener('click', () => {
        showCalendar();
    });

    // --- Initial Load ---
    loadGroups();
});