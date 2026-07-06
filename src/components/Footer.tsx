import React from 'react';

interface FooterProps {
  idPrefix: string;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function Footer({ idPrefix, onOpenInfo }: FooterProps) {
  return (
    <footer 
      id={`${idPrefix}-footer-reusable`} 
      className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-[#12243d] text-[10px] text-gray-500 w-full"
    >
      <div className="flex flex-col gap-1 text-center sm:text-left mb-4 sm:mb-0">
        <span>© 2026 AXIOM GOAL SYSTEMS. ARCHITECTURAL CLARITY ASSURED.</span>
        <span className="text-[#e0a96d]">CREATED BY CUTHMAN ADEM SHEIKH</span>
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
        <button 
          onClick={() => onOpenInfo('storage')} 
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          Storage Protocol
        </button>
        <button 
          onClick={() => onOpenInfo('terms')} 
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => onOpenInfo('security')} 
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          Security
        </button>
        <button 
          onClick={() => onOpenInfo('api')} 
          className="hover:text-gray-300 transition-colors cursor-pointer"
        >
          API Documentation
        </button>
      </div>
    </footer>
  );
}
