import { RouteType, StopType, UserType } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { route } from "./route.service";
import { stop } from "../stop/stop.service";

const useGetUserRoute = function () {
  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["user"],
  });
  const { data: userRoute, isLoading: routeLoading } = useQuery<RouteType>({
    queryKey: ["route"],
    queryFn: async () => {
      if (user && user.route) {
        return route.getRoutes(user.route);
      }
      return Promise.reject(new Error("User route is not defined"));
    },
    enabled: !!user, // Only run after user query completes
  });
  const { data: stops, isLoading: stopLoading } = useQuery<StopType[]>({
    queryKey: ["stops"],
    queryFn: () => stop.getAllStops(),
  });

  const filteredStop = userRoute?.stops
    ?.map((routeStopId) => stops?.find((stop) => stop._id === routeStopId))
    .filter(Boolean);

  const isLoading = userLoading || routeLoading || stopLoading;

  return { filteredStop, isLoading };
};

export { useGetUserRoute };
