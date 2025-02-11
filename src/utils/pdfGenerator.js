import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (invoice) => {
  try {
    const element = document.getElementById('invoice-preview');
    
    if (!element) {
      throw new Error('Elemento no encontrado');
    }

    // Ocultar temporalmente los controles para la captura
    const controls = element.querySelector('.MuiButtonGroup-root');
    const actions = element.querySelector('.MuiDialogActions-root');
    if (controls) controls.style.display = 'none';
    if (actions) actions.style.display = 'none';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (document) => {
        const clonedElement = document.getElementById('invoice-preview');
        clonedElement.style.width = '595px';
        clonedElement.style.height = '842px';
      }
    });

    // Restaurar los controles
    if (controls) controls.style.display = '';
    if (actions) actions.style.display = '';

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [595, 842]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 595, 842);
    pdf.save(`factura_${invoice.number || 'nueva'}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generando PDF:', error);
    return false;
  }
};