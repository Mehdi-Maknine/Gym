import React, { useEffect, useState } from "react";

const TestMemberApiPage = () => {
  const [me, setMe] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [progress, setProgress] = useState(null);
  const [payments, setPayments] = useState([]);
  const [feed, setFeed] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [tips, setTips] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [message, setMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);

  useEffect(() => {
    fetch("/api/member/me", { credentials: "include" }).then(res => res.json()).then(setMe);
    fetch("/api/member/attendance", { credentials: "include" }).then(res => res.json()).then(setAttendance);
    fetch("/api/member/progress", { credentials: "include" }).then(res => res.json()).then(setProgress);
    fetch("/api/member/payments", { credentials: "include" }).then(res => res.json()).then(data => setPayments(data.payments || []));
    fetch("/api/feed/messages").then(res => res.json()).then(setFeed);
    fetch("/api/sessions/upcoming").then(res => res.json()).then(data => setSessions(data.sessions || []));
    fetch("/api/programs").then(res => res.json()).then(data => setPrograms(data.programs || []));
    fetch("/api/trainers").then(res => res.json()).then(data => setTrainers(data.trainers || []));
    fetch("/api/tips?category=general").then(res => res.json()).then(data => setTips(data.tips || []));
    fetch("/api/memberships").then(res => res.json()).then(data => setMemberships(data.memberships || []));
    fetch("/api/sessions/search", { credentials: "include" }).then(res => res.json()).then(data => setSearchResults(data.sessions || []));
    fetch("/api/member/sessions", { credentials: "include" }).then(res => res.json()).then(setSessions);

    fetch("/api/member/calendar", { credentials: "include" }).then(res => res.json()).then(data => setCalendar(data.calendar || []));
    fetch("/api/member/profile/avatar", { credentials: "include" }).then(res => res.json()).then(data => setAvatar(data.avatar || null));
    fetch("/api/member/stats/summary", { credentials: "include" }).then(res => res.json()).then(setSummaryStats);
    fetch("/api/member/achievements", { credentials: "include" }).then(res => res.json()).then(data => setAchievements(data.badges || []));
    fetch("/api/sessions/available", { credentials: "include" }).then(res => res.json()).then(setAvailableSessions);
    fetch("/api/sessions/booked", { credentials: "include" }).then(res => res.json()).then(setBookedSessions);
  }, []);

  const display = (title, data) => (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold">🔹 {title}</h2>
      <pre className="bg-gym-gray p-4 rounded mt-2 text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );

  return (
    <div className="p-8 text-white bg-gym-dark min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🧪 Gym API Test Page</h1>

      {display("/api/member/me", me)}
      {display("/api/member/attendance", attendance)}
      {display("/api/member/progress", progress)}
      {display("/api/member/payments", payments)}
      {display("/api/feed/messages", feed)}
      {display("/api/sessions/upcoming", sessions)}
      {display("/api/programs", programs)}
      {display("/api/trainers", trainers)}
      {display("/api/tips?category=general", tips)}
      {display("/api/memberships", memberships)}
      {display("/api/sessions/search", searchResults)}
      {display("/api/member/sessions", sessions)}
      {display("/api/member/calendar", calendar)}
      {display("/api/member/profile/avatar", { avatar })}
      {display("/api/member/stats/summary", summaryStats)}
      {display("/api/member/achievements", achievements)}
      {display("/api/sessions/available", availableSessions)}
      {display("/api/sessions/booked", bookedSessions)}


      <section className="mb-10">
        <h2 className="text-2xl font-semibold">🔹 /api/sessions/search</h2>
        <pre className="bg-gym-gray p-4 rounded mt-2 text-sm">
          {JSON.stringify(searchResults, null, 2)}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold">🔹 /api/member/sessions</h2>
        <pre className="bg-gym-gray p-4 rounded mt-2 text-sm">
          {JSON.stringify(sessions, null, 2)}
        </pre>
      </section>


      <section className="mb-10">
        <h2 className="text-2xl font-semibold">🔹 Session Booking Tests</h2>
        <button
          className="bg-gym-orange hover:bg-gym-red px-4 py-2 rounded mb-2"
          onClick={() => {
            fetch("/api/sessions/book", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: 1 })
            })
              .then((res) => res.json())
              .then((data) => setMessage(data.message || JSON.stringify(data)))
              .catch(() => setMessage("Error booking"));
          }}
        >
          Book Session #1
        </button>

        <button
          className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          onClick={() => {
            fetch("/api/sessions/cancel", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: 1 })
            })
              .then((res) => res.json())
              .then((data) => setMessage(data.message || JSON.stringify(data)))
              .catch(() => setMessage("Error cancelling"));
          }}
        >
          Cancel Session #1
        </button>

        <p className="mt-2 text-green-400">{message}</p>
      </section>
      


      <section className="mb-10">
        <h2 className="text-2xl font-semibold">🔹 Membership Renewal</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={() => {
            fetch("/api/membership/renew", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan_id: 1 })
            })
              .then((res) => res.json())
              .then((data) => setMessage(data.message || JSON.stringify(data)))
              .catch(() => setMessage("Error renewing membership"));
          }}
        >
          Renew with Plan #1
        </button>
        <p className="mt-2 text-green-400">{message}</p>
      </section>
    </div>
  );
};

export default TestMemberApiPage;
