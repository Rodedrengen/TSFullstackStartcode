import { Router } from "express"
import app from "../app";
const router = Router();
import { ApiError } from "../errors/errors"
import FriendFacade from "../facades/friendFacade"
import { IFriend } from "../interfaces/IFriend";
const debug = require("debug")("friend-routes")

let facade: FriendFacade;

// Initialize facade using the database set on the application object
router.use(async (req, res, next) => {
  if (!facade) {
    const db = req.app.get("db")
    debug("Database used: " + req.app.get("db-type"))
    facade = new FriendFacade(db)
  }
  next()
})

// This does NOT require authentication in order to let new users create themself
router.post('/', async function (req, res, next) {
  try {
    let newFriend = req.body;
    const status = await facade.addFriend(newFriend)
    res.json({ status })
  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      next(err)
    } else {
      next(new ApiError(err.message, 400));
    }
  }
})

// ALL ENDPOINTS BELOW REQUIRES AUTHENTICATION

import authMiddleware from "../middleware/basic-auth"
const USE_AUTHENTICATION = !process.env["SKIP_AUTHENTICATION"];

if (USE_AUTHENTICATION) {
  router.use(authMiddleware);
}

router.get("/all", async (req: any, res) => {
  const friends = await facade.getAllFriends();

  const friendsDTO = friends.map(friend => {
    const { firstName, job, race } = friend
    return { firstName, job, race }
  })
  res.json(friendsDTO);
})

router.delete("/deleteme", async function (req: any, res, next) {
  try {
    if (!USE_AUTHENTICATION) {
      throw new ApiError("This endpoint requires authentication", 500)
    }

    const userName = req.params.userName;
    const status = await facade.deleteFriend(userName)
    
    res.send(status)

  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }})

/**
 * authenticated users can edit himself
 */

router.get("/me", async (req: any, res, next) => {
  try {
    if (!USE_AUTHENTICATION) {
      throw new ApiError("This endpoint requires authentication", 500)
    }
    const userName = req.credentials.userName //GET THE USERS EMAIL FROM SOMEWHERE (req.params OR req.credentials.userName)
    const user: IFriend = await facade.getFrind(userName)

    const { firstName, job, race, level, role } = user;
    const friendDTO = { firstName, job, race, level }

    res.json(friendDTO);

  } catch (err) {
    next(err)
  }
})
router.put('/editme', async function (req: any, res, next) {
  try {
    if (!USE_AUTHENTICATION) {
      throw new ApiError("This endpoint requires authentication", 500)
    }    
    const firstName = req.credentials.userName //GET THE USERS EMAIL FROM SOMEWHERE (req.params OR req.credentials.userName)
    const body = req.body;
    app.get("logger").info(firstName)
    app.get("logger").info(body)
    const friend:IFriend = {firstName: body.firstName, 
                            job: body.job, 
                            level: body.level,
                            race: body.race,
                            password: body.password};

    const count = await facade.editFriend(firstName,friend)
  
    res.send(count)

  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }
})
//These endpoint requires admin rights

//An admin user can fetch everyone
router.get("/find-user/:email", async (req: any, res, next) => {

  try {
    if (USE_AUTHENTICATION && !req.credentials.role || req.credentials.role !== "admin") {
      throw new ApiError("Not Authorized", 401)
    }
    const userId = req.params.email;
    const friend = await facade.getFrind(userId);
    if (friend == null) {
      throw new ApiError("user not found", 404)
    }
    const { firstName, job, race, role } = friend;
    const friendDTO = { firstName, job, race }
    res.json(friendDTO);
  } catch (err) {
    next(err)
  }
})


//An admin user can edit everyone
router.put('/:email', async function (req: any, res, next) {

  try {
    if (USE_AUTHENTICATION && !req.credentials.role || req.credentials.role !== "admin") {
      throw new ApiError("Not Authorized", 401)
    }
    const email = null //GET THE USERS EMAIL FROM SOMEWHERE (req.params OR req.credentials.userName)
    let newFriend = req.body;
    //#####################################
    throw new Error("COMPLETE THIS METHOD")
    //#####################################

  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }
})

export default router
