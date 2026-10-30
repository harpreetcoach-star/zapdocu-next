'use client';

import React, { useState } from 'react';
import { RefreshCw, Sparkles, FileText, FileSpreadsheet, Download } from 'lucide-react';
import { convertWordToPdf } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function WordToPdfTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDownloadUrl(null);
      setStatusMessage(`Loaded ${file.name} successfully.`);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a Word/Text document first.');
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
    setStatusMessage('Converting document to PDF in browser RAM...');

    try {
      const blob = await convertWordToPdf(selectedFile);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage('Success! Converted document to PDF.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error converting document to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> Word to PDF Converter
        </h2>
        <p className="text-xs text-slate-400">Convert Microsoft Word and text documents into standard PDF files instantly.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".doc,.docx,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">
          {selectedFile ? 'Change document (Click or drop new file)' : 'Click or drop a Word or Text file'}
        </p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Selected Document</h4>
              <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">Document File • {(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={handleProcess} 
              disabled={isProcessing} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Converting...' : 'Convert to PDF'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="converted-document.pdf" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Converted PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}