document.addEventListener('DOMContentLoaded', async function() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    // Fetch payment data
    try {
        const response = await fetch(`${backendUrl}/pagos/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
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
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Error al cargar la información de pagos.');
        }
    } catch (error) {
        console.error('Error al cargar la información de pagos:', error);
        alert('Ocurrió un error al cargar la información de pagos.');
    }

    // Handle "Generar Recibo de Pago" button click
    document.getElementById('generar-recibo-btn').addEventListener('click', async function() {
        try {
            const response = await fetch(`${backendUrl}/pagos/recibo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'recibo_pago.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Error al generar el recibo de pago.');
            }
        } catch (error) {
            console.error('Error al generar el recibo de pago:', error);
            alert('Ocurrió un error al generar el recibo de pago.');
        }
    });
});