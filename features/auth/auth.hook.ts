import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "./auth.service";
import { useRouter } from "expo-router";

const useLogout = () => {
  const navigation = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    // Function to log out the user
    mutationFn: () => auth.logout(),
    // Invalidate queries on successful logout
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Uncomment the line below to navigate to the login page after logout
      // navigation.navigate("/login");
    },
  });
};

const useReAuth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Function to check if the user is authenticated
    mutationFn: () => auth.isAuthenticated(),
    // Invalidate user query on successful re-authentication
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export { useLogout, useReAuth };
