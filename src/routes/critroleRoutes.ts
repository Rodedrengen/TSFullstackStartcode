import { Router } from "express"
const router = Router();
import { ApiError } from "../errors/errors"
import CritFacade from "../facades/critFacade"
const debug = require("debug")("friend-critroleRoutes")

let facade: CritFacade;

router.use(async (req, res, next) => {
    if (!facade) {
      const db = req.app.get("db")
      debug("Database used: " + req.app.get("db-type"))
      facade = new CritFacade(db)
    }
    next()
  })