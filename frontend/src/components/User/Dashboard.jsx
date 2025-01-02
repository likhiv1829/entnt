import React, { useState, useEffect } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Dashboard.css";

const Dashboard = () => {
  const { companies, updateCompanyCommunication } = useCompanyContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [companyCommunications, setCompanyCommunications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState({ overdue: [], dueToday: [] });

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

    companies?.forEach((company) => {
      if (company?.communications) {
        company.communications.forEach((comm) => {
          const uniqueKey = `${comm.type}-${comm.date}-${comm.description}`;

          if (!seenKeys.has(uniqueKey)) {
            seenKeys.add(uniqueKey);

            const communicationStatus = getCommunicationStatus(comm.date);
            if (communicationStatus === "overdue" && comm.status !== "completed") {
              overdueCommunications.push({ ...comm, companyId: company._id });
            }
            if (communicationStatus === "dueToday") {
              dueTodayCommunications.push({ ...comm, companyId: company._id });
            }

            uniqueEvents.push({
              title: `${comm.type || "No Type"}: ${comm.description || "No Notes"}`,
              date: comm.date || new Date().toISOString().split("T")[0],
              backgroundColor: comm.status === "completed"
                ? "green"
                : communicationStatus === "overdue"
                ? "red"
                : "blue",
              borderColor: "black",
              textColor: "white",
              description: `${comm.type} on ${comm.date}: ${comm.description}`,
              companyName: company.name,
              eventId: `${company._id}-${comm.date}-${comm.description}`,
            });
          }
        });
      }
    });

    setCalendarEvents(uniqueEvents);
    setNotifications({ overdue: overdueCommunications, dueToday: dueTodayCommunications });
  }, [companies]);

  useEffect(() => {
    if (selectedCompanyId !== null) {
      const selectedCompany = companies.find((company) => company._id === selectedCompanyId);
      if (selectedCompany) {
        setCompanyCommunications(selectedCompany.communications || []);
      }
    }
  }, [selectedCompanyId, companies]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  
  const handleEventClick = (info) => {
    const event = info.event.extendedProps;
    setEventDetails({
      companyName: event.companyName,
      description: event.description,
    });
    setShowEventModal(true);
  };
  


  const handleMarkAsCompleted = (companyId, communicationIndex) => {
    const company = companies.find((company) => company._id === companyId);
    if (!company || !company.communications) return;

    const communication = company.communications[communicationIndex];

    const updatedCompany = { ...company };
    updatedCompany.communications = company.communications.map((comm, index) => {
      if (index === communicationIndex) {
        return { ...comm, status: "completed" };
      }
      return comm;
    });

    const updatedCompanies = companies.map((comp) => 
      comp.id === companyId ? updatedCompany : comp
    );

    updateCompanyCommunication(updatedCompanies);

    const updatedCalendarEvents = calendarEvents.map((event) => {
      if (event.eventId === `${companyId}-${communication.date}-${communication.description}`) {
        return { ...event, backgroundColor: "green" };
      }
      return event;
    });

    setCalendarEvents(updatedCalendarEvents);
  };

  const handleShowCommunications = () => {
    const selectedCompany = companies.find((company) => company._id === selectedCompanyId);
    if (selectedCompany) {
      setCompanyCommunications(selectedCompany.communications || []);
      setShowModal(true);
    }
  };

  const handleNotificationModal = () => {
    setShowNotificationModal(!showNotificationModal);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="notification-bell" onClick={handleNotificationModal}>
          🔔
          {notifications.overdue.length > 0 || notifications.dueToday.length > 0 ? (
            <span className="notification-badge">{notifications.overdue.length + notifications.dueToday.length}</span>
          ) : null}
        </div>
        <button onClick={() => alert("Click ok to logout.")}>
          <a href="/">Logout</a>
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <h2>Companies</h2>
          <ul>
            {companies.map((company) => (
              <li key={company._id}>
                <label>
                  <input
                    type="radio"
                    name="company-selection"
                    checked={selectedCompanyId === company._id}
                    onChange={() => setSelectedCompanyId(company._id)}
                  />
                  {company.name}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleShowCommunications}>Communications Performed</button>
        </div>

        <div className="dashboard-calendar">
          <h2>Communication Calendar</h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
          />
        </div>

        <div className="last-communications">
          <h2>Last 5 Communications</h2>
          <ul>
            {companyCommunications
              .slice(-5)
              .map((comm, index) => (
                <li key={index}>
                  {comm.type} on {comm.date} - {comm.description}
                  {comm.status === "completed" && <span> (Completed)</span>}
                </li>
              ))}
          </ul>
        </div>

        <div className="next-communications">
          <h2>Next 5 Communications</h2>
          <ul>
            {companyCommunications
              .slice(0, 5)
              .map((comm, index) => (
                <li key={index}>
                  {comm.type} on {comm.date} - {comm.description}
                  {comm.status === "completed" && <span> (Completed)</span>}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="notification-modal">
          <div className="modal-content">
            <h2>Notifications</h2>
            <h3>Overdue Communications</h3>
            <ul>
              {notifications.overdue.length === 0 ? (
                <p>No overdue communications</p>
              ) : (
                notifications.overdue.map((comm, index) => (
                  <li key={index}>
                    {comm.type} on {comm.date} - {comm.description}
                  </li>
                ))
              )}
            </ul>
            <h3>Due Today Communications</h3>
            <ul>
              {notifications.dueToday.length === 0 ? (
                <p>No communications due today</p>
              ) : (
                notifications.dueToday.map((comm, index) => (
                  <li key={index}>
                    {comm.type} on {comm.date} - {comm.description}
                  </li>
                ))
              )}
            </ul>
            <button onClick={handleNotificationModal}>Close Notifications</button>
          </div>
        </div>
      )}
      {showEventModal && eventDetails && (
  <div className="modal">
    <div className="modal-content">
      <h2>Communication Details</h2>
      <p><strong>Company:</strong> {eventDetails.companyName}</p>
      <p><strong>Description:</strong> {eventDetails.description}</p>
      <button onClick={() => setShowEventModal(false)}>Close</button>
    </div>
  </div>
)}

      {/* Communication Performed Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Communications for {companies.find(company => company._id === selectedCompanyId)?.name}</h2>
            {companyCommunications.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companyCommunications.map((comm, index) => (
                    <tr key={index}>
                      <td>{comm.type}</td>
                      <td>{comm.date}</td>
                      <td>{comm.description}</td>
                      <td>
                        {comm.status !== "completed" && getCommunicationStatus(comm.date) === "overdue" ? (
                          <button onClick={() => handleMarkAsCompleted(selectedCompanyId, index)}>Mark as Complete</button>
                        ) : (
                          <span>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No communications done yet</p>
            )}
            <button type="button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
