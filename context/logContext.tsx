import React, { createContext, useContext, useState, ReactNode } from "react";

type LogType = "error" | "warning" | "info" | "success";

interface LogEntry {
  timestamp?: string;
  message: string;
  type: LogType;
}

interface ContextProps {
  logs: LogEntry[];
  addLog: (val: LogEntry) => void;
  clearLogs: () => void;
}

const MyContext = createContext<ContextProps | undefined>(undefined);

const LogContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = function (newLog: LogEntry) {
    if (!newLog.timestamp) {
      const date = new Date();
      newLog.timestamp = date.toLocaleTimeString();
    }
    setLogs((log) => [...log, newLog]);
  };

  const clearLogs = function () {
    setLogs([]);
  };

  return (
    <MyContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </MyContext.Provider>
  );
};

const useLogs = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useLogs must be used within a LogContextProvider");
  }
  return context;
};

export { LogContextProvider, useLogs };
