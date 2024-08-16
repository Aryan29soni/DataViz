import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const useFileContext = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addUploadedFile = (file) => {
    setUploadedFiles([...uploadedFiles, file]);
  };

  const deleteUploadedFile = (file) => {
    const updatedFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(updatedFiles);
  };

  return (
    <FileContext.Provider value={{ uploadedFiles, addUploadedFile, deleteUploadedFile }}>
      {children}
    </FileContext.Provider>
  );
};
