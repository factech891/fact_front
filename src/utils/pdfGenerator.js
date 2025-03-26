// utils/pdfGenerator.js - SOLUCIÓN FINAL SIN DEPENDENCIAS PROBLEMÁTICAS
import jsPDF from 'jspdf';

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.number || 'nueva'}.pdf`,
  } = options;

  try {
    console.log('Generando PDF con datos:', invoice);
    
    // Crear PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Datos de empresa
    const empresa = {
      nombre: 'TRANSPORTE EXPRESS',
      direccion: 'Puerto Cabello',
      rif: 'J-87789293883',
      telefono: '0663566772',
      email: 'bit@gmail.com'
    };

    // Configuración de página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    // Añadir encabezado 
    pdf.setFillColor(0, 51, 102);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    // Encabezado - Logo/Nombre
    pdf.setTextColor(255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(empresa.nombre, margin, y + 10);
    
    // Datos empresa
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    y += 15;
    pdf.text(`RIF: ${empresa.rif}`, margin, y);
    y += 5;
    pdf.text(`Tel: ${empresa.telefono}`, margin, y);
    y += 5;
    pdf.text(`Email: ${empresa.email}`, margin, y);
    y += 5;
    pdf.text(`${empresa.direccion}`, margin, y);

    // Información de factura (derecha)
    pdf.setTextColor(255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FACTURA', pageWidth - margin - 30, 20);
    pdf.setFontSize(10);
    pdf.text(`Nº: ${invoice.number || 'INV-0010'}`, pageWidth - margin - 30, 27);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - margin - 30, 34);

    // Reiniciar color de texto
    pdf.setTextColor(0);
    
    // Información del cliente
    y = 50;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL CLIENTE', margin, y);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);
    
    y += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Cliente:', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.client?.nombre || 'N/A', margin + 30, y);
    
    y += 7;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dirección:', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.client?.direccion || 'N/A', margin + 30, y);
    
    y += 7;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Email:', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.client?.email || 'N/A', margin + 30, y);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('RIF/CI:', margin + 100, y - 14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.client?.rif || 'N/A', margin + 130, y - 14);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Teléfono:', margin + 100, y - 7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.client?.telefono || 'N/A', margin + 130, y - 7);

    // Tabla de ítems
    y += 15;

    // ---------- CREACIÓN MANUAL DE TABLA ----------
    // Definimos ancho de columnas manualmente
    const colWidth = [(pageWidth - 2 * margin) * 0.15, // Código (15%)
                      (pageWidth - 2 * margin) * 0.35, // Descripción (35%)
                      (pageWidth - 2 * margin) * 0.10, // Cantidad (10%)
                      (pageWidth - 2 * margin) * 0.15, // Precio (15%)
                      (pageWidth - 2 * margin) * 0.15, // Total (15%)
                      (pageWidth - 2 * margin) * 0.10]; // Exento (10%)
    
    // Altura de las filas
    const rowHeight = 10;
    
    // Encabezados de tabla
    const headers = ['Código', 'Descripción', 'Cantidad', 'Precio Unit.', 'Total', 'Exento IVA'];
    
    // Fondo del encabezado
    pdf.setFillColor(0, 51, 102);
    pdf.rect(margin, y, pageWidth - 2 * margin, rowHeight, 'F');
    
    // Texto del encabezado
    pdf.setTextColor(255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    
    let xPos = margin;
    for (let i = 0; i < headers.length; i++) {
      // Centrar los encabezados
      const txtWidth = pdf.getStringUnitWidth(headers[i]) * 10 * 0.352778;
      const xOffset = (colWidth[i] - txtWidth) / 2;
      
      pdf.text(headers[i], xPos + xOffset, y + rowHeight - 3); // -3 para centrarlo verticalmente
      xPos += colWidth[i];
    }
    
    // Filas de datos
    y += rowHeight;
    pdf.setTextColor(0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    // Verificar si hay ítems
    const items = invoice.items || [];
    
    // Imprimir filas
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Fondo de la fila (alternando para mejor visibilidad)
      if (i % 2 === 1) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, y, pageWidth - 2 * margin, rowHeight, 'F');
      }
      
      xPos = margin;
      
      // Código
      pdf.text(item.codigo || '', xPos + 2, y + rowHeight - 3);
      xPos += colWidth[0];
      
      // Descripción
      pdf.text(item.descripcion || '', xPos + 2, y + rowHeight - 3);
      xPos += colWidth[1];
      
      // Cantidad
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad.toFixed(2) : '1.00';
      const cantidadWidth = pdf.getStringUnitWidth(cantidad) * 9 * 0.352778;
      pdf.text(cantidad, xPos + colWidth[2] - cantidadWidth - 2, y + rowHeight - 3);
      xPos += colWidth[2];
      
      // Precio unitario
      const precio = `${invoice.moneda || 'VES'} ${typeof item.precioUnitario === 'number' ? 
        item.precioUnitario.toFixed(2) : '0.00'}`;
      const precioWidth = pdf.getStringUnitWidth(precio) * 9 * 0.352778;
      pdf.text(precio, xPos + colWidth[3] - precioWidth - 2, y + rowHeight - 3);
      xPos += colWidth[3];
      
      // Total
      const total = `${invoice.moneda || 'VES'} ${(
        (typeof item.cantidad === 'number' ? item.cantidad : 1) * 
        (typeof item.precioUnitario === 'number' ? item.precioUnitario : 0)
      ).toFixed(2)}`;
      const totalWidth = pdf.getStringUnitWidth(total) * 9 * 0.352778;
      pdf.text(total, xPos + colWidth[4] - totalWidth - 2, y + rowHeight - 3);
      xPos += colWidth[4];
      
      // Exento IVA
      const exento = item.exentoIva ? '✓' : '✗';
      const exentoWidth = pdf.getStringUnitWidth(exento) * 9 * 0.352778;
      pdf.text(exento, xPos + (colWidth[5] - exentoWidth) / 2, y + rowHeight - 3);
      
      // Pasar a la siguiente fila
      y += rowHeight;
    }
    
    // Línea final de la tabla
    pdf.line(margin, y, pageWidth - margin, y);
    
    // Añadimos espacio después de la tabla
    y += 10;
    
    // ---------------- FIN DE TABLA ----------------
    
    // Calcular los totales
    const subtotal = invoice.subtotal || 
      (invoice.items || []).reduce((sum, item) => 
        sum + ((typeof item.cantidad === 'number' ? item.cantidad : 1) * 
              (typeof item.precioUnitario === 'number' ? item.precioUnitario : 0)), 0);
    
    const iva = invoice.iva || 
      (invoice.items || []).reduce((sum, item) => {
        if (!item.exentoIva) {
          return sum + ((typeof item.cantidad === 'number' ? item.cantidad : 1) * 
                        (typeof item.precioUnitario === 'number' ? item.precioUnitario : 0) * 0.16);
        }
        return sum;
      }, 0);
    
    const total = invoice.total || subtotal + iva;
    
    // Totales en la derecha
    const totalsWidth = 80;
    const totalsX = pageWidth - margin - totalsWidth;
    
    // Dibujar fondo para totales
    pdf.setFillColor(245, 245, 245);
    pdf.rect(totalsX, y, totalsWidth, 35, 'F');
    
    // Subtotal
    pdf.setFont('helvetica', 'normal');
    pdf.text('Subtotal:', totalsX + 5, y + 10);
    pdf.text(`${invoice.moneda || 'VES'} ${subtotal.toFixed(2)}`, totalsX + totalsWidth - 5, y + 10, { align: 'right' });
    
    // IVA
    pdf.text('IVA (16%):', totalsX + 5, y + 20);
    pdf.text(`${invoice.moneda || 'VES'} ${iva.toFixed(2)}`, totalsX + totalsWidth - 5, y + 20, { align: 'right' });
    
    // Línea separadora
    pdf.line(totalsX, y + 25, totalsX + totalsWidth, y + 25);
    
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL:', totalsX + 5, y + 33);
    pdf.text(`${invoice.moneda || 'VES'} ${total.toFixed(2)}`, totalsX + totalsWidth - 5, y + 33, { align: 'right' });
    
    // Notas
    y += 50;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notas Importantes', margin, y);
    
    y += 7;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('• Esta factura es un documento legal y sirve como comprobante fiscal.', margin, y);
    y += 6;
    pdf.text('• Los precios incluyen IVA según corresponda.', margin, y);
    y += 6;
    pdf.text('• Para cualquier consulta, contacte a nuestro departamento de atención al cliente.', margin, y);
    
    // Guardar PDF
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert("Error al generar PDF: " + error.message);
    return { success: false, error: error.message };
  }
};