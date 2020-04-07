const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;  //MongoDB
require('dotenv').config(); 


const app = express();

app.use(cors());
app.use(bodyParser.json());



//MongoDb User Pass
const uri = process.env.DB_PATH; //MongoDB CLients

let client = new MongoClient(uri, { useNewUrlParser: true }); //MongoDB CLients



const users = ['Asad','Moin','Sabed','Susmita','Shohana','Sabana'];




//.............................GET.............................//

// app.get('/',(req, res) =>{
//     const fruit = {
//         product : 'ada',
//         price : 220 
//     }
//     res.send(fruit);
// })


//
app.get('/products',(req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("myOnlineStore").collection("onlineProduct");
       // collection.find().toArray((err, documents) =>{
        collection.find().limit(10).toArray((err, documents) =>{ 

            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        })
         client.close(); // if not close mongoDb error for load database data...
      });
})



app.get('/fruits/banana',(req, res) =>{
    res.send({fruit:'banana', price: 10000, quantity: 1000})
})

app.get('/users/:id', (req,res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({id,name});
    
})


//.............................POST.............................//
app.post('/addProduct',(req, res) =>{
    //save to database
    client = new MongoClient(uri, { useNewUrlParser: true });
    const product = req.body;
    client.connect(err => {
        const collection = client.db("myOnlineStore").collection("onlineProduct");
        collection.insertOne(product,(err, result) =>{
            console.log('Successfully Inserted..',result);
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        })
        client.close();
      });
})


const port = process.env.PORT ||4200;
app.listen(port,() => console.log('Listening to port 4200'));