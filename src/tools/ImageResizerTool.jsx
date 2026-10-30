'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Image as ImageIcon, X, Download, Sliders } from 'lucide-react';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function ImageResizerTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [resizeMode, setResizeMode] = useState('percentage'); // 'percentage' or 'dimensions'
  const [percentage, setPercentage] = useState(75);
  const [customWidth, setCustomWidth] = useState(800);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setDownloadUrls([]);

      // Read images to get their native dimensions and create object URLs
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

      setStatusMessage(`Loaded ${updatedFiles.length} image(s) successfully.`);
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
    setStatusMessage('Resizing images securely in browser RAM...');

    try {
      const results = [];

      for (const item of imagePreviews) {
        const img = new Image();
        img.src = item.url;
        await new Promise((resolve) => { img.onload = resolve; });

        let targetWidth = item.width;
        let targetHeight = item.height;

        if (resizeMode === 'percentage') {
          targetWidth = Math.round(item.width * (percentage / 100));
          targetHeight = Math.round(item.height * (percentage / 100));
        } else {
          const ratio = item.height / item.width;
          targetWidth = parseInt(customWidth, 10) || item.width;
          targetHeight = Math.round(targetWidth * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert canvas back to blob/url
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, item.file.type || 'image/jpeg', 0.9));
        const url = URL.createObjectURL(blob);

        results.push({
          name: `resized-${item.name}`,
          url,
        });
      }

      setDownloadUrls(results);
      setStatusMessage(`Successfully resized ${results.length} image(s)!`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error resizing images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" /> Image Resizer
        </h2>
        <p className="text-xs text-slate-400">Visually adjust dimensions and compress images directly in your browser.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept="image/jpeg, image/png, image/webp" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <ImageIcon className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">Click or drag images to resize (JPG, PNG, WEBP)</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Image Previews ({imagePreviews.length})</h4>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs text-slate-300">
                <button 
                  onClick={() => setResizeMode('percentage')}
                  className={`px-2 py-1 rounded ${resizeMode === 'percentage' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
                >
                  Percentage
                </button>
                <button 
                  onClick={() => setResizeMode('dimensions')}
                  className={`px-2 py-1 rounded ${resizeMode === 'dimensions' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
                >
                  Custom Width
                </button>
              </div>

              {resizeMode === 'percentage' ? (
                <select 
                  value={percentage} 
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={25}>25% Size</option>
                  <option value={50}>50% Size</option>
                  <option value={75}>75% Size</option>
                  <option value={150}>150% Size</option>
                </select>
              ) : (
                <input 
                  type="number" 
                  value={customWidth} 
                  onChange={(e) => setCustomWidth(e.target.value)} 
                  placeholder="Width px" 
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
            {imagePreviews.map((img, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center relative group hover:border-indigo-500/50 transition-all space-y-2">
                <div className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                  {img.width}x{img.height}px
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
              <span>{isProcessing ? 'Resizing...' : 'Resize Images'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrls.length > 0 && (
              <div className="space-y-2">
                {downloadUrls.map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url} 
                    download={item.name} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Download className="w-4 h-4" /> Download {item.name}
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