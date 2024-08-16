// src/components/Databases.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import styled from 'styled-components';
import { FaFileExcel, FaDownload, FaTrash, FaChartBar, FaFileWord, FaFilePdf, FaFileCsv, FaFile,FaDatabase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DocumentComparison from './DocumentComparison';

const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const FileCard = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
`;

const FileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const FileName = styled.p`
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const FileActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ActionButton = styled.button`
  background: #007bff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  color: white;
  transition: background 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
`;

const CompareButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background: #218838;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const DatabasesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOriginalFileName = (fullFileName) => {
    const nameParts = fullFileName.split('-');
    return nameParts.slice(0, -1).join('-') + '.' + fullFileName.split('.').pop();
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`/auth/download-file/${fileName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await axios.delete(`/auth/delete-file/${fileName}`);
        setFiles(files.filter((file) => file.fileName !== fileName));
        setSelectedFiles(selectedFiles.filter(f => f !== fileName));
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleGenerateDashboard = (fileName) => {
    navigate(`/dashboard/${fileName}`);
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <FaFile color="#808080" />;
    
    if (mimeType.includes('word')) return <FaFileWord color="#2b579a" />;
    if (mimeType === 'application/pdf') return <FaFilePdf color="#f40f02" />;
    if (mimeType === 'text/csv') return <FaFileCsv color="#217346" />;
    if (mimeType.includes('spreadsheetml') || mimeType === 'application/vnd.ms-excel') return <FaFileExcel color="#217346" />;
    if (mimeType === 'application/sql' || mimeType === 'text/plain') return <FaDatabase color="#f29111" />;
    
    return <FaFile color="#808080" />;
  };

  const toggleFileSelection = (fileName) => {
    setSelectedFiles(prev => 
      prev.includes(fileName)
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Title>Uploaded Files</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      {loading ? (
        <LoadingMessage>Loading...</LoadingMessage>
      ) : (
        <>
          <FileGrid>
            {filteredFiles.map((file, index) => (
              <FileCard key={index}>
                <FileIcon>{getFileIcon(file.mimeType)}</FileIcon>
                <FileName title={file.fileName}>{getOriginalFileName(file.fileName)}</FileName>
                <FileActions>
                  <ActionButton onClick={() => handleDownload(file.fileName)} title="Download">
                    <FaDownload />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(file.fileName)} title="Delete">
                    <FaTrash />
                  </ActionButton>
                  <ActionButton onClick={() => handleGenerateDashboard(file.fileName)} title="Generate Dashboard">
                    <FaChartBar />
                  </ActionButton>
                </FileActions>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.fileName)}
                    onChange={() => toggleFileSelection(file.fileName)}
                  />
                  Select for comparison
                </CheckboxLabel>
              </FileCard>
            ))}
          </FileGrid>
          
          {selectedFiles.length > 1 && (
            <CompareButton onClick={() => setShowComparison(true)}>
              Compare Selected Files
            </CompareButton>
          )}
          
          {showComparison && (
            <DocumentComparison fileNames={selectedFiles} />
          )}
        </>
      )}
    </PageContainer>
  );
};

export default DatabasesPage;