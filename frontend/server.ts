import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("kitchen_foods.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    rating REAL DEFAULT 0,
    image_url TEXT,
    verified BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chef_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    FOREIGN KEY (chef_id) REFERENCES chefs(id)
  );

  CREATE TABLE IF NOT EXISTS stats (
    key TEXT PRIMARY KEY,
    value INTEGER
  );

  INSERT OR IGNORE INTO stats (key, value) VALUES ('active_chefs', 42);
  INSERT OR IGNORE INTO stats (key, value) VALUES ('meals_served', 1250);
  INSERT OR IGNORE INTO stats (key, value) VALUES ('income_generated', 350000);
`);

// Seed some data if empty
const chefCount = db.prepare("SELECT COUNT(*) as count FROM chefs").get() as { count: number };
if (chefCount.count === 0) {
  const insertChef = db.prepare("INSERT INTO chefs (name, specialty, rating, image_url, verified) VALUES (?, ?, ?, ?, ?)");
  insertChef.run("Chef Kamala", "Traditional Rice & Curry", 4.8, "https://picsum.photos/seed/kamala/400/400", 1);
  insertChef.run("Chef Piyawathi", "Authentic Lasagna", 4.9, "https://picsum.photos/seed/piyawathi/400/400", 1);
  insertChef.run("Chef Fathima", "Spicy Biryani", 4.7, "https://picsum.photos/seed/fathima/400/400", 1);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/chefs", (req, res) => {
    const chefs = db.prepare("SELECT * FROM chefs").all();
    res.json(chefs);
  });

  app.get("/api/stats", (req, res) => {
    const stats = db.prepare("SELECT * FROM stats").all();
    const statsObj = stats.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(statsObj);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
