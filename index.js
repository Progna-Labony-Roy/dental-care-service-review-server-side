const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//  https://y-red-phi.vercel.app


app.use(cors());
app.use(express.json());


app.get('/',(req , res)=>{
    res.send("Server is running")
})

app.listen(port ,() =>{
    console.log(`Server running on ${port}`)
})