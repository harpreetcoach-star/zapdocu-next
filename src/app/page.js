'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PricingSection from '@/components/PricingSection';
import AdBanner from '@/components/AdBanner';
import ToolRenderer from '@/components/ToolRenderer'; // <-- Import your Tool Renderer here!
import { 
  Sparkles, Layers, Minimize2, Image as ImageIcon, FileOutput, Scissors, Sliders,
  Move, FileText, FileSpreadsheet, Lock, Unlock, Hash, Type, RefreshCw
} from 'lucide-react';

export default function HomePage() {
  const [activeTool, setActiveTool] = useState('merge-pdf');
  const [activeCategory, setActiveCategory] = useState('all');

  // Complete 18-Tool List & Metadata
  const toolsList = [
    { id: 'merge-pdf', name: 'Merge PDF', category: 'pdf', icon: Layers, desc: 'Combine multiple PDFs into a single organized file.' },
    { id: 'split-pdf', name: 'Split PDF', category: 'pdf', icon: Scissors, desc: 'Extract specific page ranges into separate PDF documents.' },
    { id: 'rearrange-pdf', name: 'Rearrange PDF', category: 'pdf', icon: Move, desc: 'Visually reorder or delete pages within your PDF.' },
    { id: 'rotate-pdf', name: 'Rotate PDF', category: 'pdf', icon: RefreshCw, desc: 'Rotate landscape or upside-down pages instantly.' },
    { id: 'extract-pages', name: 'Extract Pages', category: 'pdf', icon: FileOutput, desc: 'Pull individual pages out into a brand-new PDF file.' },
    { id: 'watermark-pdf', name: 'Watermark PDF', category: 'security', icon: Type, desc: 'Overlay custom text watermarks like CONFIDENTIAL onto pages.' },
    { id: 'compress-pdf', name: 'Compress PDF', category: 'pdf', icon: Minimize2, desc: 'Reduce PDF file size while maintaining optimum clarity.' },
    { id: 'pdf-to-word', name: 'PDF to Word', category: 'conversion', icon: FileText, desc: 'Convert PDF documents into editable Microsoft Word (.docx) files.' },
    { id: 'word-to-pdf', name: 'Word to PDF', category: 'conversion', icon: FileText, desc: 'Convert Word .docx documents directly into clean PDFs.' },
    { id: 'excel-to-pdf', name: 'Excel to PDF', category: 'conversion', icon: FileSpreadsheet, desc: 'Convert spreadsheets and tables directly to PDF format.' },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', category: 'conversion', icon: ImageIcon, desc: 'Convert PDF pages into high-resolution JPG images.' },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', category: 'conversion', icon: FileOutput, desc: 'Turn JPG or PNG images into a clean PDF document.' },
    { id: 'heic-to-jpg', name: 'HEIC to JPG', category: 'image', icon: ImageIcon, desc: 'Convert iPhone HEIC photos into universal JPG images.' },
    { id: 'add-page-numbers', name: 'Add Page Numbers', category: 'pdf', icon: Hash, desc: 'Stamp customizable page numbers onto your documents.' },
    { id: 'protect-pdf', name: 'Protect PDF', category: 'security', icon: Lock, desc: 'Encrypt your confidential PDFs with strong passwords.' },
    { id: 'unlock-pdf', name: 'Unlock PDF', category: 'security', icon: Unlock, desc: 'Remove password protection and printing restrictions.' },
    { id: 'image-resizer', name: 'Image Resizer', category: 'image', icon: Sliders, desc: 'Adjust dimensions and compress image size easily.' },
    { id: 'webp-converter', name: 'WEBP Converter', category: 'image', icon: ImageIcon, desc: 'Convert modern WEBP web images to standard PNG/JPG.' }
  ];

  const filteredTools = toolsList.filter(tool => {
    if (activeCategory === 'pdf') return tool.category === 'pdf';
    if (activeCategory === 'conversion') return tool.category === 'conversion';
    if (activeCategory === 'image') return tool.category === 'image' || tool.category === 'security';
    return true;
  });

  const currentToolData = toolsList.find(t => t.id === activeTool) || toolsList[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar 
        onOpenPaywall={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        onSelectTool={(tool) => {
          setActiveTool(tool);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Hero Section */}
<div className="text-center max-w-4xl mx-auto px-4 py-12">
  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm">
    <span>🔒</span> Zero File Uploads to External Servers • 100% Client-Side RAM
  </div>
  
  <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
    Free Online PDF & Image Converter <br />
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
      Private & Lightning Fast
    </span>
  </h1>
  
  <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
    Merge PDF files, compress PDFs, convert documents and images instantly for free. No software installation required. Your files stay securely in your browser and are never uploaded to any cloud server.
  </p>
</div>

        {/* Monetization Ad Banner */}
        <div className="max-w-4xl mx-auto mb-10">
          <AdBanner slot="1234567890" label="Google AdSense Banner Slot" minHeight="80px" />
        </div>

        {/* Active Tool Workspace Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-16">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <currentToolData.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentToolData.name}</h2>
              <p className="text-xs text-slate-400">{currentToolData.desc}</p>
            </div>
          </div>

          {/* HERE IS THE FIX: We render the ToolRenderer dynamically instead of hardcoded upload boxes! */}
          <ToolRenderer activeTool={activeTool} toolData={currentToolData} />
        </div>

        {/* All 18 Utility Tools Grid Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">All 18 Utility Tools</h2>
              <p className="text-sm text-slate-400">Click any tool card below to launch its specialized workflow.</p>
            </div>
            
            {/* Category Filter Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                All (18)
              </button>
              <button 
                onClick={() => setActiveCategory('pdf')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === 'pdf' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                PDF Suite
              </button>
              <button 
                onClick={() => setActiveCategory('conversion')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === 'conversion' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Conversions
              </button>
              <button 
                onClick={() => setActiveCategory('image')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === 'image' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Image & Security
              </button>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <div 
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`bg-slate-900/60 border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:border-indigo-500/60 hover:bg-slate-900/90 group ${isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/20' : 'border-slate-800'}`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                    <span className="uppercase tracking-wider text-[10px] text-slate-500">{tool.category}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Launch Tool →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection onSelectPlan={(plan) => alert(`Selected plan: ${plan}`)} />

      </main>

    </div>
  );
}