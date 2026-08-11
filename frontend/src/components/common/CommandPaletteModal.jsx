import React, { useState, useEffect } from 'react';
import { Search, Users, Package, FileText, X, Sparkles, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoleRoute } from '../../utils/routeUtils';

/**
 * CommandPaletteModal — Screenshot 3 Fix: 100x Enterprise Search Modal
 * Glassmorphic surface, rich category icons, keyboard hints & responsive bounds
 */
export default function CommandPaletteModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { title: 'Search Verified Vendors & Manufacturers', desc: 'Sialkot Sports, Atlas Corp, Precision Gear', type: 'Vendors', icon: Users, path: getRoleRoute('vendors') },
    { title: 'Explore B2B Product Catalog', desc: 'Pipes, Hydraulics, CNC Shells, Sensors', type: 'Catalog', icon: Package, path: getRoleRoute('product-catalog') },
    { title: 'Create New RFQ Request', desc: 'Request customized supplier quotes & pricing', type: 'RFQ', icon: FileText, path: getRoleRoute('rfqs') },
    { title: 'AI Supplier Matchfinder', desc: 'Calculate AI compatibility score & risk metrics', type: 'AI Search', icon: Sparkles, path: getRoleRoute('ai-search') }
  ];

  const filteredActions = quickActions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      {/* 100x Enterprise Search Modal Container */}
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#6C5CE7]/35 bg-[#0B1021]/95 text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3.5 border-b border-[#1E293B] px-5 py-4 bg-[#151D30]/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C5CE7]/20 text-[#0EA5E9] shrink-0">
            <Search size={18} />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search suppliers, products, RFQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-[#64748B] outline-none font-sans"
          />
          <button 
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#64748B] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Items List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Quick Actions & Platform Modules
          </div>

          {filteredActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(action.path)}
                className="group flex items-center justify-between rounded-xl p-3 text-sm cursor-pointer hover:bg-[#6C5CE7] hover:text-white transition-all duration-150"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#6C5CE7] group-hover:bg-white/20 group-hover:text-white transition-colors shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white group-hover:text-white truncate">{action.title}</p>
                    <p className="text-xs text-[#64748B] group-hover:text-white/80 truncate">{action.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 pl-3">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-[#94A3B8] group-hover:text-white font-mono text-[11px] font-semibold">
                    {action.type}
                  </span>
                  <CornerDownLeft size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Keyboard Hints */}
        <div className="flex items-center justify-between border-t border-[#1E293B] px-5 py-3 bg-[#0B1021] text-xs text-[#64748B]">
          <div className="flex items-center gap-4">
            <span>Navigation: <kbd className="px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] font-mono">↑</kbd> <kbd className="px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] font-mono">↓</kbd></span>
            <span>Select: <kbd className="px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] font-mono">↵</kbd></span>
          </div>
          <span>Close: <kbd className="px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] font-mono">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
}
