const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8069;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// === Public & User API Routes ===

app.get('/api/member/dashboard', (req, res) => {
  res.json({
    name: "John Doe",
    avatar: null,
    membership_expired: false,
    membership_end_date: "2025-12-31",
    upcoming_sessions: [
      { name: "Morning Yoga", start: "2025-07-06T08:00:00", end: "2025-07-06T09:00:00", trainer: "Jane Doe", location: "Main Hall" }
    ],
    progress_summary: { total_checkins: 20, streak: 4, completed_sessions: 22 },
    daily_tip: { title: "Stay Hydrated!", description: "Drink water before and after training." },
    feed: [
      { title: "New Equipment Arrived", content: "Check out our new rowers and treadmills!", date: "2025-07-05 09:00" }
    ]
  });
});

app.get('/api/sessions/search', (req, res) => {
  res.json({
    sessions: [{
      id: 1,
      name: "Functional Training",
      start_datetime: "2025-07-07T10:00:00",
      end_datetime: "2025-07-07T11:00:00",
      trainer: "Alex Fit",
      class_type: "HIIT",
      location: "Studio 1",
      spots_left: 5,
      is_booked: true
    }]
  });
});

app.get('/api/programs', (req, res) => {
  res.json({
    programs: [
      { id: 1, name: "HIIT", description: "High Intensity Interval Training" },
      { id: 2, name: "Yoga", description: "Relax and strengthen your body" }
    ]
  });
});

app.get('/api/trainers', (req, res) => {
  res.json({
    trainers: [
      { id: 1, name: "Jane Doe", specialty: "Yoga", member_count: 25 },
      { id: 2, name: "Mark Smith", specialty: "Strength", member_count: 30 }
    ]
  });
});

app.get('/api/tips', (req, res) => {
  res.json({
    tips: [
      { title: "Warm Up!", description: "Always warm up before a workout.", category: "general", image: null },
      { title: "Push Harder!", description: "No pain, no gain!", category: "motivational", image: null }
    ]
  });
});

app.get('/api/sessions/upcoming', (req, res) => {
  res.json({
    sessions: [
      { id: 101, name: "Zumba Blast", trainer: "Lina Energy", location: "Dance Room", class_type: "Zumba", start_datetime: "2025-07-06T18:00:00", end_datetime: "2025-07-06T19:00:00", duration: 60 }
    ]
  });
});

app.get('/api/memberships', (req, res) => {
  res.json({
    memberships: [
      { id: 1, name: "Monthly Plan", price: 50, duration_months: 1, description: "Access to all facilities.", per_day_cost: 1.67, duration_label: "1 Month", member_count: 120 },
      { id: 2, name: "Annual Plan", price: 500, duration_months: 12, description: "Best value membership.", per_day_cost: 1.37, duration_label: "1 Year", member_count: 80 }
    ]
  });
});

// === Authenticated Routes ===

app.get('/api/member/me', (req, res) => {
  res.json({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    join_date: "2024-07-01",
    membership: {
      name: "Annual Plan",
      end_date: "2025-07-01",
      expired: false,
      status: "active",
      status_message: ""
    },
    trainer: { name: "Jane Doe", specialty: "Yoga" },
    total_payments: 500
  });
});

app.get('/api/member/attendance', (req, res) => {
  res.json([
    { session: "Zumba Blast", date: "2025-07-01", status: "present" },
    { session: "Functional Training", date: "2025-06-28", status: "late" }
  ]);
});

app.get('/api/member/progress', (req, res) => {
  res.json({
    total_checkins: 18,
    streak: 3,
    completed_sessions: 20
  });
});

app.get('/api/feed/messages', (req, res) => {
  res.json([
    { title: "Summer Bootcamp!", content: "Join our summer training series!", date: "2025-07-04 10:00" },
    { title: "Nutrition Tips", content: "Fuel your body with the right food.", date: "2025-07-03 15:00" }
  ]);
});

app.get('/api/member/sessions', (req, res) => {
  res.json([
    { id: 1, name: "Zumba Blast", start: "2025-07-01T08:00:00", end: "2025-07-01T09:00:00", trainer: "Lina", class_type: "Zumba", location: "Room A" }
  ]);
});

app.get('/api/member/profile/avatar', (req, res) => {
  res.json({ avatar: null });
});

app.get('/api/member/stats/summary', (req, res) => {
  res.json({
    total_attendance: 22,
    unique_classes: 3,
    most_attended_class: "HIIT"
  });
});

app.get('/api/tips/category/:category', (req, res) => {
  const { category } = req.params;
  res.json([
    { title: `Example Tip for ${category}`, description: "Stay active!", category, image: null }
  ]);
});

app.get('/api/sessions/booked', (req, res) => {
  res.json([
    { id: 5, name: "Mobility Flow", start: "2025-07-10T10:00:00", end: "2025-07-10T11:00:00", trainer: "Laura", location: "Hall C" }
  ]);
});

app.get('/api/sessions/available', (req, res) => {
  res.json([
    { id: 6, name: "Strength Class", start: "2025-07-12T12:00:00", end: "2025-07-12T13:00:00", trainer: "Mike", location: "Room B", class_type: "Strength" }
  ]);
});

app.get('/api/member/achievements', (req, res) => {
  res.json({ badges: ["10 Sessions Completed", "Active Member"] });
});

app.post('/api/member/contact-support', (req, res) => {
  const { message } = req.body;
  res.json({ success: true, message: "Your message has been received!" });
});

app.post('/api/sessions/book', (req, res) => {
  const { session_id } = req.body;
  res.json({ success: true, message: `Session ${session_id} booked!` });
});

app.post('/api/sessions/cancel', (req, res) => {
  const { session_id } = req.body;
  res.json({ success: true, message: `Session ${session_id} cancelled.` });
});

app.post('/api/membership/renew', (req, res) => {
  const { plan_id } = req.body;
  res.json({ success: true, message: `Membership renewed with plan ${plan_id}` });
});

app.listen(PORT, () => {
  console.log(`🟢 Mock Odoo API running at http://localhost:${PORT}`);
});
