import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getEventById } from "../../api";
import "./Events.css";

const ViewEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getEventById(id)
      .then((res) => {
        if (res.status === 200) {
          setEvent(res.data);
        } else {
          throw new Error("Event not found");
        }
      })
      .catch((err) => alert("Error loading event: " + err.message));
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  const {
    name,
    club,
    description,
    date,
    place,
    startTime,
    endTime,
    slots,
  } = event;

  return (
    <div className="viewEventContainer">
      <Card className="eventCard" style={{ margin: "2rem auto", maxWidth: "600px" }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "2vw", fontWeight: "bold" }}>{name}</Card.Title>
          <Card.Subtitle style={{ fontSize: "1.3vw", fontStyle: "italic" }}>{club}</Card.Subtitle>
          <Card.Text style={{ fontSize: "1.1vw", marginTop: "1rem" }}>
            <strong>Description:</strong> {description}<br />
            <strong>Date:</strong> {formatDate(date)}<br />
            <strong>Time:</strong> {startTime} - {endTime}<br />
            <strong>Place:</strong> {place}<br />
            <strong>Slots Left:</strong> {slots}
          </Card.Text>
          <Button variant="secondary" onClick={() => navigate("/event-list")}>
            Back to Event List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewEvent;
