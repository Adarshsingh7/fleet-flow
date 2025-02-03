import { StopType } from "@/app/types";
import axios, { AxiosError, AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
class Stop {
  private api: AxiosInstance | null = null;

  constructor() {
    this.getAllStops = this.getAllStops.bind(this);
    this.getStops = this.getStops.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  private async getApiInstance(): Promise<AxiosInstance> {
    if (!this.api) {
      const token = await this.getToken();
      if (!token) throw new Error("Token is not available");

      this.api = axios.create({
        baseURL: "https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/stop",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return this.api;
  }

  disableStopStatus = async (routeId: string) => {
    try {
      const api = await this.getApiInstance();
      const response = await api.post(`/disable-status?route-id=${routeId}`);
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error(
          `Failed to disable stop status: ${response.statusText}`,
        );
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  getAllStops = async () => {
    const api = await this.getApiInstance();
    const response = await api.get("");
    if (response.status === 200) return response.data.data;
  };

  createStop = async (body: Partial<StopType>) => {
    const api = await this.getApiInstance();
    body._id = undefined;
    const response = await api.post("/", body);
    if (response.status === 200) return response.data.data;
  };

  deleteStop = async (id: string) => {
    const api = await this.getApiInstance();
    const response = await api.delete(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  getStops = async (id: number) => {
    const api = await this.getApiInstance();
    const response = await api.get(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  updateStop = async (id: string, body: Partial<StopType>) => {
    try {
      const api = await this.getApiInstance();
      const response = await api.patch(`/${id}`, body);
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error(`Failed to update stop: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error(error.response?.data);
      throw error;
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

const stop = new Stop();
export { stop };
