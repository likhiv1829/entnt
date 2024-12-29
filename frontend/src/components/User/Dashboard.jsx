import React, { useState, useEffect } from "react";
import { useCompanyContext } from '../../context/CompanyContext'; // Correct path
import "./Dashboard.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";

// Register necessary Chart.js components and scales
ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { companies, updateCompanyCommunication, addCompany } = useCompanyContext(); // Fetch companies and the update function from context
  const [selectedCompanies, setSelectedCompanies] = useState([]);
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
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [chartData, setChartData] = useState({
    labels: ["LinkedIn Post", "Email", "Phone Call", "Other"],
    datasets: [
      {
        label: "Communication Frequency",
        data: [12, 5, 8, 2],
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

  // Fetch and set notifications for overdue and due communications
  useEffect(() => {
    const overdue = [];
    const dueToday = [];
    companies.forEach((company) => {
      company.communications?.forEach((comm) => {
        const status = getCommunicationStatus(comm.date);
        if (status === "overdue" && comm.highlight !== "completed") {
          if (!overdue.some((c) => c.id === company.id)) overdue.push(company);
        } else if (status === "dueToday") {
          if (!dueToday.some((c) => c.id === company.id)) dueToday.push(company);
        }
      });
    });
    setNotifications({ overdue, dueToday });
  }, [companies]);

  const getCommunicationStatus = (date) => {
    const today = new Date();
    const communicationDate = new Date(date);
    if (communicationDate < today) return "overdue";
    if (communicationDate.toDateString() === today.toDateString()) return "dueToday";
    return "upcoming";
  };

  const handleSelectCompany = (id) => {
    setSelectedCompanies((prevState) =>
      prevState.includes(id) ? prevState.filter((companyId) => companyId !== id) : [...prevState, id]
    );
  };

  const handleModalToggle = () => setShowModal(!showModal);

  const handleCommunicationSubmit = () => {
    // Handle communication submission logic
    if (newCommunication.type && newCommunication.date && newCommunication.notes) {
      const updatedCompanies = companies.map((company) => {
        if (selectedCompanies.includes(company.id)) {
          return {
            ...company,
            communications: [
              ...company.communications,
              {
                ...newCommunication,
                highlight: "upcoming", // Default to upcoming highlight
              },
            ],
          };
        }
        return company;
      });
      updateCompanyCommunication(updatedCompanies); // Update companies with new communication
      setShowModal(false);
      setSelectedCompanies([]);
      setNewCommunication({ type: "", date: "", notes: "" }); // Clear modal fields
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleMarkAsCompleted = (companyId, communicationIndex) => {
    const updatedCompanies = companies.map((company) => {
      if (company.id === companyId) {
        const updatedCommunications = company.communications.map((comm, index) => {
          if (index === communicationIndex) {
            return { ...comm, highlight: "completed" };
          }
          return comm;
        });
        return { ...company, communications: updatedCommunications };
      }
      return company;
    });
    updateCompanyCommunication(updatedCompanies); // Update the communication status
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
      </header>

      <div className="dashboard-content">
        {/* Sidebar - List of Companies */}
        <div className="dashboard-sidebar">
          <h2>Companies</h2>
          <ul>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <li key={company.id}>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company.id)}
                    onChange={() => handleSelectCompany(company.id)}
                  />
                  {company.name}
                  <button onClick={() => setSelectedCompanyId(company.id)}>View Overdue Communications</button>
                </li>
              ))
            ) : (
              <p>No companies available</p>
            )}
          </ul>
          <button onClick={handleModalToggle}>Log Communication</button>
        </div>

        {/* Notifications */}
        <div className="dashboard-notifications">
          <h2>Notifications</h2>
          <div>
            <h3>Overdue Communications</h3>
            {notifications.overdue.length === 0 ? (
              <p>No overdue communications</p>
            ) : (
              <ul>
                {notifications.overdue.map((company, index) => (
                  <li key={index} className="overdue">
                    {company.name}
                    <button onClick={() => setSelectedCompanyId(company.id)}>View Overdue Communications</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Today's Communications</h3>
            <ul>
              {notifications.dueToday.map((company, index) => (
                <li key={index} className="dueToday">{company.name}</li>
              ))}
            </ul>
          </div>

          {selectedCompanyId && (
            <div>
              <h3>Overdue Communications for {companies.find((c) => c.id === selectedCompanyId)?.name}</h3>
              <ul>
                {companies
                  .find((c) => c.id === selectedCompanyId)
                  ?.communications?.filter((comm) => comm.highlight === "overdue")
                  .map((comm, index) => (
                    <li key={index} className="overdue">
                      <p>{comm.type} - {comm.date}</p>
                      <p>{comm.notes}</p>
                      <button onClick={() => handleMarkAsCompleted(selectedCompanyId, index)}>
                        Mark as Completed
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="dashboard-main">
          <h2>Calendar</h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            events={companies?.flatMap((company) =>
              company.communications?.filter((comm) => comm.highlight !== "upcoming")
                .map((comm) => ({
                  title: `${comm.type}: ${comm.notes}`,
                  date: comm.date,
                  backgroundColor: comm.highlight === "overdue" ? "red" : comm.highlight === "completed" ? "green" : "transparent",
                  borderColor: "black",
                  textColor: "white",
                }))
            ) || []}
            initialView="dayGridMonth"
          />
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">
          <h2>Statistics</h2>
          <Chart
            type="bar"
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Modal for Logging Communication */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Log New Communication</h2>
            <label>
              Type of Communication:
              <select
                value={newCommunication.type}
                onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
              >
                <option value="LinkedIn Post">LinkedIn Post</option>
                <option value="Email">Email</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </label>
            <label>
              Date of Communication:
              <input
                type="date"
                value={newCommunication.date}
                onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
              />
            </label>
            <label>
              Notes:
              <textarea
                value={newCommunication.notes}
                onChange={(e) => setNewCommunication({ ...newCommunication, notes: e.target.value })}
              />
            </label>
            <button onClick={handleCommunicationSubmit}>Submit</button>
            <button onClick={handleModalToggle}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
