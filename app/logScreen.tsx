import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogs } from "@/context/logContext";

type LogType = "error" | "warning" | "info" | "success";

export default function TerminalScreen() {
  const [cursorVisible, setCursorVisible] = useState(true);
  const { logs } = useLogs();

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: LogType) => {
    switch (type) {
      case "error":
        return "#ff4444";
      case "warning":
        return "#ffbb33";
      case "success":
        return "#00C851";
      default:
        return "#33b5e5";
    }
  };

  const getLogIcon = (
    type: LogType,
  ): {
    name:
      | "close-circle-outline"
      | "alert-outline"
      | "check-circle-outline"
      | "information-outline";
    color: string;
  } => {
    switch (type) {
      case "error":
        return { name: "close-circle-outline", color: "#ff4444" };
      case "warning":
        return { name: "alert-outline", color: "#ffbb33" };
      case "success":
        return { name: "check-circle-outline", color: "#00C851" };
      default:
        return { name: "information-outline", color: "#33b5e5" };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.terminal}>
        <ScrollView style={styles.logContainer}>
          {logs.map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <MaterialCommunityIcons
                name={getLogIcon(log.type).name}
                size={16}
                color={getLogIcon(log.type).color}
                style={styles.logIcon}
              />
              <Text style={styles.timestamp}>{log.timestamp}</Text>
              <Text style={[styles.logText, { color: getLogColor(log.type) }]}>
                {log.message}
              </Text>
            </View>
          ))}
          <View style={styles.currentLine}>
            <Text style={styles.prompt}>┌──(adarsh㉿kali)-[~]</Text>
            <Text style={styles.cursor}>{cursorVisible ? "█" : " "}</Text>
          </View>
        </ScrollView>
      </View>
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
    paddingBottom: 10,
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
