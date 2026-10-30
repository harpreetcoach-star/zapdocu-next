'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, FileText, Scissors, Download, CheckSquare, Square } from 'lucide-react';
import { extractPagesFromPDF } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function SplitPdfTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
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
      setStatusMessage('Rendering page thumbnails...');
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const loadedPages = [];
        const initialSelected = new Set();

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.35 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;

          loadedPages.push({
            pageNumber: i,
            thumbnail: canvas.toDataURL(),
          });
          initialSelected.add(i); // Select all by default
        }

        setPages(loadedPages);
        setSelectedPages(initialSelected);
        setStatusMessage(`Loaded ${numPages} page(s). Select pages to split/extract.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error rendering PDF pages.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const togglePageSelection = (pageNumber) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNumber)) {
      updated.delete(pageNumber);
    } else {
      updated.add(pageNumber);
    }
    setSelectedPages(updated);
    setDownloadUrl(null);
  };

  const handleSelectAll = () => {
    const all = new Set(pages.map((p) => p.pageNumber));
    setSelectedPages(all);
    setDownloadUrl(null);
  };

  const handleDeselectAll = () => {
    setSelectedPages(new Set());
    setDownloadUrl(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a PDF file first.');
      return;
    }
    if (selectedPages.size === 0) {
      setStatusMessage('Please select at least one page to split/extract.');
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
    setStatusMessage('Extracting selected pages in browser RAM...');

    try {
      // Convert 1-based page numbers to 0-based indices for pdf-lib extraction
      const indices = Array.from(selectedPages).map((p) => p - 1).sort((a, b) => a - b);
      const blob = await extractPagesFromPDF(selectedFile, indices);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage(`Success! Extracted ${selectedPages.size} page(s) into a new PDF.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error splitting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Scissors className="w-5 h-5 text-indigo-400" /> Split & Extract PDF
        </h2>
        <p className="text-xs text-slate-400">Visually select and extract specific pages into a new PDF document.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click to select a PDF to split'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Pages ({selectedPages.size} of {pages.length} selected)
            </h4>
            <div className="flex items-center gap-2">
              <button onClick={handleSelectAll} className="text-xs text-indigo-400 hover:underline">Select All</button>
              <span className="text-slate-600">|</span>
              <button onClick={handleDeselectAll} className="text-xs text-slate-400 hover:text-white">Deselect All</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {pages.map((p) => {
              const isSelected = selectedPages.has(p.pageNumber);
              return (
                <div 
                  key={p.pageNumber} 
                  onClick={() => togglePageSelection(p.pageNumber)}
                  className={`bg-slate-900 border rounded-xl p-3 flex flex-col items-center relative cursor-pointer transition-all space-y-2 ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-950/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                    {isSelected ? <CheckSquare className="w-3 h-3 text-indigo-400" /> : <Square className="w-3 h-3 text-slate-500" />}
                    <span>#{p.pageNumber}</span>
                  </div>

                  <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                    <img src={p.thumbnail} alt={`Page ${p.pageNumber}`} className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={handleProcess} 
              disabled={isProcessing} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Extracting...' : `Extract ${selectedPages.size} Page(s)`}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="split-document.pdf" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Split PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}