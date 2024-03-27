import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class TarentoService {
  private fracApiUrl = process.env.FRAC_SERVICE_URL;
  private userApiUrl = process.env.USER_SERVICE_URL;

  async getUser(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.userApiUrl}`, {
        params: {
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch FRAC data from the Tarento's API");
    }
  }

  async getFracData(): Promise<any> {
    try {
      const response = await axios.get(`${this.fracApiUrl}`, {
        params: {},
      });
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch FRAC data from the Tarento's API");
    }
  }

  async formatFracData(): Promise<any> {
    try {
      
    } catch (error) {
      throw new Error(error)
    }
  }
}
