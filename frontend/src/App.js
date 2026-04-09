import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import ProtectedRouteAdmin from './components/Protected/ProtectedRoutedAdmin';
import setupAxiosInterceptors from "./api/axiosInterceptor";

import Navbar from './components/Navbar/Navbar';
import Footer from "./components/Footer/Footer";
import Home from './components/Home/Home';
import ContactPage from './components/ContactPage/ContactPage';
import Register from './components/Login/Register';
import UserUpdateForm from './components/UserProfile/EditProfile';
import UserList from './components/UserList/UserList';
import CreateEvent from './components/Event/CreateEvent';
import EventList from './components/Event/EventList';
import UpdateEvent from './components/Event/UpdateEvent';
import BookedEventsList from './components/Event/BookedEventsList';
import ViewEvent from './components/Event/ViewEvent';
import Login from './components/Login/Login';
import WeatherReport from './components/WeatherReport/WeatherReport';

import './App.css';

// Setup axios interceptor to include token
setupAxiosInterceptors();

function AppRoutes() {

  return (
    <Routes>
      {/* General paths */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/weather-report" element={<WeatherReport />} />
      {/* User paths */}
      <Route path="/register" element={<Register />} />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <UserUpdateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-user"
        element={
          <ProtectedRouteAdmin>
            <UserList />
          </ProtectedRouteAdmin>
        }
      />

      {/* Event paths */}
      <Route
        path="/create-event"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-list"
        element={
          <ProtectedRoute>
            <EventList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-event/:id"
        element={
          <ProtectedRoute>
            <ViewEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-event"
        element={
          <ProtectedRoute>
            <UpdateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booked-events"
        element={
          <ProtectedRoute>
            <BookedEventsList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <Navbar />
          <AppRoutes />
          <Footer />
        </HashRouter>
      </AuthProvider>
    </div>
  );
}

export default App;