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

        app.get('/',async(req,res) =>{
            const query ={};
            const cursor = serviceCollections.find(query).limit(3);
            const services= await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async(req,res) =>{
            id=req.params.id;
            const query ={_id: ObjectId(id)};
            const service= await serviceCollections.findOne(query);
            res.send(service)
        })

        // add review
        app.post('/reviews', async(req,res)=>{
            const review =req.body;
            // console.log(review);
            const result =await reviewCollection.insertOne(review);
            res.send(result);
        })

        // add service
        app.post('/services', async(req,res)=>{
            const service =req.body;
            // console.log(service);
            const result =await serviceCollections.insertOne(service);
            res.send(result);
        })

        app.get('/reviews',async(req,res) =>{
            const query ={};
            const cursor = reviewCollection.find(query).sort({ $natural: -1 });
            const review= await cursor.toArray();
            res.send(review);
        });
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