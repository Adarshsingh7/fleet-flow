import { Link, SplashScreen, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { auth } from "@/features/auth/auth.service";
import { useReAuth } from "@/features/auth/auth.hook";
import Button from "@/components/Button";
import { useTheme } from "@/context/themeContext";

const LoginScreen = () => {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigation hook
  const navigation = useRouter();

  // Query to check if the user is authenticated
  const { data: activeUser, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: auth.isAuthenticated,
  });

  // Query client for react-query
  const queryClient = new QueryClient();

  // Theme context
  const { theme } = useTheme();

  // Mutation for re-authentication
  const { mutate: reAuth, isPending: reAuthenicating } = useReAuth();

  // Handle login function
  const handleLogin = async () => {
    if (email && password) {
      await auth.login({ email, password });
      reAuth();
    } else {
      Alert.alert("Error", "Please enter both email and password");
    }
  };

  // Effect to navigate to home if user is authenticated
  useEffect(() => {
    if (activeUser) navigation.navigate("/(home)");
    if (!isPending) SplashScreen.hideAsync();
  }, [isPending, reAuthenicating]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Login to your account
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />

        <Button title="Login" onPress={handleLogin} loading={isPending} />

        <Text style={styles.footerText}>
          Don't have an account?
          <Text
            style={styles.link}
            onPress={() => Alert.alert("Signup not allowed, contact to ADMIN`")}
          >
            Sign up
          </Text>
        </Text>
        <Link href="/(home)" style={{ color: theme.text }}>
          go to home
        </Link>
      </View>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#666",
  },
  link: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
