import { MongoClient, MongoClientOptions } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options as MongoClientOptions)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {

  client = new MongoClient(uri, options as MongoClientOptions)
  clientPromise = client.connect()
}

export default clientPromise