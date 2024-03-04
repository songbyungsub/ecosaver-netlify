import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css'; // 스타일 파일 임포트

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;