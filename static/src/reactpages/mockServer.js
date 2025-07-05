const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8069;

app.use(cors());
app.use(express.json());

// --- User Dashboard ---
app.get('/api/member/dashboard', (req, res) => {
  res.json({
    name: "John Doe",
    avatar: null,
    membership_expired: false,
    membership_end_date: "2025-12-31",
    upcoming_sessions: [
      {
        name: "Morning Yoga",
        start: "2025-07-06T08:00:00",
        end: "2025-07-06T09:00:00",
        trainer: "Jane Doe",
        location: "Main Hall"
      }
    ],
    progress_summary: {
      total_checkins: 20,
      streak: 4,
      completed_sessions: 22
    },
    daily_tip: {
      title: "Stay Hydrated!",
      description: "Drinking water before and after workouts improves recovery."
    },
    feed: [
      {
        title: "New Equipment Arrived",
        content: "Check out our new rowers and treadmills in the cardio zone!",
        date: "2025-07-05 09:00"
      }
    ]
  });
});

// --- Session Search ---
app.get('/api/sessions/search', (req, res) => {
  res.json({
    sessions: [
      {
        id: 1,
        name: "Functional Training",
        start_datetime: "2025-07-07T10:00:00",
        end_datetime: "2025-07-07T11:00:00",
        trainer: "Alex Fit",
        class_type: "HIIT",
        location: "Studio 1",
        spots_left: 5,
        is_booked: true
      }
    ]
  });
});

// --- Programs ---
app.get('/api/programs', (req, res) => {
  res.json({
    programs: [
      { id: 1, name: "HIIT", description: "High Intensity Interval Training" },
      { id: 2, name: "Yoga", description: "Relax and strengthen your body" }
    ]
  });
});

// --- Trainers ---
app.get('/api/trainers', (req, res) => {
  res.json({
    trainers: [
      { id: 1, name: "Jane Doe", specialty: "Yoga", member_count: 25, certifications: [] },
      { id: 2, name: "Mark Smith", specialty: "Strength", member_count: 30, certifications: [] }
    ]
  });
});

// --- Tips ---
app.get('/api/tips', (req, res) => {
  res.json({
    tips: [
      { title: "Warm Up!", description: "Always warm up before a workout.", category: "general", image: null },
      { title: "Motivation Boost", description: "Push your limits every day!", category: "motivational", image: null }
    ]
  });
});

// --- Upcoming Sessions ---
app.get('/api/sessions/upcoming', (req, res) => {
  res.json({
    sessions: [
      {
        id: 101,
        name: "Zumba Blast",
        trainer: "Lina Energy",
        location: "Dance Room",
        class_type: "Zumba",
        start_datetime: "2025-07-06T18:00:00",
        end_datetime: "2025-07-06T19:00:00",
        duration: 60
      }
    ]
  });
});

// --- Memberships ---
app.get('/api/memberships', (req, res) => {
  res.json({
    memberships: [
      {
        id: 1,
        name: "Monthly Plan",
        price: 50,
        duration_months: 1,
        description: "Access to all facilities.",
        per_day_cost: 1.67,
        duration_label: "1 Month",
        member_count: 120
      },
      {
        id: 2,
        name: "Annual Plan",
        price: 500,
        duration_months: 12,
        description: "Best value membership.",
        per_day_cost: 1.37,
        duration_label: "1 Year",
        member_count: 80
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🟢 Mock Odoo API running at http://localhost:${PORT}`);
});
