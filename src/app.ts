import CookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { userRoute } from "./modules/auth/signup.route";
const app: Application = express();

app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use("/api/auth/signup/", userRoute);


// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;