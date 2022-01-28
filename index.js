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
        const servicesCollection = await database.collection('services');
        const ordersCollection = await database.collection('orders');

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.json(result);
        });

        //order
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        app.post('/orders', async (req, res) => {
            const reviews = req.body;
            const result = await ordersCollection.insertOne(reviews);
            res.json(result);
        });

        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);

            console.log('Deleting user with id: ', result);
            res.json(result);
        });

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Shipped'
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        });

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await servicesCollection.insertOne(services);
            res.json(result);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId }
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
         
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });


        app.get('/teamMember', async (req, res) => {
            const cursor = teamMemberCollection.find({});
            const member = await cursor.toArray();
            res.send(member);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
     
        })

        app.post('/teamMember', async (req, res) => {
            const member = req.body;
            const result = await teamMemberCollection.insertOne(member);
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
        app.get('/teamMember/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId }
            const member = await teamMemberCollection.findOne(query);
            res.json(member);
        })
        app.delete('/teamMember/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await teamMemberCollection.deleteOne(query);
            res.json(result);
        });

        //add admin

        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

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