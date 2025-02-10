interface UserType {
  _id: string; // Unique identifier for the user
  name: string; // Name of the user
  email: string; // Email address of the user
  phone: string; // Phone number of the user
  photo: string; // URL to the user's photo
  route: string | null; // Route assigned to the user, if any
  stop: string | null; // Stop assigned to the user, if any
  role: "student" | "driver" | "admin"; // Role of the user in the system
  password: string; // User's password
  passwordConfirm?: string; // Confirmation of the user's password, optional after validation
  isActive: boolean; // Indicates if the user is active
  passwordResetToken?: string; // Token for resetting the password
  passwordResetExpires?: Date; // Expiration date for the password reset token
  passwordChangedAt?: Date; // Date when the password was last changed

  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>; // Method to check if the provided password matches the user's password
  changedPasswordAfter(JWTTimestamp: number): boolean; // Method to check if the password was changed after a given timestamp
  createPasswordResetToken(): string; // Method to create a password reset token
}

interface StopType {
  _id: string; // Unique identifier for the stop
  name: string; // Name of the stop
  latitude: number; // Latitude coordinate of the stop
  longitude: number; // Longitude coordinate of the stop
  address: string; // Address of the stop
  arrivalTime: string; // Scheduled arrival time at the stop
  arrivalStatus: "arrived" | "waiting"; // Status of arrival at the stop
  user?: string; // User associated with the stop, if any
}

interface RouteType {
  _id: string; // Unique identifier for the route
  routeNumber: number; // Number assigned to the route
  routeName: string; // Name of the route
  stops: string[]; // Array of stop IDs associated with the route
  status: "arrival" | "return"; // Status of the route, either arrival or return
  user?: string; // User associated with the route, if any
}

interface LocationType {
  _id: string; // Unique identifier for the location
  latitude: number; // Latitude coordinate of the location
  longitude: number; // Longitude coordinate of the location
  user: string; // User associated with the location
  address?: string; // Address of the location, optional
  createdAt?: Date; // Date when the location was created, optional
  updatedAt?: Date | null; // Date when the location was last updated, optional and can be null
}

export { UserType, StopType, RouteType, LocationType };

export default {};
