import { Injectable } from "@nestjs/common";
import axios from "axios";
import { AddFeedbackDto } from "./dto";

@Injectable()
export class PassbookService {
  private apiUrl = "http://172.17.0.2:3000/api";

  async getUser(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/user`, {
        params: {
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch data from the external API");
    }
  }

  async createUser(userId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/user`, {
        data: {
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch data from the external API");
    }
  }

  async addFeedback(feedback: AddFeedbackDto): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/user/feedback`, {
        data: {
          ...feedback
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error(`Failed to add feedback for user with id #${feedback.userId}`);
    }
  }
}
