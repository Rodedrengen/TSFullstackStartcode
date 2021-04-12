import { IFriend } from '../interfaces/IFriend';
import { Db, Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { ApiError } from '../errors/errors';
import Joi, { ValidationError } from "joi"

class CritFacade {
    db: Db
    critCollection: Collection
  
    constructor(db: Db) {
      this.db = db;
      this.critCollection = db.collection("critrole");
    }




    
}
export default CritFacade;