import { LocationType } from "@/app/types";
import BaseService from "@/utils/BaseService";
import axios from "axios";

class LocationService extends BaseService<LocationType> {
  constructor() {
    super("https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/location");
  }
  getAllLocations = this.getAll.bind(this);
  createLocation = (body: Partial<LocationType>) => {
    body._id = undefined;
    return this.create(body);
  };
  updateLocation = this.update.bind(this);
  getLocation = this.getById.bind(this);
  deleteLocation = this.delete.bind(this);
  getLocationFromRoute = async (route: string) => {
    const { data } = await this.api.get(`/getLocation/?route=${route}`);
    return data.data;
  };
}

const location = new LocationService();
export { location };
