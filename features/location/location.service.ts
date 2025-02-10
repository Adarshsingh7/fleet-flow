import { LocationType } from "@/app/types";
import BaseService from "@/utils/BaseService";
import axios from "axios";

class LocationService extends BaseService<LocationType> {
  constructor() {
    // Initialize the base service with the API endpoint for locations
    super("https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/location");
  }

  // Method to get all locations
  getAllLocations = this.getAll.bind(this);

  // Method to create a new location
  createLocation = (body: Partial<LocationType>) => {
    body._id = undefined; // Ensure the _id is undefined before creating a new location
    return this.create(body);
  };

  // Method to update an existing location
  updateLocation = this.update.bind(this);

  // Method to get a location by its ID
  getLocation = this.getById.bind(this);

  // Method to delete a location by its ID
  deleteLocation = this.delete.bind(this);

  // Method to get a location based on a route string
  getLocationFromRoute = async (route: string) => {
    const { data } = await this.api.get(`/getLocation/?route=${route}`);
    return data.data;
  };
}

// Create an instance of LocationService and export it
const location = new LocationService();
export { location };
