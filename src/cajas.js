document.addEventListener('DOMContentLoaded', function() {
    function initializeCajas() {
        const backendUrl = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert('No estás autenticado.');
            window.location.href = '/index.html';
            return;
        }

        // Fetch payment data
        try {
            fetch(`${backendUrl}/pagos/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    response.json().then(errorData => {
                        alert(errorData.detail || 'Error al cargar la información de pagos.');
                    });
                }
            }).then(data => {
                if (data) {
                    const tableBody = document.getElementById('pagos-table-body');
                    
                    if (data.length === 0) {
                        const row = tableBody.insertRow();
                        const cell = row.insertCell();
                        cell.colSpan = 6;
                        cell.textContent = 'No hay información de pagos para mostrar.';
                        cell.style.textAlign = 'center';
                    } else {
                        data.forEach(pago => {
                            const row = tableBody.insertRow();
                            row.insertCell().textContent = pago.estado;
                            row.insertCell().textContent = pago.ciclo;
                            row.insertCell().textContent = `$${pago.cargo.toFixed(2)}`;
                            row.insertCell().textContent = `$${pago.abono.toFixed(2)}`;
                            row.insertCell().textContent = `$${pago.saldo.toFixed(2)}`;
                            
                            const detallesCell = row.insertCell();
                            const detallesLink = document.createElement('a');
                            detallesLink.href = '#'; // Or a specific details page/modal
                            detallesLink.textContent = 'Detalles';
                            detallesCell.appendChild(detallesLink);
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Error al cargar la información de pagos:', error);
            alert('Ocurrió un error al cargar la información de pagos.');
        }

        // Handle "Generar Recibo de Pago" button click
        document.getElementById('generar-recibo-btn').addEventListener('click', function() {
            try {
                fetch(`${backendUrl}/pagos/recibo`, {
                    method: 'POST', // Assuming POST for generating a new receipt
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        response.json().then(errorData => {
                            alert(errorData.detail || 'Error al generar el recibo de pago.');
                        });
                    }
                }).then(blob => {
                    if (blob) {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'recibo_pago.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                });
            } catch (error) {
                console.error('Error al generar el recibo de pago:', error);
                alert('Ocurrió un error al generar el recibo de pago.');
            }
        });
    }

    setTimeout(initializeCajas, 100);
});