import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
import { ApiError } from "./errors/errors"

//TODO: Decide for which one to use below
import friendsRoutes from "./routes/friendRoutesAuth";
import critroleRoutes from "./routes/critroleRoutes"
//import friendsRoutes from "./routes/friendRoutes";
const debug = require("debug")("app")
const Cors = require("cors")
import { Request, Response, NextFunction } from "express"

const app = express()

app.use(express.json())
app.use(Cors())

//WINSTON/MORGAN-LOGGER (Use ONLY one of them)
import logger, { stream } from "./middleware/logger";
const morganFormat = process.env.NODE_ENV == "production" ? "combined" : "dev"
app.use(require("morgan")(morganFormat, { stream }));
app.set("logger", logger) 
//The line above sets the logger as a global key on the application object
//You can now use it from all your middlewares like this req.app.get("logger").log("info","Message")
//Level can be one of the following: error, warn, info, http, verbose, debug, silly
//Level = "error" will go to the error file in production

app.use(express.static(path.join(process.cwd(), "public")))

app.use("/api/friends", friendsRoutes)

app.use("/api/crit", critroleRoutes)

app.get("/demo", (req, res) => {
  logger.info("Hell from demo")
  res.send("Server is up");
})

//Our own default 404-handler for api-requests
app.use("/api", (req: any, res: any, next) => {
  res.status(404).json({ errorCode: 404, msg: "not found - endpoint faliure" })
})

//Makes JSON error-response for ApiErrors, otherwise pass on to default error handleer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof (ApiError)) {
     res.status(err.errorCode).json({ errorCode: err.errorCode, msg: err.message })
  } else {
    next(err)
  }
})

export default app;

