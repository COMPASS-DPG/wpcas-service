import { UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
export const csvFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new UnsupportedMediaTypeException("Only csv files are allowed!"),
      false
    );
  }
  callback(null, true);
};

export const multerOptions: MulterOptions = {
  dest: "src/uploads", // this is the destination of the uploaded files on disk
  limits: {
    fileSize: 1024 * 1024 * 5, // max size 5MB
  },
  fileFilter: csvFileFilter,
  storage: diskStorage({
    destination: "src/uploads",
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${file.originalname}`);
    },
  }),
};
