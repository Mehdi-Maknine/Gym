import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const ClassBooking = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8069/api/sessions/search", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sessions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-white">Loading sessions...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Available Gym Sessions</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {sessions.map((s, i) => (
          <Card key={i} className="bg-gym-gray">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{s.name}</h3>
              <p>{new Date(s.start_datetime).toLocaleString()}</p>
              <p className="text-sm text-gray-400">Trainer: {s.trainer}</p>
              <p className="text-sm text-gray-400">Location: {s.location}</p>
              <p className="text-sm text-gray-400">Spots left: {s.spots_left}</p>

              {s.is_booked ? (
                <Button variant="outline" className="mt-3">Cancel</Button>
              ) : (
                <Button className="mt-3 bg-gym-orange">Book Now</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassBooking;
