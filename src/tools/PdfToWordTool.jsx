'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, FileText, FileSpreadsheet, Download } from 'lucide-react';
import { convertPdfToWord } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function PdfToWordTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [pageCount, setPageCount] = useState(0);
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
      setStatusMessage('Generating visual preview...');
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPageCount(pdf.numPages);

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.35 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        setThumbnail(canvas.toDataURL());
        setStatusMessage(`Loaded ${file.name} successfully.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('File loaded successfully.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a PDF file first.');
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
    setStatusMessage('Extracting text and converting to Word in browser RAM...');

    try {
      const blob = await convertPdfToWord(selectedFile);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage('Success! Converted to Word document.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error converting PDF to Word.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> PDF to Word Converter
        </h2>
        <p className="text-xs text-slate-400">Extract text and layout from PDF files into editable Microsoft Word format.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click or drop a PDF file here'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          {thumbnail && (
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              <div className="w-20 h-28 flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                <img src={thumbnail} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Selected Document</h4>
                <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{pageCount} page(s) • {(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={handleProcess} 
              disabled={isProcessing} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Converting...' : 'Convert to Word (.doc)'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="converted-document.doc" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Word Document
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}