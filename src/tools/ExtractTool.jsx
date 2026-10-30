'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, FileText, Download } from 'lucide-react';
import { extractPages } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function ExtractTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
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
      setSelectedIndices(new Set());
      setStatusMessage('Rendering thumbnails for extraction...');
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
            index: i - 1,
            pageNumber: i,
            thumbnail: canvas.toDataURL(),
          });
        }

        setPages(loadedPages);
        setStatusMessage(`Loaded ${numPages} pages. Select pages to extract.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error loading PDF pages.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const togglePageSelection = (index) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === pages.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(pages.map((p) => p.index)));
    }
  };

  const handleExtract = async () => {
    if (!selectedFile || selectedIndices.size === 0) {
      setStatusMessage('Please select at least one page to extract.');
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
      // Sort indices chronologically to preserve document order
      const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
      const blob = await extractPages(selectedFile, sortedIndices);
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatusMessage(`Successfully extracted ${sortedIndices.length} pages!`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error extracting pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> Extract PDF Pages
        </h2>
        <p className="text-xs text-slate-400">Click thumbnails to select specific pages you want to save into a new PDF.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click to select a PDF to extract from'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed securely in browser RAM</p>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Pages ({selectedIndices.size} of {pages.length} selected)
            </h4>
            <button 
              onClick={handleSelectAll}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {selectedIndices.size === pages.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {pages.map((p) => {
              const isSelected = selectedIndices.has(p.index);
              return (
                <div 
                  key={p.index} 
                  onClick={() => togglePageSelection(p.index)}
                  className={`bg-slate-900 border rounded-xl p-3 flex flex-col items-center relative cursor-pointer transition-all space-y-2 ${
                    isSelected ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-900/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Selection Checkbox Badge */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}>
                    {isSelected ? '✓' : p.pageNumber}
                  </div>

                  <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                    <img src={p.thumbnail} alt={`Page ${p.pageNumber}`} className="max-h-full max-w-full object-contain" />
                  </div>

                  <span className={`text-xs font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    Page {p.pageNumber}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={handleExtract} 
              disabled={isProcessing || selectedIndices.size === 0} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Extracting...' : `Extract ${selectedIndices.size} Selected Page(s)`}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="extracted-pages.pdf" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Extracted PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}