'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, FileText, Layers, Download, X, ArrowUp, ArrowDown } from 'lucide-react';
import { mergePDFs } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function MergePdfTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
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

    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setDownloadUrl(null);
      setStatusMessage('Generating visual previews...');
      setIsProcessing(true);

      try {
        const newPreviews = [...filePreviews];
        for (const file of newFiles) {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.3 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;

          newPreviews.push({
            name: file.name,
            thumbnail: canvas.toDataURL(),
            pageCount: pdf.numPages,
            file,
          });
        }

        setFilePreviews(newPreviews);
        setStatusMessage(`Loaded ${updatedFiles.length} PDF document(s).`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error reading PDF files.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
    setDownloadUrl(null);
    setStatusMessage(`Removed document. ${updatedFiles.length} remaining.`);
  };

  const moveFile = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedFiles.length) return;

    const filesCopy = [...selectedFiles];
    const previewsCopy = [...filePreviews];

    const tempFile = filesCopy[index];
    filesCopy[index] = filesCopy[newIndex];
    filesCopy[newIndex] = tempFile;

    const tempPreview = previewsCopy[index];
    previewsCopy[index] = previewsCopy[newIndex];
    previewsCopy[newIndex] = tempPreview;

    setSelectedFiles(filesCopy);
    setFilePreviews(previewsCopy);
    setDownloadUrl(null);
  };

  const handleProcess = async () => {
    if (selectedFiles.length < 2) {
      setStatusMessage('Please select at least 2 PDF files to merge.');
      return;
    }

    // Check usage limit based on how many files are being processed
    const usageCheck = checkAndTrackUsage(selectedFiles.length, false);
    if (!usageCheck.allowed) {
      const upgradeNow = window.confirm(`${usageCheck.message}\n\nWould you like to upgrade to ZapDocu Pro now?`);
      if (upgradeNow) {
        window.location.href = '/#pricing';
      }
      return;
    }

    // Trigger update event so the counter on screen refreshes instantly
    window.dispatchEvent(new Event('usageUpdated'));

    setIsProcessing(true);
    setStatusMessage('Merging PDFs securely in browser RAM...');

    try {
      const blob = await mergePDFs(selectedFiles);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage('Success! PDFs successfully merged.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error merging PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Merge PDFs Visually
        </h2>
        <p className="text-xs text-slate-400">Combine multiple PDF documents into one single file entirely in your browser.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">Click or drop multiple PDFs here</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {filePreviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Document Order ({filePreviews.length})</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {filePreviews.map((item, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  #{index + 1}
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-slate-950/90 text-slate-400 hover:text-red-400 p-1 rounded border border-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="w-full h-28 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                  <img src={item.thumbnail} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>

                <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center" title={item.name}>
                  {item.name}
                </span>

                <span className="text-[10px] text-slate-500">{item.pageCount} page(s)</span>

                <div className="flex items-center gap-1 w-full pt-1">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-[10px] py-1 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowUp className="w-3 h-3" /> Move
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === filePreviews.length - 1}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-[10px] py-1 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowDown className="w-3 h-3" /> Move
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Merging...' : 'Merge PDFs'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="zapdocu-merged.pdf"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Merged PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}