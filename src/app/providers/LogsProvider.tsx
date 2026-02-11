import { createContext, useContext, useMemo, useState } from "react";
import { AuditLog, LogLevel } from "../../features/logs/model/log";

type Ctx = {
  logs: AuditLog[];
  addLog: (l: { level?: LogLevel; action: string; message: string; actorEmail?: string }) => void;
  clear: () => void;
};

const KEY = "ashkan_logs_v1";
const LogsCtx = createContext<Ctx | null>(null);

function loadLogs(): AuditLog[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as AuditLog[]; } catch { return []; }
}

function saveLogs(items: AuditLog[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 500))); // cap
}

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<AuditLog[]>(() => loadLogs());

  const api = useMemo<Ctx>(() => ({
    logs,
    addLog: (l) => {
      const item: AuditLog = {
        id: `lg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        level: l.level ?? "info",
        action: l.action,
        message: l.message,
        actorEmail: l.actorEmail,
        createdAt: new Date().toISOString(),
      };
      setLogs((p) => {
        const next = [item, ...p];
        saveLogs(next);
        return next;
      });
    },
    clear: () => {
      setLogs([]);
      saveLogs([]);
    },
  }), [logs]);

  return <LogsCtx.Provider value={api}>{children}</LogsCtx.Provider>;
}

export function useLogs() {
  const v = useContext(LogsCtx);
  if (!v) throw new Error("useLogs must be used inside LogsProvider");
  return v;
}
