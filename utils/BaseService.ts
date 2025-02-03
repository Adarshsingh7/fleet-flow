import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosResponse } from "axios";

class BaseService<T> {
  protected api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeAuthorizationHeader();
  }

  // Initialize the Authorization header with the token
  private async initializeAuthorizationHeader(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Ensure the API instance has the Authorization header updated before each call
  private async ensureToken(): Promise<void> {
    const token = await this.getToken();
    if (
      token &&
      this.api.defaults.headers.Authorization !== `Bearer ${token}`
    ) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Fetch all resources
  async getAll(queryParams: Record<string, any> = {}): Promise<T[]> {
    await this.ensureToken(); // Ensure token before making API calls
    const queryString = new URLSearchParams(queryParams).toString();
    const response: AxiosResponse<{ data: T[] }> = await this.api.get(
      `?${queryString}`,
    );
    return response.data.data;
  }

  // Fetch a single resource by ID
  async getById(id: string | number): Promise<T> {
    await this.ensureToken();
    const response: AxiosResponse<{ data: T }> = await this.api.get(`/${id}`);
    return response.data.data;
  }

  // Create a new resource
  async create(data: Partial<T>): Promise<T> {
    await this.ensureToken();
    const response: AxiosResponse<{ data: T }> = await this.api.post("/", data);
    return response.data.data;
  }

  // Update an existing resource by ID
  async update(id: string | number, data: Partial<T>): Promise<T> {
    await this.ensureToken();
    try {
      const response: AxiosResponse<{ data: T }> = await this.api.patch(
        `/${id}`,
        data,
      );
      console.log("data updated success");
      return response.data.data;
    } catch (error) {
      console.error("Error updating resource:", error);
      throw error;
    }
  }

  // Delete a resource by ID
  async delete(id: string | number): Promise<T> {
    await this.ensureToken();
    const response: AxiosResponse<{ data: T }> = await this.api.delete(
      `/${id}`,
    );
    return response.data.data;
  }

  // Get token for authorization
  private async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }
}

export default BaseService;
