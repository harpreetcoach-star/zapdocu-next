'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, CheckCircle2, Sparkles, Sliders, RotateCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function VisualPdfEditor({ toolType = 'rearrange-pdf' }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);

  // Dynamic runtime CDN loader for PDF.js (Zero build/canvas errors)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.pdfjsLib) {
        setPdfjsLib(window.pdfjsLib);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfjsLib(window.pdfjsLib);
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleFileChange = async (e) => {
    if (!pdfjsLib) {
      setStatusMessage('PDF engine still initializing, please wait a second...');
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDownloadUrl(null);
      setStatusMessage('Rendering page thumbnails in browser RAM...');
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const loadedPages = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          
          loadedPages.push({
            id: i - 1,
            originalIndex: i - 1,
            pageNumber: i,
            rotation: 0,
            thumbnail: canvas.toDataURL(),
          });
        }

        setPages(loadedPages);
        setStatusMessage(`Successfully loaded ${numPages} page thumbnails.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error rendering PDF pages.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRotatePage = (id) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const handleDeletePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveModifiedPdf = async () => {
    if (!selectedFile || pages.length === 0) {
      setStatusMessage('No pages left to export.');
      return;
    }

    // Check and track usage based on 1 file operation
    const usageCheck = checkAndTrackUsage(1, false);
    if (!usageCheck.allowed) {
      const upgradeNow = window.confirm(`${usageCheck.message}\n\nWould you like to upgrade to ZapDocu Pro now?`);
      if (upgradeNow) {
        window.location.href = '/#pricing';
      }
      return;
    }

    // Trigger live counter refresh in ToolRenderer
    window.dispatchEvent(new Event('usageUpdated'));

    setIsProcessing(true);
    setStatusMessage('Compiling final PDF in browser memory...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = pages.map((p) => p.originalIndex);
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

      copiedPages.forEach((copiedPage, idx) => {
        const targetRotation = pages[idx].rotation;
        if (targetRotation > 0) {
          copiedPage.setRotation(degrees(copiedPage.getRotation().angle + targetRotation));
        }
        newPdf.addPage(copiedPage);
      });

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatusMessage('Success! Your modified PDF is ready.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error saving modified PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isRotateMode = toolType === 'rotate-pdf';

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          {isRotateMode ? <RotateCw className="w-5 h-5 text-indigo-400" /> : <Sliders className="w-5 h-5 text-indigo-400" />}
          {isRotateMode ? 'Rotate PDF Pages Visually' : 'Rearrange & Delete PDF Pages'}
        </h2>
        <p className="text-xs text-slate-400">
          {isRotateMode 
            ? 'Click rotation buttons on any page thumbnail to adjust its orientation.' 
            : 'Inspect thumbnails, rotate pages, or remove unwanted sections instantly.'}
        </p>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <Sliders className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">
          {selectedFile ? selectedFile.name : 'Click to select a PDF document'}
        </p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed securely in browser RAM</p>
      </div>

      {isProcessing && !pages.length && (
        <div className="text-center py-6 text-indigo-400 flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Thumbnail Grid */}
      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Page Thumbnails ({pages.length} active pages)
            </h4>
            <span className="text-xs text-indigo-400">Click rotate or delete on any page card</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {pages.map((p, index) => (
              <div 
                key={p.id} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all shadow-md"
              >
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  #{index + 1}
                </div>

                <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden mb-3 border border-slate-800/80">
                  <img 
                    src={p.thumbnail} 
                    alt={`Page ${p.pageNumber}`} 
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200"
                  />
                </div>

                <div className="flex items-center gap-2 w-full justify-center">
                  <button
                    onClick={() => handleRotatePage(p.id)}
                    title="Rotate 90°"
                    className="flex-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{p.rotation}°</span>
                  </button>
                  <button
                    onClick={() => handleDeletePage(p.id)}
                    title="Delete page"
                    className="p-1.5 bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleSaveModifiedPdf}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Processing PDF...' : 'Export Modified PDF'}</span>
            </button>

            {statusMessage && (
              <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="modified-document.pdf"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Download Edited PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}