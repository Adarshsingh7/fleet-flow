import { UserType } from "@/app/types";
import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Auth {
  private api: AxiosInstance;

  constructor() {
    // Initialize Axios instance with base URL and headers
    this.api = axios.create({
      baseURL: "https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/users",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Bind methods to the class instance
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.getToken = this.getToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setAuthHeader = this.setAuthHeader.bind(this);
  }

  // Set the Authorization header with the token
  setAuthHeader = async () => {
    const token = await this.getToken();
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  // Login user and store the token
  login = async (body: { email: string; password: string }) => {
    const response = await this.api.post("/login", body);
    this.setToken(response.data.token);
    return response.data.user;
  };

  // Get all users (assuming this is an admin function)
  getAllUser = async () => {
    const response = await this.api.post("/");
    if (response.status === 200) this.setToken(response.data.token);
    return response.data.user;
  };

  // Signup user and return the user data
  signup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<UserType> => {
    const response = await this.api.post<{ user: UserType }>("/signup", data);
    return response.data.user;
  };

  // Check if the user is authenticated by verifying the token
  isAuthenticated = async () => {
    const token = await this.getToken();
    const currentUser = await this.api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return currentUser.data.user;
  };

  // Logout user by clearing the token
  logout = async () => {
    this.clearToken();
  };

  // Store the token in AsyncStorage
  setToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  // Clear the token from AsyncStorage
  private clearToken = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

  // Retrieve the token from AsyncStorage
  getToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };
}

const auth = new Auth();
export { auth };
