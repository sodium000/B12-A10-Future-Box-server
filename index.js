


const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require("cors");
require("dotenv").config();
const port = 3000

app.use(cors())
app.use(express.json())

// mongo connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@chat-application.qhq6ecs.mongodb.net/?appName=chat-application`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


// api create fro allfood
const PlatShearData = client.db('PlatShearData')
const AllFood = PlatShearData.collection("AllFood")

app.post("/allfood",async(req,res)=>{
const newFood = req.body;
const result = await AllFood.insertOne(newFood)
res.send(result)
})

app.get('/food', async (req,res)=>{
  const cursor = AllFood.find();
  const alldata = await cursor.toArray();
  res.send(alldata)
})

app.get('/food/sort', async (req,res)=>{
  const cursor = AllFood.find();
  const alldata = await cursor.toArray();
  alldata.sort((a, b) => Number(b.Food_serve) - Number(a.Food_serve)); // data save string  as a result i do it 
  const limited = alldata.slice(0, 6);
  res.send(limited)
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})