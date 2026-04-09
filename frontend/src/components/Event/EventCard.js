import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import { bookEvent, deleteEvent, cancelBooking } from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./Events.css";

function EventCard({ obj, action, onView, onRefresh }) {
  const navigate = useNavigate();
  const { _id, name, date, place, club, slots, startTime, endTime, createdBy } = obj;
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleBook = async () => {
    try {
      await bookEvent(_id);
      alert("Event Booked Successfully!");
      if (onRefresh) onRefresh();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Booking failed. Please try again.";
      alert(errorMessage);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(_id);
        alert("Booking cancelled successfully!");
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error cancelling:", error);
        alert(error.response?.data?.error || "Failed to cancel booking.");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(_id);
        alert("Event deleted successfully");
        if (onRefresh) onRefresh();
      } catch (error) {
        alert("Failed to delete event.");
      }
    }
  };

  const handleUpdate = () => {
    // Pass eventId through router state (no localStorage needed)
    navigate("/update-event", { state: { eventId: _id } });
  };

  const isOwner = createdBy && (createdBy === user?.id || createdBy?._id === user?.id);
  const isAdminOrOwner = user?.role === "admin" || isOwner;

  return (
    <Card className="eventCard">
      <Card.Body>
        <Card.Title style={{ fontSize: "2vw", fontWeight: "bolder" }}>{name}</Card.Title>
        <Card.Subtitle style={{ fontSize: "1.3vw", fontWeight: "bold", fontStyle: "italic" }}>{club}</Card.Subtitle>

        <Card.Text style={{ fontSize: "1.75vw", fontWeight: "bolder" }}>
          Date: {formatDate(date)}<br />
          Time: {startTime} to {endTime}<br />
          Place: {place}<br />
          Slots Left: {slots}
        </Card.Text>

        <button
          className="cardButton"
          style={{ backgroundColor: "wheat" }}
          onClick={onView ? () => onView() : () => navigate(`/view-event/${_id}`)}
        >
          View Description
        </button>

        {action === "book" && user?.role === "user" && (
          <button className="cardButton" style={{ backgroundColor: "greenyellow" }} onClick={handleBook}>
            Book Now!
          </button>
        )}

        {action === "cancel" && user?.role === "user" && (
          <button className="cardButton" style={{ backgroundColor: "orange" }} onClick={handleCancel}>
            Cancel Booking
          </button>
        )}

        {isAdminOrOwner && (
          <>
            <button className="cardButton" style={{ backgroundColor: "green" }} onClick={handleUpdate}>
              Update
            </button>
            <button className="cardButton" style={{ backgroundColor: "red" }} onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

EventCard.propTypes = {
  obj: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onView: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default EventCard;