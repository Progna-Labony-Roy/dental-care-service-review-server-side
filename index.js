const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  https://y-red-phi.vercel.app

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.goxtca6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res ,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({message :'unauthorized access'})
    }
    const token = authHeaderz.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ,function(err , decoded){
        if(err){
            res.status(401).send({message: 'unauthorized access'})
        }
        req.decoded =decoded;
        next();
    })
}

async function run(){
    try{
        const serviceCollections= client.db('service-review-db').collection('serviecs');
        const reviewCollection= client.db('service-review-db').collection('reviews');

        //jwt api
        app.post('/jwt',(req,res) =>{
            const user=req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , { expiresIn :'1d'});
            res.send({token})
        })

        app.get('/services',async(req,res) =>{
            const query ={};
            const cursor = serviceCollections.find(query).sort({ $natural: -1 }).limit(parseInt(req.query.limit) || 3);
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
            const allreview= await cursor.toArray();
            res.send(allreview);
        });

        app.get('/reviews',verifyJWT, async(req,res) =>{
            const decoded = req.decoded;
            if(decoded.email !== req.query.email){
                res.status(403).send({message:'unauthorized access'})
            }
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                } 
            }
            const cursor = reviewCollection.find(query);
            const review= await cursor.toArray();
            res.send(review);
        })

        // delete
        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result =await reviewCollection.deleteOne(query);
            res.send(result)
        })

         
    }
    finally{

    }
}
run().catch( err =>console.error(err));


app.get('/',(req , res)=>{
    res.send("Server is running")
})

app.listen(port ,() =>{
    console.log(`Server running on ${port}`)
})