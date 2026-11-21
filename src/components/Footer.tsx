import React from 'react';

interface FooterProps {
  idPrefix: string;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function Footer({ idPrefix, onOpenInfo }: FooterProps) {
  return (
    <footer 
      id={`${idPrefix}-footer-reusable`} 
      className="flex flex-col sm:flex-row items-center justify-between mt-14 pt-6 border-t border-[#1D3555] text-xs text-[#A8B8CC] w-full gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-center sm:text-left">
        <span>© 2026 Axiom Goal Systems</span>
        <span className="hidden sm:inline text-[#1D3555]" aria-hidden="true">·</span>
        <span className="text-[#00A3FF] font-medium">Created by Cuthman Adem Sheikh</span>
      </div>
      <div className="flex flex-wrap gap-5 justify-center">
        <button 
          onClick={() => onOpenInfo('storage')} 
          className="text-[#A8B8CC] hover:text-[#00A3FF] transition-colors cursor-pointer whitespace-nowrap"
        >
          Storage Protocol
        </button>
        <button 
          onClick={() => onOpenInfo('terms')} 
          className="text-[#A8B8CC] hover:text-[#00A3FF] transition-colors cursor-pointer whitespace-nowrap"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => onOpenInfo('security')} 
          className="text-[#A8B8CC] hover:text-[#00A3FF] transition-colors cursor-pointer whitespace-nowrap"
        >
          Security
        </button>
        <button 
          onClick={() => onOpenInfo('api')} 
          className="text-[#A8B8CC] hover:text-[#00A3FF] transition-colors cursor-pointer whitespace-nowrap"
        >
          API Documentation
        </button>
      </div>
    </footer>
  );
}
