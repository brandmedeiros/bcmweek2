require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("todo_app");
    const collection = db.collection("todos");

    const raw = fs.readFileSync("./todo.json", "utf-8");
    const todos = JSON.parse(raw);

    await collection.deleteMany({});

    
    const result = await collection.insertMany(todos);

    console.log(`Seeded ${result.insertedCount} todos into todo_app.todos`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();