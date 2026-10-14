import React, { useState, useRef, useEffect } from 'react';
import { EarthAnalogSite, TargetPlanet, ChatMessage } from '../types';
import { askGeminiSurfaceAnalytics } from '../services/geminiService';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlanet: TargetPlanet;
  activeSiteContext?: EarthAnalogSite | null;
  onClearSiteContext?: () => void;
  allSites: EarthAnalogSite[];
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  targetPlanet,
  activeSiteContext,
  onClearSiteContext,
  allSites,
}) => {
  const [selectedSite, setSelectedSite] = useState<EarthAnalogSite | null>(activeSiteContext || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync activeSiteContext when passed from outside
  useEffect(() => {
    if (activeSiteContext) {
      setSelectedSite(activeSiteContext);
    }
  }, [activeSiteContext]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'msg-welcome',
        sender: 'gemini',
        text: `**GEMINI SURFACE ANALYTICS ONLINE**  
Target Destination: **${targetPlanet}**  
NASA Space Apps Telemetry Protocol Active.

Ask any question regarding Earth terrestrial analogs, or select a specific site to analyze planetary environmental parity and simulate **Astronaut Hazards & EVA Challenges**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcome]);
    }
  }, [targetPlanet]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await askGeminiSurfaceAnalytics(text, targetPlanet, selectedSite || undefined);

      const geminiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'gemini',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, geminiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'gemini',
        text: '⚠️ Communication signal interference detected. Re-calibrating surface telemetry...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'gemini',
        text: `**SESSION RESET**  
Surface Analytics ready. Operating against **${targetPlanet}** standard baseline.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick prompt suggestions
  const quickPrompts = targetPlanet === 'Mars'
    ? [
        'Why is the Atacama Desert the top Mars analog for rover drills?',
        'Simulate astronaut challenges at McMurdo Dry Valleys',
        'Compare Lake Salda microbialites with Jezero Crater',
        'What EVA hazards exist in Mauna Loa basaltic lava fields?',
      ]
    : [
        'Why is Haughton Crater the premier lunar analog?',
        'Simulate astronaut radiation and hazards in Lanzarote lava tubes',
        'What did Apollo astronauts learn training at Craters of the Moon?',
        'Analyze Askja Caldera regolith texture vs Lunar Highlands',
      ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 flex flex-col ${
        isExpanded
          ? 'w-[95vw] md:w-[780px] h-[85vh]'
          : 'w-[95vw] sm:w-[460px] h-[600px] max-h-[85vh]'
      } bg-[#070b16] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden backdrop-blur-xl animate-fade-in`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#050811] border-b border-cyan-900/60">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold font-['Chakra_Petch'] text-white tracking-wide">
                Gemini Surface Analytics
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-semibold">
                AI MISSION INTEL
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Target: {targetPlanet} Baseline Active</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition"
            title="Reset telemetry chat session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition hidden sm:block"
            title={isExpanded ? 'Compress window' : 'Expand window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition"
            title="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Site Selector Bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 w-full">
          <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Focus Analog:</span>
          <select
            value={selectedSite?.id || ''}
            onChange={(e) => {
              const val = e.target.value;
              const found = allSites.find((s) => s.id === val);
              setSelectedSite(found || null);
            }}
            className="bg-[#0c1222] border border-cyan-900/60 rounded px-2 py-1 text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 w-full truncate"
          >
            <option value="">-- All Terrestrial Analogs --</option>
            {allSites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.matchRating.toFixed(1)}%)
              </option>
            ))}
          </select>
          {selectedSite && (
            <button
              onClick={() => {
                setSelectedSite(null);
                onClearSiteContext?.();
              }}
              className="text-[10px] text-slate-400 hover:text-red-300 font-mono underline shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs sm:text-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
                <span>{isUser ? 'MISSION OPERATOR' : 'GEMINI ANALYTICS'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl ${
                  isUser
                    ? 'bg-cyan-600 text-black font-medium rounded-tr-none shadow-md shadow-cyan-600/20'
                    : 'bg-[#0f172a]/90 text-slate-100 border border-cyan-900/40 rounded-tl-none leading-relaxed'
                }`}
              >
                {/* Parse Markdown-like sections */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    // Highlight risk titles or markdown headers
                    if (paragraph.startsWith('###') || paragraph.startsWith('####')) {
                      return (
                        <h4
                          key={pIdx}
                          className="font-['Chakra_Petch'] font-bold text-cyan-300 text-sm tracking-wide mt-2 first:mt-0 border-b border-cyan-900/40 pb-1"
                        >
                          {paragraph.replace(/#+\s*/, '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('- 🚨')) {
                      return (
                        <div
                          key={pIdx}
                          className="p-2 rounded bg-red-950/40 border border-red-900/50 text-red-200 text-xs font-mono my-1"
                        >
                          {paragraph}
                        </div>
                      );
                    }
                    return <p key={pIdx}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono p-3 bg-cyan-950/30 border border-cyan-900/40 rounded-xl w-fit animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Simulating planetary analog telemetry & astronaut risk models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-[#050811]/90 border-t border-slate-800/80">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Suggested Mission Queries:
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-slate-900/90 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 px-2.5 py-1 rounded-md transition font-mono shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-[#050811] border-t border-cyan-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedSite
                ? `Ask about ${selectedSite.name} environmental parity...`
                : 'Ask Gemini about any Earth analog or astronaut challenge...'
            }
            className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition font-sans"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-semibold transition active:scale-95 shadow-md shadow-cyan-500/25"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
