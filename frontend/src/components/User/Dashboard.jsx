import React, { useState, useEffect, useRef } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Chart } from "react-chartjs-2";
import "./Dashboard.css";

const Dashboard = () => {
  const { companies, updateCompanyCommunication } = useCompanyContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({ type: "", date: "", notes: "" });
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState({ overdue: [], dueToday: [] });
  const [lastFiveCommunications, setLastFiveCommunications] = useState([]);
  const [nextFiveCommunications, setNextFiveCommunications] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const fullCalendarRef = useRef(null);

  // Function to check communication status
  const getCommunicationStatus = (date) => {
    const today = new Date();
    const communicationDate = new Date(date);
    if (communicationDate < today) return "overdue";
    if (communicationDate.toDateString() === today.toDateString()) return "dueToday";
    return "upcoming";
  };

  useEffect(() => {
    const uniqueEvents = [];
    const seenKeys = new Set();
    const overdueCommunications = [];
    const dueTodayCommunications = [];
    let totalCommunications = 0;

    companies?.forEach((company) => {
      company.communications?.forEach((comm) => {
        const uniqueKey = `${comm.type}-${comm.date}-${comm.notes}`;

        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);

          const communicationStatus = getCommunicationStatus(comm.date);
          if (communicationStatus === "overdue" && comm.status !== "completed") {
            overdueCommunications.push({ ...comm, companyId: company.id });
          }
          if (communicationStatus === "dueToday") {
            dueTodayCommunications.push({ ...comm, companyId: company.id });
          }

          totalCommunications++;

          uniqueEvents.push({
            title: `${comm.type || "No Type"}: ${comm.notes || "No Notes"}`,
            date: comm.date || new Date().toISOString().split("T")[0],
            backgroundColor: comm.status === "completed"
              ? "green"
              : communicationStatus === "overdue"
              ? "red"
              : "blue",
            borderColor: "black",
            textColor: "white",
            description: `${comm.type} on ${comm.date}: ${comm.notes}`,
            eventId: `${company.id}-${comm.date}-${comm.notes}`,
          });
        }
      });
    });

    setCalendarEvents(uniqueEvents);
    setNotifications({ overdue: overdueCommunications, dueToday: dueTodayCommunications });
    setLastFiveCommunications(companies.flatMap(company => company.communications.slice(-5)));
    setNextFiveCommunications(companies.flatMap(company => company.communications.slice(0, 5)));
  }, [companies]);

  // Handle click on calendar event
  const handleEventClick = (info) => {
    const eventDetails = info.event.extendedProps;
    alert(`Communication Details: ${eventDetails.description}`);
  };

  // Mark event as completed and change its color
  const handleMarkAsCompleted = (companyId, communicationIndex) => {
    const company = companies.find((company) => company.id === companyId);
    const communication = company?.communications?.[communicationIndex];

    const updatedCompanies = companies.map((company) => {
      if (company.id === companyId) {
        const updatedCommunications = company.communications.map((comm, index) => {
          if (index === communicationIndex) {
            return { ...comm, status: "completed" };
          }
          return comm;
        });
        return { ...company, communications: updatedCommunications };
      }
      return company;
    });

    updateCompanyCommunication(updatedCompanies);

    const updatedCalendarEvents = calendarEvents.map((event) => {
      if (event.eventId === `${companyId}-${communication?.date}-${communication?.notes}`) {
        return { ...event, backgroundColor: "green" };
      }
      return event;
    });

    setCalendarEvents(updatedCalendarEvents);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="notification-bell" onClick={() => setShowNotification(!showNotification)}>
          🔔
        </div>
        <button onClick={() => alert("Logout functionality to be implemented")}>
          <a href="/">Logout</a>
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <h2>Companies</h2>
          <ul>
            {companies.map((company) => (
              <li key={company.id}>
                <label>
                  <input
                    type="radio"
                    name="company-selection"
                    checked={selectedCompanyId === company.id}
                    onChange={() => setSelectedCompanyId(company.id)}
                  />
                  {company.name}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(!showModal)}>Log Communication</button>
        </div>

        <div className="dashboard-calendar">
          <h2>Communication Calendar</h2>
          <FullCalendar
            ref={fullCalendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}  // Trigger on event click
          />
        </div>

        <div className="last-communications">
          <h2>Last 5 Communications</h2>
          <ul>
            {lastFiveCommunications.map((comm, index) => (
              <li key={index}>
                {comm.type} on {comm.date} - {comm.notes}
              </li>
            ))}
          </ul>
        </div>

        <div className="next-communications">
          <h2>Next 5 Communications</h2>
          <ul>
            {nextFiveCommunications.map((comm, index) => (
              <li key={index}>
                {comm.type} on {comm.date} - {comm.notes}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for logging communication */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Log Communication</h2>
            <form onSubmit={handleCommunicationSubmit}>
              <div>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
                  required
                >
                  <option value="">Select Communication Type</option>
                  <option value="LinkedIn Post">LinkedIn Post</option>
                  <option value="LinkedIn Message">LinkedIn Message</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newCommunication.date}
                  onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={newCommunication.notes}
                  onChange={(e) => setNewCommunication({ ...newCommunication, notes: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit">Add Communication</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
