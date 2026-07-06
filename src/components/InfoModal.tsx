import React, { useEffect } from 'react';
import { X, Shield, Lock, FileText, Server, HelpCircle, Terminal, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type InfoModalType = 'storage' | 'terms' | 'security' | 'api' | 'help';

interface InfoModalProps {
  isOpen: boolean;
  type: InfoModalType | null;
  onClose: () => void;
}

export default function InfoModal({ isOpen, type, onClose }: InfoModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  const getContent = () => {
    switch (type) {
      case 'storage':
        return {
          title: 'AXIOM-ST1: Storage Protocol Specification',
          subtitle: 'Persistent Local-First Schema Definition',
          icon: Server,
          color: 'text-amber-400',
          borderColor: 'border-amber-500/20',
          bgColor: 'bg-amber-500/5',
          body: (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                The <strong className="text-[#e0a96d]">Axiom Focus System</strong> operates on a strict local-first data integrity architecture. All personal metrics, goals, scheduled tasks, and focus configuration structures are computed and cached directly within the sandbox.
              </p>
              <div className="bg-[#051120] border border-[#1a2c42] rounded-xl p-3.5 font-mono text-[11px] space-y-2">
                <div className="text-gray-500 flex justify-between">
                  <span>[PROTOCOL_SCHEMA]</span>
                  <span className="text-[#e0a96d]">v1.4.0</span>
                </div>
                <div className="text-[#e0a96d]">KEY: axiom_goals</div>
                <div className="text-gray-400">
                  Holds collection array of goals, status nodes, completed timestamps, and localized Pomodoro counts.
                </div>
                <div className="text-[#e0a96d] mt-2">KEY: axiom_profile</div>
                <div className="text-gray-400">
                  Stores user identity payload, avatar mapping reference, and micro-interruption filters.
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mt-4 flex items-center gap-2">
                <CheckCircle size={14} className="text-amber-400" />
                Data Integrity Guarantees
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                <li><strong className="text-gray-200">Zero Cloud Leakage:</strong> No telemetry data, task details, or personal names are broadcast to external telemetry providers.</li>
                <li><strong className="text-gray-200">Rehydration Engine:</strong> Application auto-discovers previous focus state values instantly on container launch.</li>
                <li><strong className="text-gray-200">Flush Protocol:</strong> Direct profile reset triggers a comprehensive database clearance safely.</li>
              </ul>
            </div>
          ),
        };

      case 'terms':
        return {
          title: 'Terms of Architectural Agreement',
          subtitle: 'Usage Specifications & Focus Guidelines',
          icon: FileText,
          color: 'text-[#e0a96d]',
          borderColor: 'border-[#e0a96d]/20',
          bgColor: 'bg-[#e0a96d]/5',
          body: (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                By interacting with <strong className="text-[#e0a96d]">Axiom Focus</strong>, you enter a covenant of deliberate focus and architectural clarity. You agree to minimize visual and secondary notification noise to maintain a high-performance flow state.
              </p>
              <div className="border border-[#142944] bg-[#0b1d31]/50 p-4 rounded-xl">
                <p className="text-[#e0a96d] italic text-center font-display font-medium">
                  "wali dhismo ayaa ku socda wepsite kaan, mahadsanid sida quruxda badan aad uso boqatey wepkayga"
                </p>
                <span className="text-[10px] font-mono text-gray-500 text-center block mt-1">
                  AXIOM VISUAL COVENANT - CUTHMAN ADEM SHEIKH
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-4">Core Conditions</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-400">
                <li>
                  <strong className="text-gray-200">Personal Commitment:</strong> You shall define clear strategic objectives and break them into specific, actionable milestone nodes.
                </li>
                <li>
                  <strong className="text-gray-200">Pomodoro Dedication:</strong> Focus timers represent absolute execution blocks. Multi-tasking during active timer counts is discouraged.
                </li>
                <li>
                  <strong className="text-gray-200">No Liability:</strong> The creator, Cuthman Adem Sheikh, makes no guarantees of sudden peak-performance transformation without genuine cognitive participation from the user.
                </li>
              </ol>
            </div>
          ),
        };

      case 'security':
        return {
          title: 'AXIOM-SEC2: Sandbox Security Protocols',
          subtitle: 'Cryptographic Boundings & Local Sandboxing',
          icon: Shield,
          color: 'text-blue-400',
          borderColor: 'border-blue-500/20',
          bgColor: 'bg-blue-500/5',
          body: (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                Axiom is engineered with robust client-side containerization. Security policies enforce strict local constraints to safeguard your roadmap from active monitoring.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-[#051120] border border-[#1a2c42] rounded-xl">
                  <div className="text-blue-400 font-bold mb-1 font-mono text-[11px]">XSS PROTECTION</div>
                  <p className="text-gray-400 text-[11px]">
                    Strict input sanitation layers ensure custom milestone titles prevent script injections.
                  </p>
                </div>
                <div className="p-3 bg-[#051120] border border-[#1a2c42] rounded-xl">
                  <div className="text-[#e0a96d] font-bold mb-1 font-mono text-[11px]">IFRAME BOUNDINGS</div>
                  <p className="text-gray-400 text-[11px]">
                    Strict frame sandbox constraints shield system cookies from external frame querying.
                  </p>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mt-4">Offline-First Trust Profile</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                <li>All cryptographic random keys generated for milestone mapping ids use standard high-entropy window generators.</li>
                <li>Zero external stylesheet scripts or non-verified trackers are allowed into the runtime stack.</li>
                <li>Local persistence does not send telemetry to unverified clouds.</li>
              </ul>
            </div>
          ),
        };

      case 'api':
        return {
          title: 'AXIOM-API3: Developer Integration Hooks',
          subtitle: 'Command-Line Queries & State Interfaces',
          icon: Terminal,
          color: 'text-purple-400',
          borderColor: 'border-purple-500/20',
          bgColor: 'bg-purple-500/5',
          body: (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                The Axiom State Engine is fully accessible programmatically via standard browser console protocols. Feel free to query, extend, or automate your milestones.
              </p>
              <div className="bg-[#051120] border border-[#1a2c42] rounded-xl p-3.5 font-mono text-[11px] space-y-2 text-gray-300">
                <div className="text-gray-500">// Fetch current goals collection</div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">goals</span> = <span className="text-yellow-400">JSON</span>.<span className="text-emerald-400">parse</span>(<span className="text-blue-400">localStorage</span>.<span className="text-emerald-400">getItem</span>(<span className="text-green-400">'axiom_goals'</span>));
                </div>
                <div>
                  <span className="text-[#e0a96d]">console</span>.<span className="text-emerald-400">log</span>(<span className="text-blue-400">goals</span>);
                </div>
                
                <div className="text-gray-500 mt-3">// Query Active Focus Timer node</div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">timerMode</span> = <span className="text-green-400">"deep_focus"</span>;
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mt-4">API Methods Expose</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                <li><strong className="text-gray-200">GET /axiom_goals:</strong> Retrieve collection array representing user ambitions.</li>
                <li><strong className="text-gray-200">POST /milestones:</strong> Insert custom tasks and trigger recalculation.</li>
                <li><strong className="text-gray-200">PUT /focus_timer:</strong> Command duration overrides.</li>
              </ul>
            </div>
          ),
        };

      case 'help':
      default:
        return {
          title: 'Axiom Support & Custom Focus Center',
          subtitle: 'Frequently Asked Architectural Solutions',
          icon: HelpCircle,
          color: 'text-emerald-400',
          borderColor: 'border-emerald-500/20',
          bgColor: 'bg-emerald-500/5',
          body: (
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
              <p>
                Welcome to the <strong className="text-[#e0a96d]">Axiom Focus Center</strong>. We design simple, powerful guides to ensure your strategic planning yields absolute peak focus output.
              </p>
              <div className="space-y-3 mt-2">
                <div className="p-3.5 bg-[#051120] border border-[#1a2c42] rounded-xl">
                  <h5 className="font-bold text-white text-[11px] mb-1">How do I reorder tasks & milestones?</h5>
                  <p className="text-gray-400 text-[11px]">
                    Go to the <strong>Planning & Tasks</strong> tab, locate the selected plan's milestones on the right column, and press the handy drag controllers to move them or manage them in your desired queue sequence.
                  </p>
                </div>
                <div className="p-3.5 bg-[#051120] border border-[#1a2c42] rounded-xl">
                  <h5 className="font-bold text-white text-[11px] mb-1">What does the "wali dhismo" notification mean?</h5>
                  <p className="text-gray-400 text-[11px]">
                    It's a welcoming Somali motto designed by <strong>Cuthman Adem Sheikh</strong> expressing gratitude for your presence while celebrating continuous architectural development!
                  </p>
                </div>
                <div className="p-3.5 bg-[#051120] border border-[#1a2c42] rounded-xl">
                  <h5 className="font-bold text-white text-[11px] mb-1">How can I clear all local session storage safely?</h5>
                  <p className="text-gray-400 text-[11px]">
                    Click the logout/signout button in the user profile block at the bottom left of the Sidebar menu. This will trigger a clean wipe of all parameters.
                  </p>
                </div>
              </div>
            </div>
          ),
        };
    }
  };

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <div id="info-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#02070f]/90 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="w-full max-w-xl bg-[#071324] border border-[#142944] rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header Block with Icon */}
        <div className={`p-6 border-b border-[#12243d] ${content.bgColor} flex items-start gap-4`}>
          <div className={`p-2.5 rounded-xl bg-[#051120] border ${content.borderColor} ${content.color}`}>
            <IconComponent size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold font-display text-white leading-tight">{content.title}</h3>
            <p className="text-xs text-gray-400 font-mono font-medium mt-0.5">{content.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#0c1a30] rounded-lg transition-colors cursor-pointer"
            title="Close Spec Dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[55vh] custom-scrollbar">
          {content.body}
        </div>

        {/* Bottom Status Panel */}
        <div className="p-4 bg-[#050f1b] border-t border-[#12243d] flex items-center justify-between">
          <span className="text-[9px] font-mono text-gray-500 tracking-wider">SECURE ENDPOINT ACTIVE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#10243d] hover:bg-[#153052] border border-[#1e3e64] text-[10px] font-bold rounded-lg text-white transition-colors cursor-pointer"
          >
            DISMISS SPECIFICATION
          </button>
        </div>
      </motion.div>
    </div>
  );
}
