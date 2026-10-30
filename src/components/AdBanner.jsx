'use client';

import React, { useEffect } from 'react';

export default function AdBanner({ slot, format = "auto", label = "Advertisement", minHeight = "90px" }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense load error:", e);
    }
  }, []);

  return (
    <div className="w-full my-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center flex flex-col items-center justify-center min-h-[90px]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{label}</span>
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: minHeight }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <div className="text-xs text-slate-600 italic mt-1">[ AdSpace Slot: {slot} ]</div>
      </div>
    </div>
  );
}