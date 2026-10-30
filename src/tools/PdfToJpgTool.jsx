'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, FileText, Image as ImageIcon, Download, X } from 'lucide-react';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function PdfToJpgTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [renderedImages, setRenderedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);

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
      setStatusMessage('PDF engine initializing...');
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check and track usage based on 1 file operation when a file is selected & processed
      const usageCheck = checkAndTrackUsage(1, false);
      if (!usageCheck.allowed) {
        const upgradeNow = window.confirm(`${usageCheck.message}\n\nWould you like to upgrade to ZapDocu Pro now?`);
        if (upgradeNow) {
          window.location.href = '/#pricing';
        }
        e.target.value = '';
        return;
      }

      // Trigger live counter refresh in ToolRenderer
      window.dispatchEvent(new Event('usageUpdated'));

      setSelectedFile(file);
      setRenderedImages([]);
      setStatusMessage('Rendering PDF pages to high-res JPGs...');
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const results = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for crisp JPG export
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          results.push({
            pageNumber: i,
            url: dataUrl,
            name: `${file.name.replace(/\.[^/.]+$/, '')}-page-${i}.jpg`,
          });
        }

        setRenderedImages(results);
        setStatusMessage(`Successfully converted ${numPages} page(s) to JPG!`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error rendering PDF to JPG.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setRenderedImages([]);
    setStatusMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" /> PDF to JPG Converter
        </h2>
        <p className="text-xs text-slate-400">Convert PDF pages into high-resolution JPG images instantly in your browser.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click to select a PDF to convert'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {isProcessing && (
        <div className="text-center py-6 text-indigo-400 flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      {renderedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Converted Pages ({renderedImages.length})</h4>
            <button 
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear Document
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {renderedImages.map((img, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  #{img.pageNumber}
                </div>

                <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                  <img src={img.url} alt={`Page ${img.pageNumber}`} className="max-h-full max-w-full object-contain" />
                </div>

                <a 
                  href={img.url} 
                  download={img.name}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-medium py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download JPG
                </a>
              </div>
            ))}
          </div>

          {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}
        </div>
      )}
    </div>
  );
}