import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "./auth.service";
import { useRouter } from "expo-router";

const useLogout = () => {
  const navigation = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // navigation.navigate("/login");
    },
  });
};

const useReAuth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => auth.isAuthenticated(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export { useLogout, useReAuth };
