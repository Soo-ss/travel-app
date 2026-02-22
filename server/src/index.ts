import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat";
import travelRouter from "./routes/travel";
import flightRouter from "./routes/flight";
import accommodationRouter from "./routes/accommodation";
import { requestLogger } from "./middleware/requestLogger";
import { logger } from "./utils/logger";

const app = express();
const myPort = process.env.PORT || "3001";

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api/chat", chatRouter);
app.use("/api/travel", travelRouter);
app.use("/api/flight", flightRouter);
app.use("/api/accommodation", accommodationRouter);

app.listen(myPort, () => {
  logger.info("AI Server started", { url: `http://localhost:${myPort}` });
});
