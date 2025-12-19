# StockFlow MVP

A minimal SaaS Inventory Management System built in 6 hours for demo/internal use.

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Getting Started (Local)](#getting-started-local)
* [API Endpoints](#api-endpoints)
* [Postman Example Requests](#postman-example-requests)
* [Deployment](#deployment)

---

## Project Overview

StockFlow MVP allows a single user per organization to:

* Sign up / log in
* Create and manage products (name, SKU, quantity, prices)
* View a dashboard with total products, quantity, and low-stock items
* Adjust global low-stock threshold in settings

---

## Features

1. **Authentication**

   * Signup (Email, Password, Organization Name)
   * Login (Email & Password)
   * JWT-based authentication

2. **Products Management**

   * Add, edit, delete products
   * Fields: Name, SKU, Quantity, Cost Price, Selling Price, Low Stock Threshold

3. **Dashboard**

   * Total products and total quantity
   * Low stock items table (based on threshold)

4. **Settings**

   * Global low-stock threshold

---

## Tech Stack

* **Frontend:** React, Vite, React Router
* **Backend:** Node.js, Express, SQLite3, JWT, bcrypt
* **Deployment:** Render (backend), Vercel (frontend)

---

## Folder Structure

```
stockflow-mvp/
├─ backend/
│  ├─ server.js
│  ├─ db.js
│  ├─ middleware.js
│  └─ package.json
├─ frontend/
│  ├─ vite-project/
│  │  ├─ src/
│  │  │  ├─ api.js
│  │  │  ├─ App.jsx
│  │  │  ├─ pages/
│  │  │  │  ├─ Login.jsx
│  │  │  │  ├─ Signup.jsx
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ Products.jsx
│  │  │  │  └─ Settings.jsx
│  │  │  └─ components/
│  │  │     └─ Nav.jsx
│  │  └─ package.json
├─ .gitignore
└─ README.md
```

---

## Getting Started (Local)

### Backend

1. Navigate to backend folder:

   ```bash
   cd stockflow-mvp/backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start server:

   ```bash
   node server.js
   ```

   * Runs on [http://localhost:4000](http://localhost:4000)

### Frontend

1. Navigate to frontend folder:

   ```bash
   cd stockflow-mvp/frontend/vite-project
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start development server:

   ```bash
   npm run dev
   ```

   * Runs on [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

> **All product/dashboard/settings endpoints require JWT token in `Authorization` header**

### Auth

| Method | Endpoint  | Body                           | Response    |
| ------ | --------- | ------------------------------ | ----------- |
| POST   | `/signup` | `{ email, password, orgName }` | `{ token }` |
| POST   | `/login`  | `{ email, password }`          | `{ token }` |

### Products

| Method | Endpoint        | Body                                                               | Response         |
| ------ | --------------- | ------------------------------------------------------------------ | ---------------- |
| GET    | `/products`     | JWT required                                                       | List of products |
| POST   | `/products`     | `{ name, sku, quantity, cost_price?, selling_price?, low_stock? }` | 200 OK           |
| PUT    | `/products/:id` | `{ name, sku, quantity, cost_price, selling_price, low_stock }`    | 200 OK           |
| DELETE | `/products/:id` | JWT required                                                       | 200 OK           |

### Dashboard

| Method | Endpoint     | JWT Required | Response                        |
| ------ | ------------ | ------------ | ------------------------------- |
| GET    | `/dashboard` | Yes          | `{ count, totalQty, lowStock }` |

### Settings

| Method | Endpoint    | Body        | Response |
| ------ | ----------- | ----------- | -------- |
| PUT    | `/settings` | `{ value }` | 200 OK   |

---

## Postman Example Requests

### 1. Signup

* **Method:** POST
* **URL:** `http://localhost:4000/signup`
* **Body (JSON):**

```json
{
  "email": "test@example.com",
  "password": "123456",
  "orgName": "Test Store"
}
```

* **Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

### 2. Login

* **Method:** POST
* **URL:** `http://localhost:4000/login`
* **Body (JSON):**

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

* **Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

### 3. Create Product

* **Method:** POST
* **URL:** `http://localhost:4000/products`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  Content-Type: application/json
  ```
* **Body (JSON):**

```json
{
  "name": "Laptop",
  "sku": "LAP-001",
  "quantity": 10,
  "cost_price": 500,
  "selling_price": 700,
  "low_stock": 5
}
```

* **Response:** `200 OK`

---

### 4. Get Products

* **Method:** GET
* **URL:** `http://localhost:4000/products`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  ```
* **Response Example:**

```json
[
  {
    "id": 1,
    "organization_id": 1,
    "name": "Laptop",
    "sku": "LAP-001",
    "quantity": 10,
    "cost_price": 500,
    "selling_price": 700,
    "low_stock": 5
  }
]
```

---

### 5. Dashboard

* **Method:** GET
* **URL:** `http://localhost:4000/dashboard`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  ```
* **Response Example:**

```json
{
  "count": 1,
  "totalQty": 10,
  "lowStock": []
}
```

---

### 6. Update Settings

* **Method:** PUT
* **URL:** `http://localhost:4000/settings`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  Content-Type: application/json
  ```
* **Body (JSON):**

```json
{
  "value": 3
}
```

* **Response:** `200 OK`

---

### 7. Edit Product

* **Method:** PUT
* **URL:** `http://localhost:4000/products/1`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  Content-Type: application/json
  ```
* **Body (JSON):**

```json
{
  "name": "Laptop Pro",
  "sku": "LAP-001-PRO",
  "quantity": 15,
  "cost_price": 600,
  "selling_price": 800,
  "low_stock": 5
}
```

* **Response:** `200 OK`

---

### 8. Delete Product

* **Method:** DELETE
* **URL:** `http://localhost:4000/products/1`
* **Headers:**

  ```
  Authorization: <JWT_TOKEN>
  ```
* **Response:** `200 OK`

---

## Deployment

* **Backend:** Render

  * Node.js environment
  * SQLite database stored locally or in Render persistent storage

* **Frontend:** Vercel

  * React SPA
  * Environment variable for backend URL: `VITE_API_URL`

---
