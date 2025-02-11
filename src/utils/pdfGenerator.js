import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.number || 'nueva'}.pdf`,
    margins = { top: 20, right: 20, bottom: 20, left: 20 },
    quality = 1.0,
    scale = 2
  } = options;

  const element = document.getElementById('invoice-preview');

  try {
    // Ocultar elementos de control temporalmente
    const controlsToHide = element.querySelectorAll(
      '.MuiButtonGroup-root, .MuiDialogActions-root, .no-print'
    );
    controlsToHide.forEach(el => el.style.display = 'none');

    // Configuración de captura
    const canvas = await html2canvas(element.querySelector('.MuiPaper-root'), {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Ancho A4
      windowHeight: 1123, // Alto A4
      x: -15, // Ajuste a la izquierda
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        // Ajustes adicionales al clon antes de la captura
        const clonedElement = clonedDoc.getElementById('invoice-preview');
        if (clonedElement) {
          clonedElement.style.padding = '0';
          clonedElement.style.margin = '0';
        }
      }
    });

    // Restaurar elementos ocultos
    controlsToHide.forEach(el => el.style.display = '');

    // Crear PDF con orientación automática
    const imgRatio = canvas.height / canvas.width;
    const orientation = imgRatio >= 1 ? 'portrait' : 'landscape';

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'pt',
      format: 'a4',
      compress: true
    });

    // Calcular dimensiones para centrado
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - (margins.left + margins.right);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = margins.left;
    const y = margins.top;

    // Agregar imagen centrada
    pdf.addImage(
      canvas.toDataURL('image/jpeg', quality),
      'JPEG',
      x,
      y,
      imgWidth,
      imgHeight
    );

    // Agregar metadatos
    pdf.setProperties({
      title: fileName,
      subject: `Factura ${invoice.number || 'nueva'}`,
      creator: 'Sistema de Facturación',
      author: 'Tu Empresa',
      keywords: 'factura, invoice, pdf',
      creationDate: new Date()
    });

    // Guardar PDF
    pdf.save(fileName);

    return {
      success: true,
      fileName: fileName
    };

  } catch (error) {
    console.error('Error al generar PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};