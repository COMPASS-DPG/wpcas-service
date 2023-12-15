import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import csvParser = require("csv-parser");

@Injectable()
export class FileUploadService {
  public async parseCSV(filePath: string): Promise<any[]> {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", () => {
          resolve(results);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  public async deleteUploadedFile(filePath: string): Promise<void> {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new Error("Error unlinking the file.");
    }
  }
}
