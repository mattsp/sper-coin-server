import * as mongoose from "mongoose"

import { CONFIG } from '../environment'

export default class Database {

    private static _instance: Database;

    private constructor() {
        (<any>mongoose).Promise = global.Promise
        if (Database._instance) throw new Error("Instantiation failed: Use Database.connect() instead of new.")
    }

    static connect() {
        return Database._instance = (!Database._instance)
        ?( mongoose.connect(CONFIG.MONGODB_URI, {useMongoClient: true}, () => {
                console.info('[MongoDB] connection is ready!')
                console.info(CONFIG.MONGODB_URI);
            }), new Database()
         )
        :( console.log('Cannot have multiple Database instances '), Database._instance ) 
    }
}