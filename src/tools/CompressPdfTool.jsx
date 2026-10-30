'use client';

import React, { useState } from 'react';
import { RefreshCw, Sparkles, Sliders, Download, FileText } from 'lucide-react';
import { compressPDF } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function CompressPdfTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [qualityLevel, setQualityLevel] = useState('recommended'); // 'low', 'recommended', 'extreme'
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);
  const [savedPercentage, setSavedPercentage] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDownloadUrl(null);
      setCompressedSize(null);
      setSavedPercentage(0);
      setStatusMessage(`Loaded ${file.name} successfully.`);
    }
  };

  const handleCompress = async () => {
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
    setStatusMessage('Optimizing image streams and compressing PDF in browser RAM...');

    try {
      const compressedBlob = await compressPDF(selectedFile, qualityLevel);
      const url = URL.createObjectURL(compressedBlob);
      
      const origSize = selectedFile.size;
      const compSize = compressedBlob.size;
      const savedPct = Math.max(0, Math.round(((origSize - compSize) / origSize) * 100));

      setCompressedSize(compSize);
      setSavedPercentage(savedPct);
      setDownloadUrl(url);
      setStatusMessage(`Success! Reduced file size by ${savedPct}%.`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error compressing PDF. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-white">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" /> Compress PDF
        </h2>
        <p className="text-xs text-slate-400">Choose your compression tier and shrink heavy PDFs securely in RAM.</p>
      </div>

      {/* File Drop Area */}
      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <FileText className="w-8 h-8 text-indigo-400 mb-2" />
        <p className="font-semibold text-sm">
          {selectedFile ? 'Change file (Click or drop new PDF)' : 'Click or drop a PDF file here'}
        </p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {selectedFile && (
        <div className="space-y-6">
          {/* File Stats Header */}
          <div className="grid grid-cols-3 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl text-center">
            <div>
              <p className="text-xs text-slate-400">Original Size</p>
              <p className="text-sm font-bold text-slate-200">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Compressed Size</p>
              <p className="text-sm font-bold text-emerald-400">
                {compressedSize ? `${(compressedSize / (1024 * 1024)).toFixed(2)} MB` : '---'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Saved</p>
              <p className="text-sm font-bold text-indigo-400">{savedPercentage}%</p>
            </div>
          </div>

          {/* Quality Selector Control */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Compression Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Low Compression', desc: 'High Quality (~80%)' },
                { id: 'recommended', label: 'Recommended', desc: 'Balanced (~60%)' },
                { id: 'extreme', label: 'Extreme', desc: 'Smallest Size (~30%)' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setQualityLevel(option.id)}
                  className={`p-3 border rounded-xl text-left transition-all ${
                    qualityLevel === option.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-xs">{option.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isProcessing ? 'Compressing PDF...' : 'Compress PDF'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`compressed-${selectedFile.name}`}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Compressed PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}