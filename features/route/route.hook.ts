import { RouteType, StopType, UserType } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { route } from "./route.service";
import { stop } from "../stop/stop.service";

const useGetUserRoute = function () {
  // Query to get the user data
  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["user"],
  });

  // Query to get the user's route data, only runs after user query completes
  const { data: userRoute, isLoading: routeLoading } = useQuery<RouteType>({
    queryKey: ["route"],
    queryFn: async () => {
      if (user && user.route) {
        return route.getRoutes(user.route);
      }
      return Promise.reject(new Error("User route is not defined"));
    },
    enabled: !!user,
  });

  // Query to get all stops data
  const { data: stops, isLoading: stopLoading } = useQuery<StopType[]>({
    queryKey: ["stops"],
    queryFn: () => stop.getAllStops(),
  });

  // Filter stops based on the user's route stops
  const filteredStop = userRoute?.stops
    ?.map((routeStopId) => stops?.find((stop) => stop._id === routeStopId))
    .filter(Boolean);

  // Determine if any of the queries are still loading
  const isLoading = userLoading || routeLoading || stopLoading;

  return { filteredStop, isLoading };
};

export { useGetUserRoute };
