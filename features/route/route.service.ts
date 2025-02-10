import { RouteType } from "@/app/types";
import BaseService from "@/utils/BaseService";

class RouteService extends BaseService<RouteType> {
  constructor() {
    // Initialize the base service with the API endpoint for routes
    super("https://sea-turtle-app-uixi3.ondigitalocean.app/api/v1/routes");
  }

  // Method to get all routes, bound to the context of the instance
  getAllRoutes = this.getAll.bind(this);

  // Method to create a new route, ensuring the _id is undefined before creation
  createRoute = (body: Partial<RouteType>) => {
    body._id = undefined;
    return this.create(body);
  };

  // Method to update an existing route, bound to the context of the instance
  updateRoute = this.update.bind(this);

  // Method to get a route by its ID, bound to the context of the instance
  getRoutes = this.getById.bind(this);

  // Method to delete a route, bound to the context of the instance
  deleteRoutes = this.delete.bind(this);
}

// Create an instance of RouteService and export it
const route = new RouteService();
export { route };
