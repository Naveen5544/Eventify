import React, { useEffect, useState, useCallback } from "react";
import { getUserBookedEvents } from "../../api";
import EventCard from "./EventCard";

export default function BookedEventsList() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookedEvents = useCallback(() => {
    setLoading(true);
    setError(null);
    getUserBookedEvents()
      .then((res) => {
        if (res.status === 200) {
          setBookedEvents(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching booked events:", err);
        setError("Could not load your booked events. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookedEvents();
  }, [fetchBookedEvents]);

  if (loading) {
    return <p style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Loading your booked events...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center", marginTop: "5rem" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Your Booked Events</h1>
      <div className="cardContainer">
        {bookedEvents.length > 0 ? (
          bookedEvents.map((event) => (
            <EventCard key={event._id} obj={event} action="cancel" onRefresh={fetchBookedEvents} />
          ))
        ) : (
          <p style={{ color: "white" }}>You have not booked any events yet.</p>
        )}
      </div>
    </div>
  );
}