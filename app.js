require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;


const client = new MongoClient(process.env.MONGO_URI);

let todosCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("todo_app");
    todosCollection = db.collection("todos");


    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map(c => c.name)
    );
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
}


app.use(express.static(__dirname));


app.get("/todo", async (req, res) => {
  try {
    const todos = await todosCollection.find({}).toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to load todos" });
  }
});

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/app", (req, res) => {
  res.sendFile(__dirname + "/todo_fetch.html");
});


app.get("/", (req, res) => res.redirect("/index"));
app.use((req, res) => res.redirect("/index"));


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/index`);
  });
});