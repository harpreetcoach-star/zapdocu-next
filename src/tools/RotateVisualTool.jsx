'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, RotateCw, FileText } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function RotateVisualTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
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
      setSelectedFile(file);
      setDownloadUrl(null);
      setStatusMessage('Loading page thumbnails...');
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
        setStatusMessage(`Loaded ${numPages} pages successfully.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error loading pages.');
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

  const handleSaveRotatedPdf = async () => {
    if (!selectedFile || pages.length === 0) {
      setStatusMessage('No pages to export.');
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
    setStatusMessage('Applying rotations...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pages.forEach((p) => {
        if (p.rotation > 0) {
          const targetPage = pdfPages[p.originalIndex];
          const currentRot = targetPage.getRotation().angle;
          targetPage.setRotation(degrees(currentRot + p.rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatusMessage('Success! Rotated PDF ready.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error saving PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <RotateCw className="w-5 h-5 text-indigo-400" /> Rotate PDF Pages Visually
        </h2>
        <p className="text-xs text-slate-400">Click the rotate button on any page thumbnail to adjust its orientation.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click to select a PDF to rotate'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {isProcessing && !pages.length && (
        <div className="text-center py-6 text-indigo-400 flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Page Thumbnails ({pages.length} pages)</h4>
            <span className="text-xs text-indigo-400">Click rotate on any card</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {pages.map((p, index) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  #{index + 1}
                </div>

                <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                  <img 
                    src={p.thumbnail} 
                    alt={`Page ${p.pageNumber}`} 
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200"
                  />
                </div>

                <button
                  onClick={() => handleRotatePage(p.id)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rotate ({p.rotation}°)</span>
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button onClick={handleSaveRotatedPdf} disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Processing...' : 'Export Rotated PDF'}</span>
            </button>
            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}
            {downloadUrl && (
              <a href={downloadUrl} download="rotated-document.pdf" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Download Rotated PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}