import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './eventform.css';

const EventRegistrationForm = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    date: '',
    place: '',
    description: '',
    club: '',
    slots: '',
  });

  const [title, setTitle] = useState("Event Creation Form");
  const [buttonTitle, setButtonTitle] = useState("Create");

  useEffect(() => {
    // This effect ensures the form is populated with initial data for updates
    if (props.action === "update") {
      const date = props.dateValue ? new Date(props.dateValue).toISOString().split('T')[0] : '';
      setFormData({
        name: props.nameValue || '',
        startTime: props.startTimeValue || '',
        endTime: props.endTimeValue || '',
        date: date,
        place: props.placeValue || '',
        description: props.descriptionValue || '',
        club: props.clubValue || '',
        slots: props.slotsValue || '',
      });
      setTitle("Event Updation Form");
      setButtonTitle("Update");
    }
  }, [
    props.action,
    props.nameValue,
    props.startTimeValue,
    props.endTimeValue,
    props.dateValue,
    props.placeValue,
    props.descriptionValue,
    props.clubValue,
    props.slotsValue,
  ]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Additional validation to ensure the date is not in the past
    if (new Date(formData.date) < new Date(todayStr)) {
      alert("Event date cannot be in the past.");
      return;
    }

    // Use the onSubmit prop passed from the parent component (CreateEvent or UpdateEvent)
    props.onSubmit(formData);
  };

  return (
    <div className="eventForm">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Annual Tech Symposium"
            required
          />
        </div>
        <div>
          <label htmlFor="startTime">Event Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="endTime">Event End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Event Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={todayStr}
            required
          />
        </div>
        <div>
          <label htmlFor="place">Event Place:</label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Venue address or Room No"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter details about event"
            required
          />
        </div>
        <div>
          <label htmlFor="club">Name of the Club:</label>
          <input
            type="text"
            id="club"
            name="club"
            value={formData.club}
            onChange={handleChange}
            placeholder="e.g. Google Developer Group"
            required
          />
        </div>
        <div>
          <label htmlFor="slots">Number of Slots:</label>
          <input
            type="number"
            id="slots"
            name="slots"
            value={formData.slots}
            onChange={handleChange}
            placeholder="e.g. 100"
            required
          />
        </div>
        <button className="button" type="submit">{buttonTitle}</button>
      </form>
    </div>
  );
};

EventRegistrationForm.propTypes = {
  nameValue: PropTypes.string,
  startTimeValue: PropTypes.string,
  endTimeValue: PropTypes.string,
  dateValue: PropTypes.string,
  placeValue: PropTypes.string,
  descriptionValue: PropTypes.string,
  clubValue: PropTypes.string,
  slotsValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  action: PropTypes.oneOf(["create", "update"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EventRegistrationForm;