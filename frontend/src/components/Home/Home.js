import React from "react";
import { useAuth } from "../../context/AuthContext";
import Login from "../Login/Login";
import "./Home.css";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="content">
      {isLoggedIn ? (
        <>
          <div className="branding-header">
            <h1>Eventify</h1>
            <p className="tagline">
              <em> &lsquo; Simplify &rsquo; your Events </em>
            </p>
          </div>
          <p className="about">
            Explore the magic of our application &apos;EVENTIFY&apos;. A go-to
            solution for managing amazing events effortlessly. From easy sign-ups
            to registering and managing event schedules, our user-friendly
            platform has everything you need for a flawless experience. With
            powerful features, trust our system to handle the details, and
            let&apos;s bring your event vision to life!!!
          </p>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}