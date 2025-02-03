import { UserType } from "@/app/types";
import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Auth {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/users",
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.getToken = this.getToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setAuthHeader = this.setAuthHeader.bind(this);
  }

  setAuthHeader = async () => {
    const token = await this.getToken();
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  login = async (body: { email: string; password: string }) => {
    const response = await this.api.post("/login", body);
    this.setToken(response.data.token);
    return response.data.user;
  };

  getAllUser = async () => {
    const response = await this.api.post("/");
    if (response.status === 200) this.setToken(response.data.token);
    return response.data.user;
  };

  signup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<UserType> => {
    const response = await this.api.post<{ user: UserType }>("/signup", data);
    return response.data.user;
  };

  isAuthenticated = async () => {
    const token = await this.getToken();
    const currentUser = await this.api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return currentUser.data.user;
  };

  logout = async () => {
    this.clearToken();
  };

  setToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  private clearToken = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

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
