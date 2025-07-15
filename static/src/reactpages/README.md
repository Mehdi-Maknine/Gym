# 🏋️‍♀️ Meliora Gym React Frontend — Developer README (Private)

> This README is for internal use only — specifically for **you, our React developer friend** — to help you set up, run, and develop the frontend using mock data without Odoo.

---

## ✅ What You're Working With

This is the **React frontend** for the Meliora Gym web app. The backend is built in Odoo, but you **don't need to install Odoo** — you're using a **fake backend (mock server)** that simulates the real API.

---

## 🛠️ Initial Setup

1. **Clone the repo**

2. **Install dependencies** (including React + mock server tools):

```bash
npm install
```

3. **Start everything** (frontend + mock backend):

```bash
npm run dev:full
```

This command does two things:

* Starts the fake Odoo API on `http://localhost:8069`
* Starts the React app on `http://localhost:3000`

---

## 🧪 Mock Backend Details

The mock server is located in:

```
mockServer.js
```

It uses **Express** and **CORS** to replicate all Odoo API routes and responses.

### To run it alone:

```bash
npm run mock-backend
```

### To edit or add mock data:

Just open `mockServer.js` and update the fake JSON returned inside each route, e.g.:

```js
app.get('/api/programs', (req, res) => {
  res.json({
    programs: [
      { id: 1, name: "HIIT", description: "Intense and fun" },
      { id: 2, name: "Yoga", description: "Flow & relax" }
    ]
  });
});
```

You can add more items, change fields, or even simulate errors if needed.

> Every time you change `mockServer.js`, you’ll need to **restart the mock backend**:

```bash
CTRL+C  # to stop it
npm run mock-backend
```

---

## 📡 Available API Endpoints (From Odoo, Mocked Locally)

These are all fully working via the mock server:

### 🔐 Member (User API)

* `GET /api/member/dashboard` — Member dashboard (name, avatar, sessions, tip, feed)
* `GET /api/sessions/search` — Search for gym sessions (filters supported: trainer\_id, class\_type\_id, location, etc.)

### 🌐 Public (Landing Page APIs)

* `GET /api/programs` — List of gym programs / class types
* `GET /api/trainers` — List of gym trainers
* `GET /api/tips` — Motivational or general workout tips (with optional category)
* `GET /api/sessions/upcoming` — Next 5 upcoming gym sessions
* `GET /api/memberships` — Membership plans (monthly, annual, etc.)

Each of these returns **realistic fake data**.

---

## 📦 Scripts Reference

| Script                 | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run start`        | Starts the React app only                    |
| `npm run mock-backend` | Starts the mock backend API only (port 8069) |
| `npm run dev:full`     | 🚀 Starts both (React + mock API) in one go  |

---

## 👨‍💻 Tips for Development

* You can use all APIs without authentication (mock server doesn’t require login)
* The mock data structure matches the real backend fields from Odoo
* You can simulate delays or errors if needed by modifying the Express routes
* If you're unsure about a field or endpoint, just ask — the backend logic is already done in Odoo and can be shared

---

## ❓ Need Help?

Contact Mehdi — the backend dev who made the Odoo API — for:

* Real field names / datatypes
* Adding new endpoints
* Explaining any API logic / how the real app works behind the scenes

We’ve got your back 💪