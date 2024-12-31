import React, { useState, useEffect, useRef } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
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
import "./Dashboard.css";

// Register Chart.js components and scales
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
  const [showNotification, setShowNotification] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCommunications: 0,
    overdueCommunications: 0,
    dueTodayCommunications: 0,
  });
  const [hoveredEvent, setHoveredEvent] = useState(null); // For storing the hovered event details
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
            backgroundColor:
              comm.status === "completed"
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
    setNotifications((prevState) => ({
      ...prevState,
      overdue: overdueCommunications,
      dueToday: dueTodayCommunications,
    }));

    setStatistics({
      totalCommunications,
      overdueCommunications: overdueCommunications.length,
      dueTodayCommunications: dueTodayCommunications.length,
    });
  }, [companies]);

  useEffect(() => {
    const communicationFrequency = {
      "LinkedIn Post": 0,
      "LinkedIn Message": 0,
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
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [companies]);

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

    // Update overdue communications
    const updatedOverdue = notifications.overdue.filter(
      (comm) =>
        !(
          comm.companyId === companyId &&
          comm.date === communication?.date &&
          comm.notes === communication?.notes
        )
    );

    setNotifications((prevState) => ({
      ...prevState,
      overdue: updatedOverdue,
    }));

    // Hide notification bell if no overdue communications left
    if (updatedOverdue.length === 0) {
      setShowNotification(false);
    }

    // Update calendar events to reflect completion
    const updatedCalendarEvents = calendarEvents.map((event) => {
      if (
        event.eventId === `${companyId}-${communication?.date}-${communication?.notes}`
      ) {
        return { ...event, backgroundColor: "green", classNames: ["completed"] };
      }
      return event;
    });

    setCalendarEvents(updatedCalendarEvents);
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  const handleCommunicationSubmit = (e) => {
    e.preventDefault();
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
            { ...newCommunication, highlight: "upcoming", status: "pending" },
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
        <button onClick={() => alert("Logout functionality to be implemented")}>
          <a href="/">Logout</a>
        </button>
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
        <div className="stats">
          <label>Analysis</label>
            <p>Total Communications: {statistics.totalCommunications}</p>
            <p>Overdue Communications: {statistics.overdueCommunications}</p>
            <p>Due Today Communications: {statistics.dueTodayCommunications}</p>
        </div>

        <div className="dashboard-calendar">
          <h2>Communication Calendar</h2>
          <FullCalendar
            ref={fullCalendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
          />
        </div>

        <div className="dashboard-statistics">
          <h2>Statistics</h2>
          
          <Chart
            type="bar"
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Communication Frequency" },
              },
              scales: {
                x: { title: { display: true, text: "Communication Type" } },
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
                <select
                  id="type"
                  value={newCommunication.type}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, type: e.target.value })
                  }
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
