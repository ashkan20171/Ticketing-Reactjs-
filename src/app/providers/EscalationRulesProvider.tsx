import React from "react";

export type EscalationRules = {
  enabled: boolean;
  checkIntervalMs: number;
  atRiskThresholdPct: number;
  notifyAtRisk: boolean;
  notifyBreach: boolean;
  autoEscalateOnBreach: boolean;
};

const KEY = "ashkan_escalation_rules_v1";

export const defaultEscalationRules: EscalationRules = {
  enabled: true,
  checkIntervalMs: 5000,
  atRiskThresholdPct: 0.15,
  notifyAtRisk: true,
  notifyBreach: true,
  autoEscalateOnBreach: true,
};

type Ctx = {
  rules: EscalationRules;
  setRules: (r: EscalationRules) => void;
  patchRules: (p: Partial<EscalationRules>) => void;
  resetRules: () => void;
};

const EscalationRulesCtx = React.createContext<Ctx | null>(null);

function load(): EscalationRules {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultEscalationRules;
  try {
    const x = JSON.parse(raw) as Partial<EscalationRules>;
    return {
      enabled: typeof x.enabled === "boolean" ? x.enabled : defaultEscalationRules.enabled,
      checkIntervalMs:
        typeof x.checkIntervalMs === "number" && x.checkIntervalMs >= 1000 && x.checkIntervalMs <= 60000
          ? Math.round(x.checkIntervalMs)
          : defaultEscalationRules.checkIntervalMs,
      atRiskThresholdPct:
        typeof x.atRiskThresholdPct === "number" && x.atRiskThresholdPct >= 0.05 && x.atRiskThresholdPct <= 0.5
          ? x.atRiskThresholdPct
          : defaultEscalationRules.atRiskThresholdPct,
      notifyAtRisk: typeof x.notifyAtRisk === "boolean" ? x.notifyAtRisk : defaultEscalationRules.notifyAtRisk,
      notifyBreach: typeof x.notifyBreach === "boolean" ? x.notifyBreach : defaultEscalationRules.notifyBreach,
      autoEscalateOnBreach:
        typeof x.autoEscalateOnBreach === "boolean" ? x.autoEscalateOnBreach : defaultEscalationRules.autoEscalateOnBreach,
    };
  } catch {
    return defaultEscalationRules;
  }
}

function save(r: EscalationRules) {
  localStorage.setItem(KEY, JSON.stringify(r));
}

export function EscalationRulesProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRulesState] = React.useState<EscalationRules>(() => load());

  const setRules = (r: EscalationRules) => {
    setRulesState(r);
    save(r);
  };

  const patchRules = (p: Partial<EscalationRules>) => {
    const next = { ...rules, ...p };
    setRules(next);
  };

  const resetRules = () => setRules(defaultEscalationRules);

  return (
    <EscalationRulesCtx.Provider value={{ rules, setRules, patchRules, resetRules }}>
      {children}
    </EscalationRulesCtx.Provider>
  );
}

export function useEscalationRules() {
  const v = React.useContext(EscalationRulesCtx);
  if (!v) {
    return {
      rules: defaultEscalationRules,
      setRules: (_: EscalationRules) => {},
      patchRules: (_: Partial<EscalationRules>) => {},
      resetRules: () => {},
    };
  }
  return v;
}
