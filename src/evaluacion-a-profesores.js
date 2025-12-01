document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/profesores/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const tableBody = document.getElementById('profesores-table-body');
            
            if (data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 3;
                cell.textContent = 'No hay profesores para evaluar.';
                cell.style.textAlign = 'center';
            } else {
                data.forEach(profesor => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = profesor.nombre;
                    row.insertCell().textContent = profesor.materia; // Assuming this property exists
                    
                    const ratingCell = row.insertCell();
                    const ratingContainer = document.createElement('div');
                    ratingContainer.classList.add('rating');
                    
                    for (let i = 1; i <= 5; i++) {
                        const star = document.createElement('span');
                        star.classList.add('star');
                        star.innerHTML = '&#9733;';
                        star.dataset.value = i;
                        ratingContainer.appendChild(star);
                    }
                    
                    ratingCell.appendChild(ratingContainer);

                    ratingContainer.addEventListener('click', async (event) => {
                        if (event.target.classList.contains('star')) {
                            const rating = event.target.dataset.value;
                            
                            try {
                                const evalResponse = await fetch(`${backendUrl}/evaluaciones`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        profesor_id: profesor.id,
                                        materia_id: profesor.materia_id, // Assuming you need to send this
                                        calificacion: rating
                                    })
                                });

                                if (evalResponse.ok) {
                                    alert('Evaluación enviada exitosamente.');
                                    // Highlight stars
                                    const stars = ratingContainer.querySelectorAll('.star');
                                    stars.forEach(s => {
                                        s.classList.remove('selected');
                                        if (s.dataset.value <= rating) {
                                            s.classList.add('selected');
                                        }
                                    });
                                } else {
                                    const errorData = await evalResponse.json();
                                    alert(errorData.detail || 'Error al enviar la evaluación.');
                                }
                            } catch (error) {
                                console.error('Error al enviar la evaluación:', error);

                                alert('Ocurrió un error al enviar la evaluación.');
                            }
                        }
                    });
                });
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar los profesores.');
        }
    } catch (error) {
        console.error('Error al cargar los profesores:', error);
        alert('Ocurrió un error al cargar los profesores.');
    }
});