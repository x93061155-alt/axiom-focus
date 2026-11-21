import React, { useEffect } from 'react';
import { X, Shield, FileText, Server, HelpCircle, Terminal, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export type InfoModalType = 'storage' | 'terms' | 'security' | 'api' | 'help';

interface InfoModalProps {
  isOpen: boolean;
  type: InfoModalType | null;
  onClose: () => void;
}

export default function InfoModal({ isOpen, type, onClose }: InfoModalProps) {
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
          title: 'Storage Protocol Specification',
          subtitle: 'Persistent Local-First & Cloud Schema Definition',
          icon: Server,
          color: 'text-[#A67C00]',
          borderColor: 'border-[#D4AF37]/50',
          bgColor: 'bg-[#FFFDF5]',
          body: (
            <div className="space-y-4 text-sm text-[#666666] leading-relaxed font-sans">
              <p>
                The <strong className="text-[#A67C00]">Axiom Focus System</strong> operates on a strict data integrity architecture. All personal metrics, goals, scheduled tasks, and focus configuration structures are synchronized cleanly.
              </p>
              <div className="axiom-inset rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="text-[#666666] flex justify-between">
                  <span>Protocol Schema</span>
                  <span className="text-[#A67C00] font-semibold">v1.4.0</span>
                </div>
                <div className="text-[#A67C00] font-semibold">KEY: axiom_goals</div>
                <div className="text-[#666666]">
                  Holds collection array of goals, status nodes, completed timestamps, and localized Pomodoro counts.
                </div>
                <div className="text-[#A67C00] font-semibold mt-2">KEY: axiom_profile</div>
                <div className="text-[#666666]">
                  Stores user identity payload, avatar mapping reference, and micro-interruption filters.
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#171717] mt-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-[#A67C00]" />
                Data Integrity Guarantees
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#666666]">
                <li><strong className="text-[#171717]">Zero Cloud Leakage:</strong> No telemetry data, task details, or personal names are broadcast to external third-party trackers.</li>
                <li><strong className="text-[#171717]">Rehydration Engine:</strong> Application auto-discovers previous focus state values instantly on container launch.</li>
                <li><strong className="text-[#171717]">Flush Protocol:</strong> Direct profile reset triggers a comprehensive session clearance safely.</li>
              </ul>
            </div>
          ),
        };

      case 'terms':
        return {
          title: 'Terms of Architectural Agreement',
          subtitle: 'Usage Specifications & Focus Guidelines',
          icon: FileText,
          color: 'text-[#A67C00]',
          borderColor: 'border-[#D4AF37]/50',
          bgColor: 'bg-[#FFFDF5]',
          body: (
            <div className="space-y-4 text-sm text-[#666666] leading-relaxed font-sans">
              <p>
                By interacting with <strong className="text-[#A67C00]">Axiom Focus</strong>, you enter a covenant of deliberate focus and architectural clarity. You agree to minimize visual and secondary notification noise to maintain a high-performance flow state.
              </p>
              <div className="axiom-inset p-4 rounded-xl border border-[#D4AF37]/40">
                <p className="text-[#A67C00] italic text-center font-display font-semibold">
                  "wali dhismo ayaa ku socda wepsite kaan, mahadsanid sida quruxda badan aad uso boqatey wepkayga"
                </p>
                <span className="text-[11px] text-[#666666] text-center block mt-1.5">
                  Axiom Visual Covenant · Cuthman Adem Sheikh
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#171717] mt-4">Core Conditions</h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-[#666666]">
                <li>
                  <strong className="text-[#171717]">Personal Commitment:</strong> Define clear strategic objectives and break them into specific, actionable milestone nodes.
                </li>
                <li>
                  <strong className="text-[#171717]">Pomodoro Dedication:</strong> Focus timers represent absolute execution blocks. Multi-tasking during active timer counts is discouraged.
                </li>
                <li>
                  <strong className="text-[#171717]">No Liability:</strong> The creator, Cuthman Adem Sheikh, makes no guarantees of sudden peak-performance transformation without genuine cognitive participation from the user.
                </li>
              </ol>
            </div>
          ),
        };

      case 'security':
        return {
          title: 'Sandbox Security Protocols',
          subtitle: 'Cryptographic Boundaries & Session Isolation',
          icon: Shield,
          color: 'text-[#A67C00]',
          borderColor: 'border-[#D4AF37]/50',
          bgColor: 'bg-[#FFFDF5]',
          body: (
            <div className="space-y-4 text-sm text-[#666666] leading-relaxed font-sans">
              <p>
                Axiom is engineered with robust client-side containerization. Security policies enforce strict constraints to safeguard your roadmap and personal workspace.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3.5 axiom-inset rounded-xl">
                  <div className="text-[#A67C00] font-semibold mb-1 text-xs">XSS Protection</div>
                  <p className="text-[#666666] text-xs">
                    Strict input sanitization layers ensure custom milestone titles prevent script injections.
                  </p>
                </div>
                <div className="p-3.5 axiom-inset rounded-xl">
                  <div className="text-[#A67C00] font-semibold mb-1 text-xs">Iframe Isolation</div>
                  <p className="text-[#666666] text-xs">
                    Strict frame sandbox constraints shield session state from external frame querying.
                  </p>
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#171717] mt-4">Offline-First Trust Profile</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#666666]">
                <li>All random keys generated for milestone mapping IDs use standard browser entropy generators.</li>
                <li>Zero non-verified third-party tracking scripts are permitted into the runtime stack.</li>
                <li>Local guest persistence stays isolated inside your browser sandbox.</li>
              </ul>
            </div>
          ),
        };

      case 'api':
        return {
          title: 'Developer Integration Hooks',
          subtitle: 'Console Queries & State Interfaces',
          icon: Terminal,
          color: 'text-[#A67C00]',
          borderColor: 'border-[#D4AF37]/50',
          bgColor: 'bg-[#FFFDF5]',
          body: (
            <div className="space-y-4 text-sm text-[#666666] leading-relaxed font-sans">
              <p>
                The Axiom State Engine can be inspected programmatically via browser developer tools to review or export your local milestone data.
              </p>
              <div className="axiom-inset rounded-xl p-4 font-mono text-xs space-y-2 text-[#666666]">
                <div className="text-[#666666]/80">// Fetch current goals collection</div>
                <div>
                  <span className="text-[#A67C00] font-semibold">const</span> <span className="text-[#171717] font-semibold">goals</span> = <span className="text-[#A67C00] font-semibold">JSON</span>.<span className="text-emerald-700">parse</span>(<span className="text-[#171717]">localStorage</span>.<span className="text-emerald-700">getItem</span>(<span className="text-emerald-700">'axiom_goals'</span>));
                </div>
                <div>
                  <span className="text-[#A67C00] font-semibold">console</span>.<span className="text-emerald-700">log</span>(<span className="text-[#171717]">goals</span>);
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#171717] mt-4">Exposed State Keys</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#666666]">
                <li><strong className="text-[#171717]">axiom_goals:</strong> Collection array representing strategic objectives and tasks.</li>
                <li><strong className="text-[#171717]">axiom_profile:</strong> Identity configuration and reminder preferences.</li>
                <li><strong className="text-[#171717]">axiom_deep_work_state:</strong> Active Pomodoro timer state and session totals.</li>
              </ul>
            </div>
          ),
        };

      case 'help':
      default:
        return {
          title: 'Axiom Support & Focus Center',
          subtitle: 'Frequently Asked Workflow Questions',
          icon: HelpCircle,
          color: 'text-[#A67C00]',
          borderColor: 'border-[#D4AF37]/50',
          bgColor: 'bg-[#FFFDF5]',
          body: (
            <div className="space-y-4 text-sm text-[#666666] leading-relaxed font-sans">
              <p>
                Welcome to the <strong className="text-[#A67C00]">Axiom Focus Center</strong>. Here are quick answers to help you get the most out of your workspace.
              </p>
              <div className="space-y-3 mt-2">
                <div className="p-4 axiom-inset rounded-xl">
                  <h5 className="font-semibold text-[#171717] text-xs mb-1">How do I reorder tasks & milestones?</h5>
                  <p className="text-[#666666] text-xs leading-relaxed">
                    Go to the <strong>Planning & Tasks</strong> tab, select your active plan, and use the drag handle beside each milestone to reorder your queue.
                  </p>
                </div>
                <div className="p-4 axiom-inset rounded-xl">
                  <h5 className="font-semibold text-[#171717] text-xs mb-1">What does the "wali dhismo" notification mean?</h5>
                  <p className="text-[#666666] text-xs leading-relaxed">
                    It is a welcoming Somali motto by <strong>Cuthman Adem Sheikh</strong> expressing gratitude for your visit while celebrating continuous development.
                  </p>
                </div>
                <div className="p-4 axiom-inset rounded-xl">
                  <h5 className="font-semibold text-[#171717] text-xs mb-1">How can I clear local session storage safely?</h5>
                  <p className="text-[#666666] text-xs leading-relaxed">
                    Click the sign-out button in the user profile card at the bottom left of the Sidebar menu to safely reset your local session.
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#171717]/30 backdrop-blur-md cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl axiom-modal-panel rounded-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className={`p-6 border-b border-[#F7E7B0] ${content.bgColor} flex items-start gap-4`}>
          <div className={`p-2.5 rounded-xl bg-[#FFFFFF] border ${content.borderColor} ${content.color} shadow-sm`}>
            <IconComponent size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold font-display text-[#171717] leading-tight">{content.title}</h3>
            <p className="text-xs text-[#666666] mt-0.5">{content.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#666666] hover:text-[#171717] hover:bg-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
            title="Close Specification"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 max-h-[58vh]">
          {content.body}
        </div>

        <div className="p-4 bg-[#FAFAFA]/95 border-t border-[#F7E7B0] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 axiom-btn-secondary text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
