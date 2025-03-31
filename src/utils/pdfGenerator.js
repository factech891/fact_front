// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.number || 'nueva'}.pdf`,
  } = options;

  // Detectar qué tipo de documento es basado en su número
  let documentType = 'FACTURA';
  if (invoice.documentType) {
    documentType = invoice.documentType;
  } else if (invoice.number) {
    if (invoice.number.startsWith('COT')) documentType = 'PRESUPUESTO';
    else if (invoice.number.startsWith('PRO')) documentType = 'FACTURA PROFORMA';
    else if (invoice.number.startsWith('ALB')) documentType = 'NOTA DE ENTREGA';
  } else if (invoice.type) {
    // Mapeo de tipos
    const typeMapping = {
      'QUOTE': 'PRESUPUESTO',
      'PROFORMA': 'FACTURA PROFORMA',
      'DELIVERY_NOTE': 'NOTA DE ENTREGA'
    };
    if (typeMapping[invoice.type]) {
      documentType = typeMapping[invoice.type];
    }
  }
  
  console.log('Tipo de documento determinado para PDF:', documentType);

  try {
    console.log('Generando PDF con html2canvas...');
    
    // CAMBIO 1: Intentar diferentes formas de encontrar el elemento
    let element = document.getElementById('invoice-preview');
    
    if (!element) {
      console.warn('No se encontró elemento con ID "invoice-preview", buscando alternativas...');
      
      // Intentar con el selector de la caja de diálogo
      element = document.querySelector('.MuiDialogContent-root');
      
      if (!element) {
        // Intentar con el selector del papel
        element = document.querySelector('.MuiPaper-root');
        
        if (!element) {
          // Última alternativa: todo el documento
          element = document.querySelector('#document-preview');
          
          if (!element) {
            throw new Error('No se pudo encontrar el elemento de vista previa de factura');
          }
        }
      }
      
      console.log('Elemento alternativo encontrado:', element);
    }
    
    // CAMBIO 2: Buscar el elemento Paper dentro del diálogo que contiene realmente el documento
    const paperElement = element.querySelector('.MuiPaper-root');
    const targetElement = paperElement || element;
    
    // Modificar temporalmente el DOM para mostrar el tipo correcto
    const titleElements = document.querySelectorAll('.MuiTypography-root');
    let titleElement = null;
    
    // Buscar el elemento que contiene "FACTURA" o cualquier título de documento
    for (const el of titleElements) {
      if (
        el.textContent === 'FACTURA' || 
        el.textContent === 'PRESUPUESTO' || 
        el.textContent === 'FACTURA PROFORMA' || 
        el.textContent === 'NOTA DE ENTREGA' ||
        el.textContent === 'DOCUMENTO'
      ) {
        titleElement = el;
        break;
      }
    }
    
    // Búsqueda más agresiva si no se encontró el elemento con el enfoque anterior
    if (!titleElement) {
      // IMPORTANTE: Busca y modifica el título directamente antes de la captura
      titleElement = document.querySelector('.MuiDialogContent-root .invoiceTitle') || 
                    document.querySelector('.MuiDialogContent-root [class*="invoiceTitle"]') || 
                    document.querySelector('.MuiDialogContent-root [style*="invoiceTitle"]');
    }
    
    // Si lo encontramos, cambiarlo temporalmente
    let originalText = '';
    if (titleElement) {
      originalText = titleElement.textContent;
      console.log('Cambiando título del documento de', originalText, 'a', documentType);
      titleElement.textContent = documentType;
    } else {
      console.warn('No se encontró el elemento del título para modificar');
    }
    
    // Ocultar elementos que no queremos en el PDF (como el selector de estilos)
    const styleSelector = document.querySelector('.style-selector');
    if (styleSelector) {
      styleSelector.style.display = 'none';
    }
    
    try {
      // Configurar opciones para html2canvas
      const canvas = await html2canvas(targetElement, {
        scale: 2, // Mayor escala para mejor calidad
        useCORS: true, // Permite cargar imágenes de otros dominios (como logos)
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        // Ajustar la altura al elemento real
        height: targetElement.offsetHeight,
        windowHeight: targetElement.offsetHeight
      });
      
      // Crear PDF con formato A4
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Dimensiones de la página A4 en mm
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensiones para mantener la proporción
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      let imgWidth = pdfWidth;
      let imgHeight = pdfWidth / ratio;
      
      // Si la altura calculada es mayor que la altura del PDF, ajustamos
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight * 0.9; // Usamos solo el 90% de la altura para evitar desbordes
        imgWidth = imgHeight * ratio;
      }
      
      // Centrar la imagen si no ocupa todo el ancho
      const x = (pdfWidth - imgWidth) / 2;
      
      // Añadir la imagen al PDF
      pdf.addImage(imgData, 'PNG', x, 0, imgWidth, imgHeight);
      
      // Guardamos directamente sin añadir páginas adicionales
      pdf.save(fileName);
      
      console.log('PDF generado correctamente:', fileName);
      return { success: true, fileName };
    } catch (captureError) {
      console.error('Error en la captura del documento:', captureError);
      throw captureError;
    } finally {
      // Restaurar elementos ocultos
      if (styleSelector) {
        styleSelector.style.display = '';
      }
      
      // Restaurar el DOM a su estado original
      if (titleElement && originalText) {
        titleElement.textContent = originalText;
      }
    }
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error: error.message };
  }
};