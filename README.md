# 🏋️‍♀️ Gym Management for Odoo 18

> A modern gym ERP system with a mobile-first React portal.  
> Manage members, classes, trainers, payments, dashboards, tips, and more from a unified platform.

![Gym Banner](https://via.placeholder.com/1200x300.png?text=Gym+Meliora+Management+System)

---

## 🔧 Built With

- 🧩 **Odoo 18** — full backend support (models, views, logic)
- ⚛️ **React** — dynamic, responsive member portal
- 🧾 **JSON-RPC APIs** — seamless backend communication
- 🗺️ **Leaflet.js** — interactive map widgets
- 🎨 **Tailwind CSS / Lucide Icons** — sleek and modern UI

---

## 🧱 Backend Views (Odoo Admin)

### 👥 `gym.member`
- **Tree & Form Views**  
  Manage personal info, membership, trainer link, and status indicators (active/expired)
- Embedded views for:
  - Sessions joined
  - Payments
  - Attendance stats
- ✨ Visual status indicators

---

### 💪 `gym.class.type`
- Define reusable class/program types (e.g. Yoga, CrossFit)
- Used in session planning and filtering
- Custom icons and descriptions supported

---

### 📅 `gym.session`
- **Form, List, Calendar Views**
- Schedule classes by trainer, type, capacity
- Linked to member enrollment
- ✅ Mark-all-present feature for attendance

---

### 🧑‍🏫 `gym.trainer`
- Assign to sessions and members
- Includes expertise, availability
- Filter sessions by trainer

---

### 🪪 `gym.membership.plan`
- Set plan name, price, duration
- Used to assign and track member subscriptions

---

### 💳 `gym.payment`
- Log payments by member and plan
- Attach receipts
- Profile-level payment history

---

### 🗓️ `gym.class.attendance`
- Tracks presence of members in each session
- Related to sessions and members
- Used for attendance KPIs

---

### 🧠 `gym.workout.tip`
- Daily motivational or category-based workout tips
- Categories: general, chest, arms, legs, challenges, etc.
- Supports images, rich text
- Shown on portal homepage and class pages

---

### 📣 `gym.feed.message`
- Admin-posted updates for:
  - All members (public)
  - Specific member history (private)
- Shown in portal feed

---

### 📊 `gym.dashboard`
- Custom kanban dashboard powered by `_auto = False` + SQL View
- KPIs: Active Members, Expired Plans, Monthly Revenue, Sessions Held
- Easily extendable with new metrics

---

## ⚛️ React Member Portal (in progress)

All React pages will **mirror or enhance Odoo backend functionality**, with full responsiveness and animations.

✅ Already Built:
- `/` → **LandingPage**  
- `/login` → **LoginPage**  
- `/my/dashboard` → **DashboardPage**  
- `/my/sessions` → **ClassBookingPage**

🛠️ Coming Soon:
- `/my/tips` → Workout Tips Browser
- `/my/feed` → Member + Gym Feed
- `/my/payments` → Payment History
- `/my/goals` → Streaks, Badges, Gamification
- `/my/trainer-map` → Map view of session locations
- `/my/store` → Gym Merchandise Shop

📁 Location:
```bash
/custom_addons/gym_meliora/static/src/reactpages/
