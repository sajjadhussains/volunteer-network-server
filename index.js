const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId  = require('mongodb').ObjectId;


const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


require('dotenv').config()
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo990.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// connect database

const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteerStore").collection("allEvent");
  const volunteerCollection = client.db("volunteerStore").collection("volunteers");
   console.log('database-connected')


   app.post('/events', (req, res)=>{
       const event = req.body;
       console.log(event)
       eventsCollection.insertOne(event)
       .then(result =>{
           if(result.insertedCount > 0){
               res.send(event)
           }
       })
   })

   app.get('/events', (req, res) =>{
       eventsCollection.find({})
       .toArray((err, documents) =>{
           res.send(documents)
       })
   })

   app.get('/user-appointments', (req, res) =>{
       //console.log(req.query.email)
        eventsCollection.fit({'loggedInUser.userEmail': req.query.email})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    app.post('/volunteer', (req, res)=>{
        const event = req.body;
        console.log(event)
        volunteerCollection.insertOne(event)
        .then(result =>{
            if(result.insertedCount > 0){
                res.send(event)
            }
        })
    })

    app.get('/volunteer', (req, res) =>{
        // console.log(req.headers.authorization)
        volunteerCollection.find({email: req.query.email})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    app.post('/deleteEvents', (req, res)=>{
        const id = req.query.id;
        console.log(id)
        volunteerCollection.deleteOne({_id: ObjectId(id)})
        .then(result =>{
            if(result.deletedCount > 0){
                res.send(result)
            }
        
        })
    })

    app.get('/volunteerList', (req, res) =>{
        volunteerCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })


});

app.get('/', (req, res) => {
  res.send('I am working')
})

app.listen(process.env.PORT || port)