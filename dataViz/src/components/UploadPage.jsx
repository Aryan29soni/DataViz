import React, { useRef, useState } from 'react';
import axios from '../utils/axios';
import './UploadPage.css';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from '../FileContext';import { toast } from 'react-toastify';  

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { addUploadedFile } = useFileContext();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFileName(file.name);
        addUploadedFile(response.data);
        setErrorMessage('');
        console.log('File uploaded successfully:', response.data);
        toast.success(`File "${file.name}" uploaded successfully!`);
      } catch (error) {
        console.error('Error uploading file:', error.response?.data || error.message);
        if (error.response && error.response.status === 409) {
          setErrorMessage(error.response.data.message || 'A database file already exists. Please delete the existing one before uploading a new database.');
        } else {
          setErrorMessage('An error occurred while uploading the file. Please try again.');
        }
      }
    }
  };

  return (
    <div className="upload-page-container">
      <div className="upload-card">
        <div className="upload-info">
          <h2>Upload Guidelines</h2>
          <ul>
            <li>Supported file types: Word, PDF, CSV, SQL</li>
            <li>Max file size: 10MB</li>
            <li>Only one database file (SQL) can be uploaded at a time</li>
          </ul>
        </div>
        <div className="upload-gif-container">
          <img src="/images/reportGIF.gif" alt="Uploading..." className="upload-gif" />
          <button className="upload-button" onClick={handleUploadClick}>
            <span className="upload-icon">⬆️</span> Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".docx,.pdf,.csv,.sql"
            onChange={handleFileChange}
          />
          {fileName && !errorMessage && (
            <div className="upload-success">
              "{fileName}" has been uploaded successfully <FaCheckCircle className="success-icon" />
            </div>
          )}
          {errorMessage && (
            <div className="upload-error">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;