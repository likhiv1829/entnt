import React, { useState, useEffect } from 'react';

function ViewReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reports from backend (replace the URL with your actual backend URL)
    fetch('/api/reports')
      .then((response) => response.json())
      .then((data) => {
        setReports(data);  // Set the fetched reports in state
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
        setLoading(false);  // Stop loading in case of error
      });
  }, []);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (reports.length === 0) {
    return <p>No reports available.</p>;
  }

  return (
    <div className="view-reports">
      <h3>Reports</h3>
      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Title</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.title}</td>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleViewReport(report.id)}>View</button>
                {/* Add more actions like delete, download, etc. */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleViewReport(reportId) {
    // Logic to view report details (you can open a modal or navigate to another page)
    console.log(`View report with ID: ${reportId}`);
  }
}

export default ViewReports;
