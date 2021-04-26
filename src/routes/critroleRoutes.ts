import { Router } from "express"
import app from "../app";
const router = Router();
import { ApiError } from "../errors/errors"
import CritFacade from "../facades/critFacade"
const debug = require("debug")("critroleRoutes")

let facade: CritFacade;

router.use(async (req, res, next) => {
  if (!facade) {
    req.app.get("logger").info("facade created")
    const db = req.app.get("db")
    debug("Database used: " + req.app.get("db-type"))
    facade = new CritFacade(db)
  }
  next()
})
router.get("/all", async (req: any, res, next) => {
  const stats = await facade.getAllStats();
  req.app.get("logger").info("crit all")
  res.json(stats);
})

router.get("/episode/:number", async (req: any, res, next) => {
  try {
    const episodeNumber:number = parseInt(req.params.number);
    const stats = await facade.getSpecificEpisode(episodeNumber);

    if (stats.length === 0) {
      throw new ApiError("No episode with that id was found", 400);
    }

    res.json(stats);

  } catch (error) {

    if (error instanceof ApiError) {
      next(error)
    }
    next(new ApiError(error.message + "- not api", 400))

  }
})
router.get("/rolls", async (req: any, res, next) => {
  try {
    const stats = await facade.getCountOfRolls();

    res.json(stats)

  } catch (error) {

    if (error instanceof ApiError) {
      next(error)
    }
    next(new ApiError(error.message, 400))

  }
})

router.get("/", async function (req, res, next) {

  res.send("Crit landing base")
})

export default router;