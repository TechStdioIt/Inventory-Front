import { Component } from '@angular/core';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-barcode-generator',
  templateUrl: './barcode-generator.component.html',
  styleUrls: ['./barcode-generator.component.scss']
})
export class BarcodeGeneratorComponent {
  pageSize: string = 'A4';
  numBarcodes: number = 1;
  productCode: string = '';
  price: string = '';
  batch: string = '';

  generateBarcodes() {
    const container = document.getElementById('barcodeContainer');
    if (!container) return;
    container.innerHTML = ''; // Clear previous barcodes

    for (let i = 0; i < this.numBarcodes; i++) {
      const barcodeWrapper = document.createElement('div');
      barcodeWrapper.style.margin = '10px';
      barcodeWrapper.style.display = 'inline-block';
      barcodeWrapper.style.textAlign = 'center';

      // Create a canvas element for the barcode
      const barcodeCanvas = document.createElement('canvas');
      barcodeCanvas.id = `barcode${i}`;
      barcodeWrapper.appendChild(barcodeCanvas);

      try {
        // Generate the barcode on the canvas
        JsBarcode(barcodeCanvas, this.productCode, {
          format: 'CODE128',
          lineColor: "#000",
          width: 2,
          height: 50,
          displayValue: true,
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
        continue;
      }

      // Add product details under barcode
      const productDetails = document.createElement('div');
      productDetails.innerHTML = `
        <p>Price: ${this.price}</p>
        <p>Batch: ${this.batch}</p>
      `;
      barcodeWrapper.appendChild(productDetails);

      // Append the barcode wrapper to the container
      container.appendChild(barcodeWrapper);
    }
  }

  downloadBarcodes() {
    const container = document.getElementById('barcodeContainer');
    if (!container) return;
  
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: this.pageSize === 'A4' ? 'a4' : 'letter'
    });
  
    html2canvas(container).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
  
      // Calculate dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      // Set barcode size and margins
      const imgWidth = pageWidth - 20;  // Keeping some margin
      const aspectRatio = canvas.height / canvas.width;
      const imgHeight = imgWidth * aspectRatio;
  
      // Check if the image height exceeds page height, if so, scale it
      if (imgHeight > pageHeight - 20) {
        const scaleFactor = (pageHeight - 20) / imgHeight;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth * scaleFactor, imgHeight * scaleFactor);
      } else {
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      }
  
      // Save the PDF
      pdf.save('barcodes.pdf');
    });
  }
  
}
