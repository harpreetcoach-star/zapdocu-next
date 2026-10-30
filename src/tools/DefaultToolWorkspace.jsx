'use client';

import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { rotatePDF, watermarkPDF } from '@/utils/pdfEngine';
import FilePreviewCard from '@/tools/FilePreviewCard';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function DefaultToolWorkspace({ toolData, activeTool }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDownloadUrl(null);
      setStatusMessage('');
    }
  };

  const handleRunTool = async () => {
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
    setStatusMessage('Processing file locally in browser RAM...');

    try {
      let resultBlob;
      if (activeTool === 'rotate-pdf') {
        resultBlob = await rotatePDF(selectedFile, 90);
      } else {
        resultBlob = await watermarkPDF(selectedFile, 'ZAPDOCU SECURE');
      }

      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setStatusMessage('Success! Your file is ready.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error processing file. Please check format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-10 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input 
          type="file" 
          accept=".pdf,.png,.jpg,.jpeg,.heic" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
          <Upload className="w-7 h-7" />
        </div>
        <p className="font-semibold text-white text-lg">
          Drag & Drop your file here, or browse computer
        </p>
        <p className="text-xs text-slate-500 mt-1">Files stay 100% private in your browser memory</p>
      </div>

      {/* Render the File Preview Card */}
      <FilePreviewCard 
        file={selectedFile} 
        onRemove={() => {
          setSelectedFile(null);
          setDownloadUrl(null);
          setStatusMessage('');
        }} 
      />

      {selectedFile && (
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleRunTool}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{isProcessing ? 'Processing in Browser RAM...' : `Run ${toolData.name}`}</span>
          </button>

          {statusMessage && (
            <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`processed-${selectedFile.name}`}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Download Processed File</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}