document.addEventListener('DOMContentLoaded', async function() {
    const { jsPDF } = window.jspdf;
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');

    if (!token) {
        alert('No estás autenticado.');
        window.location.href = '/index.html';
        return;
    }

    if (role !== 'student') {
        alert('Acceso denegado. Esta página es sólo para alumnos.');
        window.location.href = role === 'Docente' ? '/pages/teacher/asistencia.html' : '/index.html';
        return;
    }

    let totalAdeudo = 0;

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
                    totalAdeudo += pago.saldo;
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
    document.getElementById('generar-recibo-btn').addEventListener('click', function() {
        const doc = new jsPDF();

        // --- PDF Content ---
        const studentName = localStorage.getItem('studentName') || 'Nombre del Alumno';
        const clabe = "123456789012345678"; // Placeholder
        const referenceNumber = "REF123456789"; // Placeholder

        // Header
        doc.setFontSize(18);
        doc.text("Recibo de Pago", 105, 20, { align: 'center' });
        
        // Student Info
        doc.setFontSize(12);
        doc.text(`Alumno: ${studentName}`, 20, 40);
        
        // Payment Details
        doc.text("Detalles de Pago:", 20, 60);
        doc.text(`Monto a Pagar (Adeudo Total): $${totalAdeudo.toFixed(2)}`, 20, 70);
        
        doc.text("Información para Transferencia:", 20, 90);
        doc.text(`CLABE: ${clabe}`, 20, 100);
        doc.text(`Número de Referencia: ${referenceNumber}`, 20, 110);

        // Footer
        doc.setFontSize(10);
        doc.text("Favor de incluir el número de referencia en el concepto de la transferencia.", 105, 130, { align: 'center' });
        doc.text("Fecha de generación: " + new Date().toLocaleDateString(), 105, 140, { align: 'center' });

        // Save the PDF
        doc.save('recibo_pago.pdf');
    });
});
