import React, { useState, useEffect, useRef } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
import "./Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register necessary Chart.js components and scales
ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { companies, updateCompanyCommunication } = useCompanyContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: "",
    date: "",
    notes: "",
  });
  const [notifications, setNotifications] = useState({
    overdue: [],
    dueToday: [],
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showNotification, setShowNotification] = useState(false); // State for the notification bell
  const fullCalendarRef = useRef(null);

  const getCommunicationStatus = (date) => {
    const today = new Date();
    const communicationDate = new Date(date);
    if (communicationDate < today) return "overdue";
    if (communicationDate.toDateString() === today.toDateString()) return "dueToday";
    return "upcoming";
  };

  useEffect(() => {
    const uniqueEvents = [];
    const seenKeys = new Set(); // Track unique event keys
    const overdueCommunications = []; // To collect overdue communications

    companies?.forEach((company) => {
      company.communications?.forEach((comm) => {
        const uniqueKey = `${comm.type}-${comm.date}-${comm.notes}`;

        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);

          const communicationStatus = getCommunicationStatus(comm.date);
          if (communicationStatus === "overdue") {
            overdueCommunications.push(comm); // Collect overdue communications
          }

          uniqueEvents.push({
            title: `${comm.type || "No Type"}: ${comm.notes || "No Notes"}`,
            date: comm.date || new Date().toISOString().split("T")[0],
            backgroundColor:
              communicationStatus === "overdue"
                ? "red" // Default color for overdue communications
                : communicationStatus === "completed"
                ? "green"
                : "transparent",
            borderColor: "black",
            textColor: "white",
            description: `${comm.type} on ${comm.date}: ${comm.notes}`,
            eventId: `${comm.companyId}-${comm.date}-${comm.notes}`,
          });
        }
      });
    });

    setCalendarEvents(uniqueEvents);
    setNotifications((prevState) => ({
      ...prevState,
      overdue: overdueCommunications, // Set overdue communications
    }));
  }, [companies]);

  useEffect(() => {
    const communicationFrequency = {
      "LinkedIn Post": 0,
      Email: 0,
      "Phone Call": 0,
      Other: 0,
    };
    companies?.forEach((company) => {
      company.communications?.forEach((comm) => {
        if (communicationFrequency[comm.type] !== undefined) {
          communicationFrequency[comm.type]++;
        } else {
          communicationFrequency["Other"]++;
        }
      });
    });

    setChartData({
      labels: Object.keys(communicationFrequency),
      datasets: [
        {
          label: "Communication Frequency",
          data: Object.values(communicationFrequency),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [companies]);

  const handleMarkAsCompleted = (companyId, communicationIndex) => {
    const updatedCompanies = companies.map((company) => {
      if (company.id === companyId) {
        const updatedCommunications = company.communications.map((comm, index) => {
          if (index === communicationIndex) {
            const updatedComm = { ...comm, status: "completed" }; // Mark as completed
            return updatedComm;
          }
          return comm;
        });
        return { ...company, communications: updatedCommunications };
      }
      return company;
    });
  
    // Remove the completed communication from overdue notifications
    const updatedOverdue = notifications.overdue.filter((comm, index) => index !== communicationIndex);
  
    setNotifications((prevState) => ({
      ...prevState,
      overdue: updatedOverdue, // Update overdue list
    }));
  
    // If there are no overdue communications left, hide notification bell
    if (updatedOverdue.length === 0) {
      setShowNotification(false); // Hide notification bell
    }
  
    updateCompanyCommunication(updatedCompanies); // Update company communications
  
    // Update calendar event status for the completed communication
    const updatedCalendarEvents = calendarEvents.map((event) => {
      if (event.eventId === `${companyId}-${companies[companyId]?.communications[communicationIndex]?.date}-${companies[companyId]?.communications[communicationIndex]?.notes}`) {
        return { ...event, backgroundColor: "green", classNames: ["completed"] }; // Mark event as completed
      }
      return event;
    });
  
    setCalendarEvents(updatedCalendarEvents); // Update calendar events state
  };
  

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  const handleCommunicationSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!newCommunication.type || !newCommunication.date || !newCommunication.notes) {
      alert("Please fill in all fields.");
      return;
    }

    if (isNaN(new Date(newCommunication.date).getTime())) {
      alert("Invalid date provided.");
      return;
    }

    const updatedCompanies = companies.map((company) => {
      if (company.id === selectedCompanyId) {
        return {
          ...company,
          communications: [
            ...(company.communications || []),
            { ...newCommunication, highlight: "upcoming" },
          ],
        };
      }
      return company;
    });

    updateCompanyCommunication(updatedCompanies);

    setShowModal(false);
    setNewCommunication({ type: "", date: "", notes: "" });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="notification-bell" onClick={handleNotificationClick}>
          🔔
        </div>
      </header>

      {showNotification && notifications.overdue.length === 0 && (
        <div className="no-overdue-notifications">
          There are no overdue communications.
        </div>
      )}

      {showNotification && notifications.overdue.length > 0 && (
        <div className="overdue-notifications-list">
          <h3>Overdue Communications:</h3>
          <ul>
            {notifications.overdue.map((comm, index) => (
              <li key={index}>
                {comm.type} on {comm.date} - {comm.notes}
                <button
                  onClick={() => handleMarkAsCompleted(comm.companyId, index)}
                >
                  Mark as Completed
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
            eventMouseEnter={(info) => {
              const tooltip = document.createElement("div");
              tooltip.className = "tooltip-content";
              tooltip.innerText = info.event.extendedProps.description;
              document.body.appendChild(tooltip);
              tooltip.style.position = "absolute";
              tooltip.style.left = `${info.jsEvent.pageX}px`;
              tooltip.style.top = `${info.jsEvent.pageY + 10}px`;
              tooltip.style.backgroundColor = "#333";
              tooltip.style.color = "#fff";
              tooltip.style.padding = "5px 10px";
              tooltip.style.borderRadius = "5px";
            }}
            eventMouseLeave={() => {
              document.querySelectorAll(".tooltip-content").forEach((el) => el.remove());
            }}
          />
        </div>

        <div className="dashboard-statistics">
          <h2>Statistics</h2>
          <div className="statistics-item">
            <h3>Total Communications</h3>
            <p>{companies.reduce((total, company) => total + (company.communications?.length || 0), 0)}</p>
          </div>
          <div className="statistics-item">
            <h3>Overdue Communications</h3>
            <p>{notifications.overdue.length}</p>
          </div>
          <div className="statistics-item">
            <h3>Due Today Communications</h3>
            <p>{notifications.dueToday.length}</p>
          </div>
        </div>

        <div className="dashboard-chart">
          <h2>Communication Frequency Chart</h2>
          <Chart
            type="bar"
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Communication Frequency by Type" },
              },
            }}
          />
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Log Communication</h2>
            <form onSubmit={handleCommunicationSubmit}>
              <div>
                <label htmlFor="type">Type</label>
                <input
                  type="text"
                  id="type"
                  value={newCommunication.type}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, type: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newCommunication.date}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={newCommunication.notes}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, notes: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Submit</button>
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
