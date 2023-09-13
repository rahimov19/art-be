import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import createHttpError from "http-errors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHAndler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import usersRouter from "./api/users/index.js";
import resumeRouter from "./api/resume/index.js";
import newsRouter from "./api/news/index.js";
import partnersRouter from "./api/partners/index.js";

const server = express();
const port = process.env.PORT || 3001;

//Adding cors options
const whitelist = [process.env.FE_URL, process.env.FE_URL_PROD];

const corsOpts = {
  origin: (origin, corsNext) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, "Current Origin is not in whitelist"));
    }
  },
};
server.use(cors());
server.use(express.json());

//Adding enpoints routers

server.use("/users", usersRouter);
server.use("/resume", resumeRouter);
server.use("/news", newsRouter);
server.use("/partners", partnersRouter);

//Adding error handlers
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHAndler);

//Connecting to mongoDB
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
