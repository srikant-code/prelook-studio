import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Play, Trash2, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { GenerationHistoryEntry } from "../types";
import { GenerationHistoryService } from "../services/appStorage";
import { useNavigate } from "react-router-dom";

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(GenerationHistoryService.getAll());
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this generation from history?")) {
      GenerationHistoryService.delete(id);
      loadHistory();
    }
  };

  const handleResume = (entry: GenerationHistoryEntry) => {
    // Store entry ID in sessionStorage so Studio page can resume
    sessionStorage.setItem("resume_generation_id", entry.id);
    navigate("/studio");
  };

  return (
    <div className="min-h-screen bg-brand-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-brand-900 mb-2">
            Generation History
          </h1>
          <p className="text-brand-600">
            View and resume your previous hairstyle generations
          </p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-brand-200">
            <div className="flex flex-col items-center text-center">
              <HistoryIcon className="w-16 h-16 text-brand-300 mb-4" />
              <h3 className="font-bold text-xl text-brand-900 mb-2 leading-relaxed">
                No generation history yet
              </h3>
              <p className="text-brand-600 mb-6 leading-relaxed">
                Start creating hairstyles to see your history here
              </p>
              <Button variant="primary" onClick={() => navigate("/studio")}>
                Go to Studio
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl overflow-hidden border border-brand-200 hover:shadow-xl transition-all group"
              >
                {/* Image Preview */}
                <div className="relative aspect-square bg-brand-100">
                  {entry.resultImages.front ? (
                    <img
                      src={entry.resultImages.front}
                      alt="Generated hairstyle"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-400">
                      No preview
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-brand-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResume(entry)}
                      className="bg-white text-brand-900 hover:bg-brand-50"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </Button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-brand-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="text-sm text-brand-700 mb-2 line-clamp-2">
                    {entry.prompt}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-500">
                      {entry.config.gender} • {entry.config.style}
                    </span>
                    <span className="font-bold text-brand-900">
                      {entry.creditsUsed} credits
                    </span>
                  </div>

                  {entry.unlockedAngles && (
                    <div className="mt-2 text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                      Multi-angle
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
