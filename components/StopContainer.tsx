import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { UserType } from "@/app/types";
import { useChangeStopStatus } from "@/features/stop/stop.hook";
import LoadingScreen from "./LoadingScreen";
import DialogAction from "./DialogAction";
import { useTheme } from "@/context/themeContext";
// import { auth } from "@/features/auth/auth.service";

const TrainStopContainer = ({
  stopName = "Station A",
  arrivalTime = "10:30 AM",
  dispatchTime = "10:40 AM",
  lateStatus = false,
  distance = "5 km",
  status = "waiting",
  id = "0",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: authUser } = useQuery<UserType>({ queryKey: ["user"] });
  const { mutate, isPending } = useChangeStopStatus();

  const handleStatusChange = (newStatus: "arrived" | "waiting") => {
    setModalVisible(false);
    mutate({ id, arrivalStatus: newStatus });
  };
  const { theme } = useTheme();
  const lateColor = lateStatus ? theme.secondary : theme.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            status === "waiting" ? theme.background : theme.success,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.stopName, { color: theme.text }]}>{stopName}</Text>
        <Text style={[styles.lateStatus, { color: "green" }]}>
          {lateStatus ? "Late" : "On Time"}
        </Text>
      </View>
      {isPending && <LoadingScreen />}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Arrival</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {arrivalTime}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Dispatch</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {dispatchTime}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Distance</Text>
          <Text style={[styles.value, { color: theme.text }]}>{distance}</Text>
        </View>
        {authUser?.role === "driver" && (
          <Pressable
            onPress={() => setModalVisible(true)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={styles.bellIcon}>
              <MaterialIcons
                name="change-circle"
                size={24}
                color={theme.primary}
              />
            </Text>
          </Pressable>
        )}
      </View>
      {authUser?.role === "driver" && modalVisible && (
        <DialogAction
          title="Change the status of Stop"
          key={authUser._id}
          message="This is the test message"
          primaryButton={{
            text: "Arrival",
            onPress: () => handleStatusChange("arrived"),
          }}
          secondaryButton={{
            text: "Waiting",
            onPress: () => handleStatusChange("waiting"),
          }}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  coloredContainer: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lateStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailItem: {
    flex: 1,
    marginRight: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 12,
    fontWeight: "600",
  },
  bellIcon: {
    fontSize: 24,
  },
});

export default TrainStopContainer;
