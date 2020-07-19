const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hello-test-123-ac99c.firebaseio.com",
});

const db = admin.firestore();
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.get("/", (req, res) => {
  console.log("hi");
  res.json("hello");
});

app.get("/user", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const data = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const item = doc.data();
      return item;
    })
  );
  res.json({ data });
});
app.post("/user", async (req, res) => {
  const { firstName } = req.body;
  console.log(firstName);
  const data = await db.collection("users").add({
    firstName,
    email: "temm@gmail.com",
  });
  res.json(data);
});

app.get("/create-test", async (req, res) => {
  const data = {
    name: "Los Angeles",
    state: "CA",
    country: "USA",
  };
  db.collection("user-table")
    .add(data)
    .then((re) => {
      res.json(re);
    });
});
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};
app.post("/test", async (req, res) => {
  res.json("hello post test");
});

app.listen(8080);
