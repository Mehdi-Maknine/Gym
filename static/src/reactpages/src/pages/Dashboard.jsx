// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Award, CalendarDays, Flame, User } from "lucide-react";
import { Button } from "../components/ui/button";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    fetch("http://localhost:8069/api/member/dashboard", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch((err) => console.error("Failed to load dashboard:", err));
  }, []);

  if (!dashboard) {
    return <div className="text-white p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-16 bg-gym-dark min-h-screen text-white">
      {/* Welcome Header */}
      <div className="flex items-center space-x-4 animate-fade-in" data-aos="fade-right">
        <img
          src={`data:image/png;base64,${dashboard.avatar}`}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-gym-orange shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-extrabold">Welcome, {dashboard.name}!</h1>
          {dashboard.membership_expired && (
            <Badge className="bg-red-600 text-white mt-2 animate-pulse">
              Membership Expired
            </Badge>
          )}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <section data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Upcoming Sessions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dashboard.upcoming_sessions?.map((session, i) => (
            <Card key={i} className="bg-gym-gray hover-lift shadow-md">
              <CardContent className="p-5">
                <h3 className="font-bold text-lg">{session.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{session.start}</p>
                <p className="text-sm text-gray-400">Trainer: {session.trainer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Progress Summary */}
      <section data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Your Progress</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gym-gray shadow-lg">
            <CardContent className="flex items-center p-6 space-x-4">
              <User className="w-8 h-8 text-gym-orange" />
              <div>
                <CountUp
                  end={dashboard.progress_summary?.total_checkins || 0}
                  className="text-2xl font-bold"
                />
                <p className="text-sm text-gray-400">Total Check-ins</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gym-gray shadow-lg">
            <CardContent className="flex items-center p-6 space-x-4">
              <Flame className="w-8 h-8 text-gym-orange" />
              <div>
                <CountUp
                  end={dashboard.progress_summary?.streak || 0}
                  className="text-2xl font-bold"
                />
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gym-gray shadow-lg">
            <CardContent className="flex items-center p-6 space-x-4">
              <CalendarDays className="w-8 h-8 text-gym-orange" />
              <div>
                <CountUp
                  end={dashboard.progress_summary?.completed_sessions || 0}
                  className="text-2xl font-bold"
                />
                <p className="text-sm text-gray-400">Completed Sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Tip */}
      {dashboard.daily_tip?.title && (
        <section data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Daily Tip</h2>
          <Card className="bg-gym-orange text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{dashboard.daily_tip.title}</h3>
              <p className="text-sm">{dashboard.daily_tip.description}</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Feed / Announcements */}
      <section data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Announcements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {dashboard.feed?.map((msg, i) => (
            <Card key={i} className="bg-gym-gray shadow-md">
              <CardContent className="p-5">
                <h4 className="font-bold mb-1 text-white">{msg.title}</h4>
                <p className="text-sm text-gray-300">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-2">{msg.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Renewal Prompt */}
      {dashboard.membership_expired && (
        <div className="text-center mt-12" data-aos="zoom-in">
          <Button className="bg-gym-orange hover:bg-gym-red text-white font-bold py-3 px-6 animate-pulse">
            Renew Membership
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
