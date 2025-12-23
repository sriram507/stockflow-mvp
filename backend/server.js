const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const db = require("./db");
const auth = require("./middleware");

const app = express();
app.use(cors());
app.use(express.json());

/* ----- HEALTH CHECK -----*/

app.get("/", (req, res) => {
  res.send("StockFlow backend is running");
});

/* ----- AUTH ----- */

// Signup
app.post("/signup", async (req, res) => {
  const { email, password, orgName } = req.body;

  if (!email || !password || !orgName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO organizations (name) VALUES (?)",
    [orgName],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const orgId = this.lastID;

      db.run(
        "INSERT INTO users (email, password, organization_id) VALUES (?, ?, ?)",
        [email, hashedPassword, orgId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          const token = jwt.sign({ orgId }, "secret");
          res.json({ token });
        }
      );
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (!user) return res.sendStatus(401);

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.sendStatus(401);

      const token = jwt.sign(
        { orgId: user.organization_id },
        "secret"
      );

      res.json({ token });
    }
  );
});

/* ----- PRODUCTS ----- */

// Get all products
app.get("/products", auth, (req, res) => {
  db.all(
    "SELECT * FROM products WHERE organization_id = ?",
    [req.orgId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Create product
app.post("/products", auth, (req, res) => {
  const {
    name,
    sku,
    quantity,
    cost_price,
    selling_price,
    low_stock
  } = req.body;

  if (!name || !sku || quantity == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.run(
    `
    INSERT INTO products
    (organization_id, name, sku, quantity, cost_price, selling_price, low_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      req.orgId,
      name,
      sku,
      quantity,
      cost_price || null,
      selling_price || null,
      low_stock || null
    ],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

// Update product
app.put("/products/:id", auth, (req, res) => {
  const {
    name,
    sku,
    quantity,
    cost_price,
    selling_price,
    low_stock
  } = req.body;

  db.run(
    `
    UPDATE products
    SET name = ?, sku = ?, quantity = ?, cost_price = ?, selling_price = ?, low_stock = ?
    WHERE id = ? AND organization_id = ?
    `,
    [
      name,
      sku,
      quantity,
      cost_price || null,
      selling_price || null,
      low_stock || null,
      req.params.id,
      req.orgId
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

// Delete product
app.delete("/products/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM products WHERE id = ? AND organization_id = ?",
    [req.params.id, req.orgId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

/* ----- DASHBOARD -----*/

app.get("/dashboard", auth, (req, res) => {
  db.get(
    "SELECT default_low_stock FROM organizations WHERE id = ?",
    [req.orgId],
    (err, org) => {
      if (err) return res.status(500).json({ error: err.message });

      const defaultThreshold = org?.default_low_stock || 5;

      db.all(
        "SELECT * FROM products WHERE organization_id = ?",
        [req.orgId],
        (err, products) => {
          if (err) return res.status(500).json({ error: err.message });

          const totalQty = products.reduce(
            (sum, p) => sum + p.quantity,
            0
          );

          const lowStock = products.filter(p => {
            const threshold = p.low_stock ?? defaultThreshold;
            return p.quantity <= threshold;
          });

          res.json({
            count: products.length,
            totalQty,
            lowStock
          });
        }
      );
    }
  );
});

/* ----- SETTINGS ----- */

app.put("/settings", auth, (req, res) => {
  const { value } = req.body;

  db.run(
    "UPDATE organizations SET default_low_stock = ? WHERE id = ?",
    [value, req.orgId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

/* ----- SERVER ----- */

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
