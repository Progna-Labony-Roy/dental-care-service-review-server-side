const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  https://y-red-phi.vercel.app

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.goxtca6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollections= client.db('service-review-db').collection('serviecs');
        const reviewCollection= client.db('service-review-db').collection('reviews');

        app.get('/services',async(req,res) =>{
            const query ={};
            const cursor = serviceCollections.find(query);
            const services= await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async(req,res) =>{
            id=req.params.id;
            const query ={_id: ObjectId(id)};
            const service= await serviceCollections.findOne(query);
            res.send(service)
        })

        // review
        app.post('/reviews', async(req,res)=>{
            const review =req.body;
            // console.log(review);
            const result =await reviewCollection.insertOne(review);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch( err =>console.err(err));


app.get('/',(req , res)=>{
    res.send("Server is running")
})

app.listen(port ,() =>{
    console.log(`Server running on ${port}`)
})