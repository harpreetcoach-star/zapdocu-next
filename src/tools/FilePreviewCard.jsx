'use client';

import React from 'react';
import { FileText, X, CheckCircle2 } from 'lucide-react';

export default function FilePreviewCard({ file, onRemove }) {
  if (!file) return null;

  // Format file size nicely (e.g., KB or MB)
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 mt-4 shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{file.name}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span>Size: {formatSize(file.size)}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready in Browser RAM
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
        title="Remove file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}