import { Db, Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { ApiError } from '../errors/errors';
import { IStats } from '../interfaces/IStats';
import Joi, { ValidationError } from "joi"
const debug = require("debug")("app")

const schema = Joi.number().min(1);

class CritFacade {
  db: Db
  critCollection: Collection

  constructor(db: Db) {
    this.db = db;
    this.critCollection = db.collection("critrole");
  }

  async getAllStats(): Promise<Array<IStats>> {
    const stats: unknown = await this.critCollection.find({}).limit(100).toArray();
    return stats as Array<IStats>
  }
  async getSpecificEpisode(episodeNumber: number): Promise<Array<IStats>> {
    const status = schema.validate(episodeNumber)

    if (status.error) {
      throw new ApiError("Not a number", 400)
    }

    const stats: unknown = await this.critCollection.find({ episode: episodeNumber }).toArray();

    return stats as Array<IStats>
  }
  async getCountOfRolls(): Promise<Array<number>> {

    const stats: unknown = await this.critCollection.aggregate([
      {
        $group: {
          "_id": "$episode"
          
          ,count: {
            $sum: 1
          }
        }
      }
    ]).sort({"_id" : 1}).toArray()


    return stats as Array<number>;
  }
}
export default CritFacade;