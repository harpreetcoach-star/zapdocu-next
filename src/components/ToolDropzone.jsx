'use client';
import { executeWithLimit } from '@/utils/usageLimit';
import { useRef } from 'react';

export default function ToolDropzone({ slug }) {
  const toolName = slug ? slug.replace(/-/g, ' ') : 'tool';
  const fileInputRef = useRef(null);

  // Triggered when files are selected or dropped
  const handleFilesSelected = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check usage with the actual number of files selected
    executeWithLimit(files, () => {
      // If allowed, this callback runs your processing logic
      alert(`Successfully processed ${files.length} file(s) for ${toolName}!`);
      // TODO: Pass your actual processing logic here
    });

    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
      {/* Hidden native file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFilesSelected} 
        multiple 
        className="hidden" 
      />

      <div 
        onClick={triggerBrowse}
        className="max-w-md mx-auto border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 cursor-pointer transition-all"
      >
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
            📁
          </div>
          <p className="text-sm font-semibold text-white">
            Drop your files here, or <span className="text-indigo-400 underline">browse</span>
          </p>
          <p className="text-xs text-slate-400">
            100% Secure Client-Side Processing • Never uploaded to servers
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={triggerBrowse}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
      >
        Process Securely Now
      </button>
    </div>
  );
}