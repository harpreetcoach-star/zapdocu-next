'use client';

import React, { useState } from 'react';
import { Upload, Type, CheckCircle2, RefreshCw, X, FileText } from 'lucide-react';
import { watermarkPDF } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function WatermarkTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDownloadUrl(null);
      setStatusMessage('');
      e.target.value = '';
    }
  };

  const handleRunWatermark = async () => {
    if (!selectedFile) return;

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
    setStatusMessage('Applying watermark in browser RAM...');

    try {
      const resultBlob = await watermarkPDF(selectedFile, watermarkText);
      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setStatusMessage('Success! Watermark applied.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error applying watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Type className="w-5 h-5 text-indigo-400" /> Watermark PDF
        </h2>
        <p className="text-xs text-slate-400">Add custom text watermarks securely across your documents.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-3">
          <Type className="w-6 h-6" />
        </div>
        <p className="font-semibold text-white">Click to select a PDF for watermarking</p>
        <p className="text-xs text-slate-500 mt-1">Processed securely in browser RAM</p>
      </div>

      {selectedFile && (
        <div className="flex flex-col space-y-4 w-full">
          {/* Direct built-in file preview */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl shadow-md w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate max-w-sm">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB • Ready</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setDownloadUrl(null);
                setStatusMessage('');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Watermark Text
            </label>
            <input 
              type="text" 
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL, DRAFT, APPROVED"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            onClick={handleRunWatermark}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Type className="w-5 h-5" />}
            <span>{isProcessing ? 'Applying Watermark...' : 'Apply Watermark'}</span>
          </button>

          {statusMessage && (
            <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`zapdocu-watermarked-${selectedFile ? selectedFile.name : 'document.pdf'}`}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Download Watermarked PDF</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}