'use client';

import React, { useState, useEffect } from 'react';
import MergePdfTool from '@/tools/MergePdfTool';
import SplitPdfTool from '@/tools/SplitPdfTool';
import WatermarkTool from '@/tools/WatermarkTool';
import RotateTool from '@/tools/RotateVisualTool';
import RearrangeTool from '@/tools/RearrangeTool';
import ExtractTool from '@/tools/ExtractTool';
import PageNumberTool from '@/tools/PageNumberTool';
import JpgToPdfTool from '@/tools/JpgToPdfTool';
import ImageResizerTool from '@/tools/ImageResizerTool';
import PdfToJpgTool from '@/tools/PdfToJpgTool';
import ProtectPdfTool from '@/tools/ProtectPdfTool';
import ImageConverterTool from '@/tools/ImageConverterTool';
import CompressPdfTool from '@/tools/CompressPdfTool';
import UnlockPdfTool from '@/tools/UnlockPdfTool';
import PdfToWordTool from '@/tools/PdfToWordTool';
import WordToPdfTool from '@/tools/WordToPdfTool';
import ExcelToPdfTool from '@/tools/ExcelToPdfTool';
import DefaultToolWorkspace from '@/tools/DefaultToolWorkspace';
import { getRemainingUsage } from '@/utils/usageLimit';

export default function ToolRenderer({ activeTool, toolData, slug }) {
  const rawId = activeTool || slug || '';
  const toolId = rawId.toLowerCase();

  const [mounted, setMounted] = useState(false);
  const [usage, setUsage] = useState({ used: 0, remaining: 15 });

  useEffect(() => {
    setMounted(true);
    setUsage(getRemainingUsage());

    // Listen for real-time usage updates when tools process files
    const handleUpdate = () => {
      setUsage(getRemainingUsage());
    };
    window.addEventListener('usageUpdated', handleUpdate);
    return () => window.removeEventListener('usageUpdated', handleUpdate);
  }, []);

  let toolComponent;

  if (toolId.includes('merge')) toolComponent = <MergePdfTool />;
  else if (toolId.includes('split') || toolId.includes('extract-pages')) toolComponent = <SplitPdfTool />;
  else if (toolId.includes('rearrange')) toolComponent = <RearrangeTool />;
  else if (toolId.includes('rotate')) toolComponent = <RotateTool />;
  else if (toolId.includes('extract')) toolComponent = <ExtractTool />;
  else if (toolId.includes('watermark')) toolComponent = <WatermarkTool />;
  else if (toolId.includes('compress')) toolComponent = <CompressPdfTool />;
  else if (toolId.includes('pdf-to-word')) toolComponent = <PdfToWordTool />;
  else if (toolId.includes('word-to-pdf')) toolComponent = <WordToPdfTool />;
  else if (toolId.includes('excel-to-pdf')) toolComponent = <ExcelToPdfTool />;
  else if (toolId.includes('pdf-to-jpg')) toolComponent = <PdfToJpgTool />;
  else if (toolId.includes('jpg-to-pdf')) toolComponent = <JpgToPdfTool />;
  else if (toolId.includes('heic')) toolComponent = <ImageConverterTool mode="heic" />;
  else if (toolId.includes('page-numbers') || toolId.includes('add-page')) toolComponent = <PageNumberTool />;
  else if (toolId.includes('protect')) toolComponent = <ProtectPdfTool />;
  else if (toolId.includes('unlock')) toolComponent = <UnlockPdfTool />;
  else if (toolId.includes('image-resizer')) toolComponent = <ImageResizerTool />;
  else if (toolId.includes('webp')) toolComponent = <ImageConverterTool mode="webp" />;
  else toolComponent = <DefaultToolWorkspace toolName={rawId} toolData={toolData} />;

  return (
    <div className="space-y-4 pb-8">
      {toolComponent}

      {mounted && (
        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-indigo-400 font-medium">
            ⚡ Free Tier: <span className="font-bold">{usage.remaining}</span> of 50 free files remaining today
          </p>
          <p className="text-xs text-slate-500">
            Need unlimited batching? <a href="/#pricing" className="text-indigo-400 underline">Upgrade to Pro ($4.99/mo)</a>
          </p>
        </div>
      )}
    </div>
  );
}