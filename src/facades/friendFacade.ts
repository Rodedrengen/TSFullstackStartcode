import { IFriend } from '../interfaces/IFriend';
import { Db, Collection, Logger } from "mongodb";
import bcrypt from "bcryptjs";
import { ApiError } from '../errors/errors';
import Joi, { ValidationError } from "joi"
import app from "../app";

const BCRYPT_ROUNDS = 10;

const USER_INPUT_SCHEMA = Joi.object({
  firstName: Joi.string().min(2).max(40).required(),
  job: Joi.string().min(2).max(40).required(),
  race: Joi.string().min(2).max(40).required(),
  level: Joi.number().min(1).max(20).required(),
  password: Joi.string().min(4).max(30).required(),
})
const schema = Joi.number().min(1);

class FriendsFacade {
  db: Db
  friendCollection: Collection

  constructor(db: Db) {
    this.db = db;
    this.friendCollection = db.collection("friends");
  }

  /**
   * 
   * @param friend 
   * @throws ApiError if validation fails
   */
  async addFriend(friend: IFriend): Promise<{ id: String }> {
    const status = USER_INPUT_SCHEMA.validate(friend);
    if (status.error) {
      throw new ApiError(status.error.message, 400)
    }
    const hashedpw = await bcrypt.hash(friend.password, BCRYPT_ROUNDS);
    const f = { ...friend, password: hashedpw }

    //TODO ######################################
    throw new Error("COMPLETE THIS METHOD")
    // #########################################
  }

  /**
   * TODO
   * @param firstName 
   * @param friend 
   * @throws ApiError if validation fails or friend was not found
   */
  async editFriend(firstName: string, friend: IFriend): Promise<{ modifiedCount: number }> {
    const status = USER_INPUT_SCHEMA.validate(friend);
    if (status.error) {
      throw new ApiError(status.error.message, 400)
    }
    const hashedpw = await bcrypt.hash(friend.password, BCRYPT_ROUNDS);
    const f = { ...friend, password: hashedpw }

    const updateStatus = await this.friendCollection.updateOne(
      {"firstName":firstName},
      {$set:{"firstName":friend.firstName, "race": friend.race, "job": friend.job, "level":friend.level}}
      )

    return {modifiedCount : updateStatus.modifiedCount}
  }

  /**
   * 
   * @param friendEmail 
   * @returns true if deleted otherwise false
   */
  async deleteFriend(friendName: string): Promise<boolean> {
    const status = await this.friendCollection.deleteOne({firstName: friendName})
    
    if(status.deletedCount === 0){
      return false
    }
    return true
  }

  async getAllFriends(): Promise<Array<IFriend>> {
    const users: unknown = await this.friendCollection.find({}).toArray();
    return users as Array<IFriend>
  }

  /**
   * 
   * @param friendName 
   * @returns 
   * @throws ApiError if not found
   */
  async getFrind(friendName: string): Promise<IFriend> {

    const user: IFriend = await this.friendCollection.findOne({ firstName: friendName })

    if(user == null){
      throw new ApiError("You're not found")
    }
    
    return user as IFriend
  }

  /**
   * Use this method for authentication
   * @param friendName 
   * @param password 
   * @returns the user if he could be authenticated, otherwise null
   */
  async getVerifiedUser(friendName: string, password: string): Promise<IFriend | null> {
    const friend: IFriend = await this.friendCollection.findOne({ firstName: friendName })
    if (friend && await bcrypt.compare(password, friend.password)) {
      return friend
    }
    return Promise.resolve(null)
  }

}

export default FriendsFacade;

