import 'dotenv/config'

const uri = `${process.env.MONGODB_HOST || '127.0.0.1'}:${process.env.MONGODB_PORT || 27017}/${process.env.MONGODB_NAME || 'todoDB'}`
const dbConnectionString = (!process.env.MONGODB_PASSWORD) ? uri : 
`${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@`+ uri

export const CONFIG = {
    PORT: Number(process.env.PORT) || 4000,
    WS_PORT: Number(process.env.PORT) || 4001,
    JWT_SECRET: process.env.SECRET || 'mysecret',
    MONGODB_URI: `mongodb://${dbConnectionString}`
}