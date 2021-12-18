const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p0mef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // databae connection
        await client.connect();

        const database = client.db('Project');
        const usersCollection = await database.collection('users');
        const reviewsCollection = await database.collection('reviews');
        const teamMemberCollection = await database.collection('teamMember');
        /*      const ordersCollection = await database.collection('orders'); */

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            console.log(orderInfo)
            const result = await reviewsCollection.insertOne(reviews);
            res.json(result);
        });


        app.get('/teamMember', async (req, res) => {
            const cursor = teamMemberCollection.find({});
            const member = await cursor.toArray();
            res.send(member);
        });

        app.post('/teamMember', async (req, res) => {
            const member = req.body;
            console.log(orderInfo)
            const result = await reviewsCollection.insertOne(member);
            res.json(result);
        });


        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        app.put('/users', async (req, res) => {
            const user = req.body
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(updateDoc);
            res.json(result)
        });


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome ');
});



app.listen(port, () => {
    console.log('Server runnig on: ', port);
});