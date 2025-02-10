import { StopType } from "@/app/types";
import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Stop {
  private api: AxiosInstance | null = null;

  constructor() {
    this.getAllStops = this.getAllStops.bind(this);
    this.getStops = this.getStops.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  /**
   * Get an instance of Axios with the authorization token set in the headers.
   * @returns {Promise<AxiosInstance>} The Axios instance.
   * @throws Will throw an error if the token is not available.
   */
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

  /**
   * Disable the status of a stop by route ID.
   * @param {string} routeId - The ID of the route.
   * @returns {Promise<any>} The response data.
   * @throws Will throw an error if the request fails.
   */
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

  /**
   * Get all stops.
   * @returns {Promise<any>} The response data.
   */
  getAllStops = async () => {
    const api = await this.getApiInstance();
    const response = await api.get("");
    if (response.status === 200) return response.data.data;
  };

  /**
   * Create a new stop.
   * @param {Partial<StopType>} body - The stop data.
   * @returns {Promise<any>} The response data.
   */
  createStop = async (body: Partial<StopType>) => {
    const api = await this.getApiInstance();
    body._id = undefined;
    const response = await api.post("/", body);
    if (response.status === 200) return response.data.data;
  };

  /**
   * Delete a stop by ID.
   * @param {string} id - The ID of the stop.
   * @returns {Promise<any>} The response data.
   */
  deleteStop = async (id: string) => {
    const api = await this.getApiInstance();
    const response = await api.delete(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  /**
   * Get stops by ID.
   * @param {number} id - The ID of the stop.
   * @returns {Promise<any>} The response data.
   */
  getStops = async (id: number) => {
    const api = await this.getApiInstance();
    const response = await api.get(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  /**
   * Update a stop by ID.
   * @param {string} id - The ID of the stop.
   * @param {Partial<StopType>} body - The updated stop data.
   * @returns {Promise<any>} The response data.
   * @throws Will throw an error if the request fails.
   */
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

  /**
   * Get the stored token from AsyncStorage.
   * @returns {Promise<string | null>} The token or null if not found.
   */
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
