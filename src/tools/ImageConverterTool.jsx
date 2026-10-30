'use client';

import React, { useState } from 'react';
import { RefreshCw, Sparkles, Image as ImageIcon, X, Download, FileSpreadsheet } from 'lucide-react';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function ImageConverterTool({ mode = 'webp' }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [targetFormat, setTargetFormat] = useState(mode === 'webp' ? 'image/png' : 'image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setDownloadUrls([]);

      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          setImagePreviews((prev) => [
            ...prev,
            {
              name: file.name,
              url,
              width: img.naturalWidth,
              height: img.naturalHeight,
              file,
            },
          ]);
        };
        img.src = url;
      });

      setStatusMessage(`Loaded ${updatedFiles.length} image(s).`);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setDownloadUrls([]);
  };

  const handleProcess = async () => {
    if (imagePreviews.length === 0) {
      setStatusMessage('Please select at least one image.');
      return;
    }

    // Check and track usage based on the actual number of files/images being processed
    const usageCheck = checkAndTrackUsage(imagePreviews.length, false);
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
    setStatusMessage('Converting images securely in browser RAM...');

    try {
      const results = [];

      for (const item of imagePreviews) {
        const img = new Image();
        img.src = item.url;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        canvas.width = item.width;
        canvas.height = item.height;
        const ctx = canvas.getContext('2d');
        
        // Fill white background for transparent formats saved as JPEG
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, targetFormat, 0.95));
        const url = URL.createObjectURL(blob);
        const extension = targetFormat.split('/')[1];
        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;

        results.push({
          name: `${baseName}.${extension}`,
          url,
        });
      }

      setDownloadUrls(results);
      setStatusMessage(`Successfully converted ${results.length} image(s)!`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error converting images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const title = mode === 'webp' ? 'WEBP Converter' : 'HEIC to JPG Converter';
  const description = mode === 'webp' 
    ? 'Convert modern WEBP web images to standard PNG or JPG formats instantly.' 
    : 'Convert iPhone HEIC photos into universal JPG or PNG images.';

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" /> {title}
        </h2>
        <p className="text-xs text-slate-400">{description}</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input 
          type="file" 
          accept={mode === 'webp' ? 'image/webp, image/jpeg, image/png' : 'image/heic, image/heif, image/*'} 
          multiple 
          onChange={handleFileChange} 
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
        />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <ImageIcon className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">Click or drag images here</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Loaded Images ({imagePreviews.length})</h4>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Target Format:</span>
              <select 
                value={targetFormat} 
                onChange={(e) => setTargetFormat(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {imagePreviews.map((img, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  {img.width}x{img.height}
                </div>

                <button 
                  onClick={() => removeFile(index)} 
                  className="absolute top-2 right-2 bg-slate-950/90 text-slate-400 hover:text-red-400 p-1 rounded border border-slate-800 transition-colors"
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
              <span>{isProcessing ? 'Converting...' : 'Convert Images'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrls.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {downloadUrls.map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url} 
                    download={item.name} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl text-center shadow-lg transition-all flex items-center justify-between text-xs"
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}