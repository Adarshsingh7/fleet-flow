import { useQuery } from "@tanstack/react-query";
import { location } from "./location.service";
import { LocationType, UserType } from "@/app/types";

// const useGetUpdatedLocation = (body: Partial<LocationType>) => {
//   const { data: user } = useQuery<UserType>({ queryKey: ["user"] });
//   const { role, route, stop } = user!;
//   useQuery({ queryKey: ["location"], queryFn: () => location.getById(route) });
// };
