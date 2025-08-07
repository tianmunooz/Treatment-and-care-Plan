
declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (element: HTMLElement, fileName:string): Promise<void> => {
  if (!element) {
    console.error("PDF generation failed: provided element is null.");
    return;
  }

  // Show a loading indicator to the user
  const loadingIndicator = document.createElement('div');
  loadingIndicator.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(23, 26, 34, 0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-family: sans-serif; flex-direction: column; backdrop-filter: blur(4px);">
      <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/></path></svg>
      <p style="margin-top: 1rem; font-size: 1.1rem; font-weight: 500;">Generating PDF...</p>
    </div>
  `;
  document.body.appendChild(loadingIndicator);

  try {
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageElements = element.querySelectorAll<HTMLElement>('.printable-page');

    if (pageElements.length === 0) {
      console.error("No '.printable-page' elements found to generate PDF.");
      alert("Could not find any content to print. Ensure the plan preview is visible.");
      return;
    }

    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i];
      
      const canvas = await html2canvas(pageElement, {
        scale: 2.5, // High scale for crisp text and images
        useCORS: true,
        logging: false,
        width: pageElement.offsetWidth,
        height: pageElement.offsetHeight,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(`An error occurred while generating the PDF: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Always remove the loading indicator
    document.body.removeChild(loadingIndicator);
  }
};
