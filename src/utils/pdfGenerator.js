// utils/pdfGenerator.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const convertImageToBase64 = async (imgUrl) => {
  try {
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error convirtiendo imagen:', error);
    return null;
  }
};

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.numero || 'nueva'}.pdf`,
    margins = { top: 20, right: 20, bottom: 20, left: 20 }
  } = options;

  try {
    const element = document.getElementById('invoice-preview');
    if (!element) throw new Error('Elemento no encontrado');

    // Ocultar elementos no deseados
    const controlsToHide = element.querySelectorAll(
      '.MuiButtonGroup-root, .MuiDialogActions-root, .no-print, .style-selector'
    );
    controlsToHide.forEach(el => el.style.display = 'none');

    // Convertir logo a base64 si existe
    const logoImg = element.querySelector('.company-logo');
    if (logoImg && logoImg.src) {
      const base64Logo = await convertImageToBase64(logoImg.src);
      if (base64Logo) {
        logoImg.src = base64Logo;
      }
    }

    // Pequeña pausa para asegurar que los cambios se apliquen
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element.querySelector('.MuiPaper-root'), {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('.MuiPaper-root');
        if (clonedElement) {
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });

    // Restaurar elementos ocultos
    controlsToHide.forEach(el => el.style.display = '');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - (margins.left + margins.right);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas,
      'PNG',
      margins.left,
      margins.top,
      imgWidth,
      imgHeight
    );

    pdf.save(fileName);

    // Si modificamos el src del logo, lo restauramos
    if (logoImg && invoice.empresa?.logoUrl) {
      logoImg.src = invoice.empresa.logoUrl;
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error: error.message };
  }
};