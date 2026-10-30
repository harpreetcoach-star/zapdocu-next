import { PDFDocument, PDFName, degrees, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';

/**
 * Merge multiple PDF files into a single PDF entirely in browser RAM
 */
export async function mergePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();

  for (const file of pdfFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Rotate specific pages or all pages in a PDF by a specified angle (90, 180, 270)
 */
export async function rotatePDF(pdfFile, rotationAngle = 90, targetPageIndex = null) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  
  if (targetPageIndex !== null && targetPageIndex >= 0 && targetPageIndex < pages.length) {
    const page = pages[targetPageIndex];
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotationAngle));
  } else {
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Split a PDF by extracting specific page ranges
 */
export async function splitPDF(pdfFile, startPage, endPage) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const subPdf = await PDFDocument.create();

  const indices = [];
  for (let i = startPage - 1; i < endPage; i++) {
    if (i >= 0 && i < pdfDoc.getPageCount()) {
      indices.push(i);
    }
  }

  const copiedPages = await subPdf.copyPages(pdfDoc, indices);
  copiedPages.forEach((page) => subPdf.addPage(page));

  const pdfBytes = await subPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Add a text watermark to every page of a PDF
 */
export async function watermarkPDF(file, watermarkText = 'CONFIDENTIAL') {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();
    
    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 50,
      font: font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.3,
      rotate: degrees(45),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Extract specific pages into a new PDF document
 */
export async function extractPages(pdfFile, pageIndices) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Rearrange or delete pages based on given index array
 */
export async function rearrangeOrDeletePages(pdfFile, newPageOrderIndices) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdfDoc, newPageOrderIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Add page numbers to every page of a PDF document
 */
export async function addPageNumbersToPDF(file, position = 'bottom-center') {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const text = `Page ${index + 1} of ${totalPages}`;
    const textSize = 10;
    const textWidth = font.widthOfTextAtSize(text, textSize);

    // Calculate coordinates based on position
    let x = width / 2 - textWidth / 2; // Default bottom-center
    let y = 30; // 30 points from the bottom

    if (position === 'bottom-right') {
      x = width - textWidth - 40;
    } else if (position === 'bottom-left') {
      x = 40;
    }

    page.drawText(text, {
      x,
      y,
      size: textSize,
      font: font,
      color: rgb(0.3, 0.3, 0.3), // Dark gray
    });
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Convert one or multiple JPG/PNG images into a single PDF document
 */
export async function convertImagesToPDF(imageFiles) {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    let embeddedImage;

    // Check file type to embed correctly as JPG or PNG
    if (file.type === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      // Default to JPG for jpeg/jpg formats
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const { width, height } = embeddedImage;
    // Create a page matching the image dimensions
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Encrypt and protect a PDF document with a password
 */
export async function protectPDF(file, password) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Force standard encryption flags on save
  const pdfBytes = await pdfDoc.save({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'none',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false,
    },
  });

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Real client-side PDF compression using pdf.js browser canvas rendering
 * and JPEG image stream re-encoding to dramatically reduce file size.
 */
export async function compressPDF(file, qualityLevel = 'recommended') {
  if (typeof window === 'undefined') {
    throw new Error('Compression must run in the browser.');
  }

  const arrayBuffer = await file.arrayBuffer();

  let jpegQuality = 0.60; 
  let scale = 0.85;

  if (qualityLevel === 'low') {
    jpegQuality = 0.80;
    scale = 1.0;
  } else if (qualityLevel === 'extreme') {
    jpegQuality = 0.30;
    scale = 0.70;
  }

  const pdfjsLib = await import('pdfjs-dist/build/pdf');
  
  // Point worker directly to standard jsDelivr CDN which never blocks version 3.11.174
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const imageJpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const imageBytes = await fetch(imageJpegDataUrl).then((res) => res.arrayBuffer());

    const embeddedImg = await newPdfDoc.embedJpg(imageBytes);
    const newPage = newPdfDoc.addPage([viewport.width / scale, viewport.height / scale]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: viewport.width / scale,
      height: viewport.height / scale,
    });
  }

  const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
  return new Blob([compressedBytes], { type: 'application/pdf' });
}

/**
 * Unlock and remove password protection from a PDF document
 */
export async function unlockPDF(file, password = '') {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF ignoring existing encryption or using the provided password
  const pdfDoc = await PDFDocument.load(arrayBuffer, { 
    password: password,
    ignoreEncryption: true 
  });

  // Save a clean, unencrypted version of the document
  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Extract specific pages from a PDF document
 */
export async function extractPagesFromPDF(file, pageIndices) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Convert PDF text content into a Word-compatible document blob
 */
export async function convertPdfToWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // We use pdfjsLib loaded globally in the window
  if (!window.pdfjsLib) {
    throw new Error('PDF.js engine not loaded yet.');
  }

  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += `--- Page ${i} ---\n\n${pageText}\n\n\n`;
  }

  // Create a Word-compatible Blob (.doc / .txt format readable by Microsoft Word)
  const blob = new Blob([fullText], { type: 'application/msword;charset=utf-8' });
  return blob;
}

/**
 * Convert Word document text (.txt or .docx content) into a professional PDF
 */
export async function convertWordToPdf(file) {
  const text = await file.text();
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 standard size
  
  const { width, height } = page.getSize();
  const fontSize = 11;
  const margin = 50;
  let y = height - margin;

  const lines = text.split('\n');
  
  for (const line of lines) {
    if (y < margin + 30) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
    }

    // Sanitize text to fit standard PDF encoding
    const cleanLine = line.replace(/[^\x20-\x7E]/g, '?');
    
    page.drawText(cleanLine.substring(0, 95), {
      x: margin,
      y: y,
      size: fontSize,
    });
    
    y -= 18; // Line spacing
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Convert real Excel (.xlsx, .xls) or CSV files into a clean formatted PDF table
 */
export async function convertExcelToPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Read the workbook using SheetJS
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert sheet to an array of rows (JSON arrays)
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([841.89, 595.28]); // Landscape for wide tables
  
  const { width, height } = page.getSize();
  const fontSize = 8;
  const margin = 40;
  let y = height - margin;

  for (const row of rows) {
    if (!row || row.length === 0) continue;
    
    if (y < margin + 20) {
      page = pdfDoc.addPage([841.89, 595.28]);
      y = height - margin;
    }

    // Join row cells with a clean divider
    const rowString = row.map(cell => (cell !== undefined && cell !== null ? String(cell) : '')).join(' | ');
    const cleanRow = rowString.replace(/[^\x20-\x7E]/g, ' ');
    
    page.drawText(cleanRow.substring(0, 150), {
      x: margin,
      y: y,
      size: fontSize,
    });
    
    y -= 14; // Line spacing
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}