'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Image as ImageIcon, FileText, X, Download } from 'lucide-react';
import { convertImagesToPDF } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function JpgToPdfTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setDownloadUrl(null);

      // Generate local object URLs for instant visual card previews
      const newPreviews = newFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setStatusMessage(`Loaded ${updatedFiles.length} image(s) successfully.`);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setDownloadUrl(null);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      setStatusMessage('Please select at least one image file.');
      return;
    }

    // Check and track usage based on the actual number of files/images being processed
    const usageCheck = checkAndTrackUsage(selectedFiles.length, false);
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
    setStatusMessage('Converting images to PDF in browser RAM...');

    try {
      const blob = await convertImagesToPDF(selectedFiles);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage(`Successfully converted ${selectedFiles.length} image(s) to PDF!`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error converting images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" /> JPG to PDF Converter
        </h2>
        <p className="text-xs text-slate-400">Transform your images into clean, high-quality PDF documents instantly.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept="image/jpeg, image/png, image/webp" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <ImageIcon className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">Click or drag images here (JPG, PNG, WEBP)</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Image Previews ({imagePreviews.length})</h4>
            <span className="text-xs text-indigo-400">Card Grid View</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {imagePreviews.map((img, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  #{index + 1}
                </div>

                <button 
                  onClick={() => removeFile(index)} 
                  className="absolute top-2 right-2 bg-slate-950/90 text-slate-400 hover:text-red-400 p-1 rounded border border-slate-800 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="w-full h-32 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mt-4">
                  <img src={img.url} alt={img.name} className="max-h-full max-w-full object-contain" />
                </div>

                <span className="text-[11px] text-slate-400 truncate w-full text-center" title={img.name}>
                  {img.name}
                </span>
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
              <span>{isProcessing ? 'Converting...' : 'Convert Images to PDF'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="converted-images.pdf" 
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