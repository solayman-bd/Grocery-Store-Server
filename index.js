const express = require("express");
const app = express();
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzyej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("products");
  const usersOrderCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("user-details");
  app.get("/allProductsDetails", (req, res) => {
    productsCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    productsCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
  app.post("/addBuying", (req, res) => {
    const buyingDetails = req.body;
    usersOrderCollection.insertOne(buyingDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/customerInfo", (req, res) => {
    usersOrderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addProducts", (req, res) => {
    const productInfo = req.body;
    console.log("submitted data", productInfo);
    productsCollection.insertOne(productInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", function (req, res) {
  res.send("hello World Yeah");
});

app.listen(process.env.PORT || 5000);
