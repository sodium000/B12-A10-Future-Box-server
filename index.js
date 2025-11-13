


const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require("cors");
require("dotenv").config();
const port = 3000

const admin = require("firebase-admin");

const serviceAccount = require("./platshear-firebase-adminsdk-fbsvc-2e85b07163.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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
const RequestFood = PlatShearData.collection("RequestFood")

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

app.get('/food/myfood', async (req,res)=>{
  const email = req.query.email;
  const query = {};
    if (email) {
    query.Email = email;
  }
  const cursor = AllFood.find(query);
  const alldata = await cursor.toArray();
  res.send(alldata)
})

app.get('/food/request', async (req,res)=>{
  const email = req.query.email;
  const query = {};
    if (email) {
    query.Reqemail = email;
  }
  const cursor = RequestFood.find(query);
  const alldata = await cursor.toArray();
  res.send(alldata)
})

app.get('/food/reqlist/:id', async (req,res)=>{
  const {id} = req.params;
  const query = {};
    if (id) {
    query.foodId = id;
  }
  const cursor = RequestFood.find(query);
  const alldata = await cursor.toArray();
  res.send(alldata)
})

   app.patch("/food/update/:id", async (req, res) => {
      const ID = req.params.id;
      const updateFood = req.body;
      const query = {
        _id: new ObjectId(ID),
      };
      const update = {
        $set: { Food_name: updateFood.Food_name, FoodImag: updateFood.FoodImag , Food_serve : updateFood.Food_serve  },
      };
      const option = {};
      const resuslt = await AllFood.updateOne(query, update, option);
      res.send(resuslt);
    });

   app.patch("/food/requpdate/:id", async (req, res) => {
      const ID = req.params.id;
      const updatestatus = req.body;
      const query = {
        _id: new ObjectId(ID),
      };
      const update = {
        $set: { statues: updatestatus.statues  },
      };
      const option = {};
      const resuslt = await RequestFood.updateOne(query, update, option);
      res.send(resuslt);
    });

       app.delete("/food/:id", async (req, res) => {
      const ID = req.params.id;
      const query = {
        _id: new ObjectId(ID),
      };
      const resuslt = await AllFood.deleteOne(query);
      res.send(resuslt);
    });

app.get('/food/:id', async (req,res)=>{
  const {id}= req.params
  const singleData = await AllFood.findOne({_id : new ObjectId(id)});
  res.send(singleData)
})

app.get('/allfood/sort', async (req,res)=>{
  const cursor = AllFood.find();
  const alldata = await cursor.toArray();
  alldata.sort((a, b) => Number(b.Food_serve) - Number(a.Food_serve)); // data save string  as a result i do it 
  const limited = alldata.slice(0, 6);
  res.send(limited)
}) 

app.post('/api/requests', async (req,res)=>{
      const ReqFood = req.body;
  const result = await RequestFood.insertOne(ReqFood);
  res.send(result)
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})