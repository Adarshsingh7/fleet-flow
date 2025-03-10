import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type LogType = "error" | "warning" | "info" | "success";

interface LogEntry {
  timestamp: string;
  message: string;
  type: LogType;
}

export default function TerminalScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Demo logs for showcase
  useEffect(() => {
    const demoLogs = [
      { type: "info", message: "System initialization..." },
      { type: "success", message: "Connected to main server" },
      { type: "warning", message: "Memory usage at 75%" },
      { type: "error", message: "Failed to fetch remote data" },
      { type: "info", message: "Running background tasks" },
      { type: "success", message: "Cache cleared successfully" },
    ];

    demoLogs.forEach((log, index) => {
      setTimeout(() => {
        addLog(log.message, log.type as LogType);
      }, index * 1000);
    });
  }, []);

  const addLog = (message: string, type: LogType) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case "error":
        return { name: "close-circle", color: "#ff4444" };
      case "warning":
        return { name: "alert", color: "#ffbb33" };
      case "success":
        return { name: "check-circle", color: "#00C851" };
      default:
        return { name: "information", color: "#33b5e5" };
    }
  };

  return (
    <View style={styles.terminal}>
      <View style={styles.terminalHeader}>
        <View style={styles.terminalControls}>
          <View
            style={[styles.controlButton, { backgroundColor: "#ff5f56" }]}
          />
          <View
            style={[styles.controlButton, { backgroundColor: "#ffbd2e" }]}
          />
          <View
            style={[styles.controlButton, { backgroundColor: "#27c93f" }]}
          />
        </View>
        <Text style={styles.terminalTitle}>developer_logs.sh</Text>
      </View>

      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <View key={index} style={styles.logEntry}>
            <MaterialCommunityIcons
              size={16}
              color={getLogIcon(log.type).color}
              style={styles.logIcon}
            />
            <Text style={styles.timestamp}>{log.timestamp}</Text>
            <Text style={styles.logText}>{log.message}</Text>
          </View>
        ))}
        <View style={styles.currentLine}>
          <Text style={styles.prompt}>root@dev:~$</Text>
          <Text style={styles.cursor}>{cursorVisible ? "█" : " "}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  terminal: {
    flex: 1,
    backgroundColor: "#000000",
    margin: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  terminalHeader: {
    height: 28,
    backgroundColor: "#2d2d2d",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  terminalControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  terminalTitle: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 20,
  },
  logContainer: {
    flex: 1,
    padding: 10,
  },
  logEntry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logIcon: {
    marginRight: 8,
  },
  timestamp: {
    color: "#666666",
    fontFamily: "monospace",
    fontSize: 12,
    marginRight: 8,
  },
  logText: {
    color: "#00ff00",
    fontFamily: "monospace",
    fontSize: 12,
    flex: 1,
  },
  currentLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  prompt: {
    color: "#00ff00",
    fontFamily: "monospace",
    fontSize: 12,
    marginRight: 8,
  },
  cursor: {
    color: "#00ff00",
    fontFamily: "monospace",
    fontSize: 12,
  },
});
