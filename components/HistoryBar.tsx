import React from 'react';
import { HistorySession } from '../types';
import { Download, Clock } from 'lucide-react';

interface HistoryBarProps {
  sessions: HistorySession[];
  onLoadSession: (session: HistorySession) => void;
  currentSessionId: string | undefined;
}

export const HistoryBar: React.FC<HistoryBarProps> = ({ sessions, onLoadSession, currentSessionId }) => {
  if (sessions.length === 0) return null;

  return (
    <div className="fixed right-0 top-20 bottom-0 w-20 hidden md:flex flex-col bg-white border-l border-brand-200 z-30 overflow-y-auto py-4">
        <div className="text-center mb-4">
            <Clock className="w-5 h-5 mx-auto text-brand-400" />
            <span className="text-[10px] font-bold uppercase text-brand-400 mt-1 block">History</span>
        </div>
        
        <div className="flex flex-col gap-4 px-2">
            {sessions.map((session) => (
                <div 
                    key={session.id}
                    onClick={() => onLoadSession(session)}
                    className={`
                        relative w-14 h-14 rounded-xl cursor-pointer transition-all overflow-hidden border-2
                        ${currentSessionId === session.id ? 'border-brand-800 ring-2 ring-brand-100 scale-105' : 'border-transparent hover:border-brand-300 opacity-70 hover:opacity-100'}
                    `}
                    title={session.promptSummary}
                >
                    <img 
                        src={session.resultImages.front || session.originalImage} 
                        alt="History" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            ))}
        </div>
    </div>
  );
};