import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/auth/files');
      const imageReports = response.data.filter(file => file.endsWith('.png'));
      setReports(imageReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleView = async (fileName) => {
    try {
      const response = await axios.get(`/auth/download-file/${fileName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const imageWindow = window.open();
      const img = new Image();
      img.src = url;
      img.style.maxWidth = '100%';
      imageWindow.document.body.appendChild(img);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="reports">
      <h2>Reports Page</h2>
      <p>Here are all the previously created reports:</p>
      <button onClick={fetchReports} className="refresh-button">Refresh Reports</button>
      {isLoading ? (
        <p>Loading reports...</p>
      ) : reports.length > 0 ? (
        <ul className="report-list">
          {reports.map((report, index) => (
            <li key={index} className="report-item">
              <span>{report}</span>
              <button onClick={() => handleView(report)}>View</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default Reports;
