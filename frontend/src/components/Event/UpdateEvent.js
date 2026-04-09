import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getEventById, updateEvent } from "../../api";
import EventRegistrationForm from "./eventform";

function UpdateEvent() {
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Prefer router state; fall back to localStorage for backward compatibility
    const eventID = location.state?.eventId || localStorage.getItem("eventID");

    useEffect(() => {
        if (!eventID) {
            alert("No event selected for update.");
            navigate("/event-list");
            return;
        }

        getEventById(eventID)
            .then(response => {
                setInitialData(response.data);
            })
            .catch(error => {
                console.error("Error fetching event details:", error);
                alert("Could not load event data.");
            });
    }, [eventID, navigate]);

    const handleSubmit = (formData) => {
        updateEvent(eventID, formData)
            .then(() => {
                alert("Event updated successfully!");
                // Clean up legacy localStorage entry if it was used
                localStorage.removeItem("eventID");
                navigate("/event-list");
            })
            .catch((error) => {
                console.error("Error updating event:", error);
                const errorMessage = error.response?.data?.error || "Failed to update event. Please try again.";
                alert(errorMessage);
            });
    };

    if (!initialData) {
        return <p style={{ color: "white", textAlign: "center" }}>Loading event data...</p>;
    }

    return (
        <EventRegistrationForm
            nameValue={initialData.name}
            startTimeValue={initialData.startTime}
            endTimeValue={initialData.endTime}
            dateValue={initialData.date}
            placeValue={initialData.place}
            descriptionValue={initialData.description}
            clubValue={initialData.club}
            slotsValue={initialData.slots}
            action="update"
            onSubmit={handleSubmit}
        />
    );
}

export default UpdateEvent;