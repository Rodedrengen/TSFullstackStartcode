import path from "path"
import { DbConnector } from "../config/dbConnector"
const debug = require("debug")("setup-friend-testdata")
const csv = require('csv-parser');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })

let arr:episodeData[] = []

async function readFile() {
    fs.createReadStream('critrole.csv')
        .pipe(csv())
        .on('data', (row: any) => {
    
            let ep = new episodeData(row.Episode,
                                    row.Time,
                                    row.Character,
                                    row.Type,
                                    row.Total,
                                    row.Natural,
                                    row.Crit,
                                    row.Damage,
                                    row.Kills,
                                    row.Notes) 
            arr.push(ep)
        })
        .on('end', () => {
            toDb(arr)
            console.log('CSV file successfully processed');
        });
}

async function toDb(data: episodeData[]) {
    const client = await DbConnector.connect()
    const db = client.db(process.env.DB_NAME)

    const critCollection = db.collection("critrole");

    const status = await critCollection.insertMany(data)

    debug(`Inserted ${status.insertedCount} test users`)
    debug(`##################################################`)
    debug(`NEVER, EVER EVER run this on a production database`)
    debug(`##################################################`)
    DbConnector.close();
}
class episodeData{

    episode: string;
    time: string;
    character: string; 
    type: string;
    total: number;
    natural: number;
    crit: string;
    damage: number;
    kills: string;
    notes: string;

    constructor(Episode: string,Time: string,Character: string,Type: string,Total: number,Natural: number,Crit: string,Damage: number,Kills: string,Notes: string){
        this.episode = Episode
        this.time = Time
        this.character = Character
        this.type = Type
        this.total = Total
        this.natural = Natural
        this.crit = Crit
        this.damage = Damage
        this.kills = Kills
        this.notes = Notes
    }
}
readFile();