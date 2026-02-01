import { useState, useCallback, useEffect } from "react";
import { HistorySession } from "../types";
import { StorageService } from "../services/storage";

export const useHistory = (userEmail: string | null) => {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  useEffect(() => {
    if (userEmail) {
      const savedHistory = StorageService.getHistory(userEmail);
      setHistory(savedHistory);
    }
  }, [userEmail]);

  const saveSession = useCallback(
    (session: HistorySession) => {
      if (userEmail) {
        StorageService.saveHistorySession(userEmail, session);
        setHistory((prev) => {
          const filtered = prev.filter((s) => s.id !== session.id);
          return [session, ...filtered];
        });
        setCurrentSessionId(session.id);
      }
    },
    [userEmail],
  );

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<HistorySession>) => {
      if (userEmail) {
        const session = history.find((s) => s.id === sessionId);
        if (session) {
          const updatedSession = { ...session, ...updates };
          StorageService.saveHistorySession(userEmail, updatedSession);
          setHistory((prev) =>
            prev.map((s) => (s.id === sessionId ? updatedSession : s)),
          );
        }
      }
    },
    [userEmail, history],
  );

  const loadSession = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId);
      return history.find((s) => s.id === sessionId);
    },
    [history],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentSessionId(undefined);
  }, []);

  return {
    history,
    currentSessionId,
    saveSession,
    updateSession,
    loadSession,
    clearHistory,
    setCurrentSessionId,
  };
};
