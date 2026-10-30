'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, FileText, Lock, Download, Eye, EyeOff } from 'lucide-react';
import { protectPDF } from '@/utils/pdfEngine';
import { checkAndTrackUsage } from '@/utils/usageLimit';

export default function ProtectPdfTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [pages, setPages] = useState([]);
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
      setStatusMessage('Rendering previews...');
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const loadedPages = [];
        for (let i = 1; i <= Math.min(numPages, 8); i++) { // preview first few pages
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          loadedPages.push({ pageNumber: i, thumbnail: canvas.toDataURL() });
        }

        setPages(loadedPages);
        setStatusMessage(`Loaded ${file.name} successfully.`);
      } catch (err) {
        console.error(err);
        setStatusMessage('Error loading PDF.');
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
    if (!password) {
      setStatusMessage('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage('Passwords do not match.');
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
    setStatusMessage('Encrypting document securely in browser RAM...');

    try {
      const blob = await protectPDF(selectedFile, password);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMessage('Success! PDF successfully encrypted.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error encrypting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-indigo-400" /> Protect PDF
        </h2>
        <p className="text-xs text-slate-400">Encrypt confidential PDFs with strong passwords securely in your browser.</p>
      </div>

      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-pointer relative bg-slate-950/40">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-white text-sm">{selectedFile ? selectedFile.name : 'Click to select a PDF to encrypt'}</p>
        <p className="text-xs text-slate-500 mt-1">100% private, processed in browser RAM</p>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Set Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {pages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Document Preview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
                {pages.map((p, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
                    <div className="w-full h-24 flex items-center justify-center bg-slate-950 rounded overflow-hidden border border-slate-800">
                      <img src={p.thumbnail} alt={`Page ${p.pageNumber}`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Page {p.pageNumber}</span>
                  </div>
                ))}
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
              <span>{isProcessing ? 'Encrypting...' : 'Encrypt & Protect PDF'}</span>
            </button>

            {statusMessage && <p className="text-center text-sm text-indigo-300 font-medium">{statusMessage}</p>}

            {downloadUrl && (
              <a 
                href={downloadUrl} 
                download="protected-document.pdf" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Protected PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}