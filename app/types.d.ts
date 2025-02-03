interface UserType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  route: string | null;
  stop: string | null;
  role: "student" | "driver" | "admin";
  password: string;
  passwordConfirm?: string; // Made optional to handle the case after validation
  isActive: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;

  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

interface StopType {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  arrivalTime: string;
  arrivalStatus: "arrived" | "waiting";
  user?: string;
}

interface RouteType {
  _id: string;
  routeNumber: number;
  routeName: string;
  stops: string[]; // Stops are now objects with a 'value' field
  status: "arrival" | "return";
  user?: string;
}

interface LocationType {
  _id: string;
  latitude: number;
  longitude: number;
  user: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export { UserType, StopType, RouteType, LocationType };

export default {};
