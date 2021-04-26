import path from "path"
require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })
import { DbConnector } from "../config/dbConnector"
const debug = require("debug")("setup-friend-testdata")
import { hash } from "bcryptjs"

async function tester() {
  const client = await DbConnector.connect()
  const db = client.db(process.env.DB_NAME)
  
  const friendsCollection = db.collection("friends");
  const hashedPW = await hash("crit", 8);
  friendsCollection.createIndex({ firstName: 1 }, { unique: true })

  await friendsCollection.deleteMany({});

  const status = await friendsCollection.insertMany([
    { firstName: "Vex'halia",job: "Ranger" ,level: 1 ,race:"Half-elf", password: hashedPW, role: "user" },
    { firstName: "Scanlan",job: "Bard",level: 1 , race:"Gnome", password: hashedPW, role: "user" },
    { firstName: "Keyleth",job: "Druid",level: 1 ,race:"Half-elf", password: hashedPW, role: "user" },
    { firstName: "Percy",job: "Fighter",level: 1 ,race:"Human", password: hashedPW, role: "user" },
    { firstName: "Pike",job: "Cleric",level: 1 ,race:"Gnome", password: hashedPW, role: "user" },
    { firstName: "Grog",job: "Barbarian",level: 1 ,race:"Goliath", password: hashedPW, role: "user" },
    { firstName: "Vax'ildan",job: "Rogue",level: 1 ,race:"Half-elf", password: hashedPW, role: "user" },
  ])


  debug(`Inserted ${status.insertedCount} test users`)
  debug(`##################################################`)
  debug(`NEVER, EVER EVER run this on a production database`)
  debug(`##################################################`)
  DbConnector.close();
}

tester();