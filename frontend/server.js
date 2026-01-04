const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

app.use(express.static(__dirname));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error calling backend:", err);
    res.status(500).json({ error: "Failed to connect to backend" });
  }
});

app.get("/chats", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

app.get("/chats/:id", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

app.delete("/chats/:id", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats/${req.params.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

app.delete("/chats", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/chats`, {
      method: "DELETE",
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error clearing chats:", err);
    res.status(500).json({ error: "Failed to clear chats" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(8080, () => {
  console.log(" 🤖 NecipGPT running at http://localhost:8080");
  console.log(`Using backend: ${BACKEND_URL}`);
});
