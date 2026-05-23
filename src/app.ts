import CookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
} from "express";

import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { signupRoute } from "./modules/auth/signup.route";
import { loginRoute } from "./modules/auth/login.route";
import { issueRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(CookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api/issues", issueRoute);

app.use(globalErrorHandler);

export default app;