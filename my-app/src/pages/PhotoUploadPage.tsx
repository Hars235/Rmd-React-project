import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Smartphone } from 'lucide-react';
import './PhotoUploadPage.css';

const PhotoUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDriveUpload = () => {
    alert("Google Drive integration would open here.");
  };

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      alert(`Selected file: ${file.name}. In a real app, this would be uploaded.`);
      // Logic to actually save the photo URL to profileData would go here
      navigate(-1);
    }
  };

  return (
    <div className="rmd-photo-upload-page">
       <div className="rmd-photo-header">
          <button className="rmd-ph-back" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={24} color="#333" />
          </button>
          <span className="rmd-ph-title">Upload Photo</span>
        </div>

        <div className="rmd-upload-options">
            <button className="rmd-upload-card" onClick={handleDriveUpload}>
                <div className="rmd-upload-icon-circle">
                    <HardDrive size={32} color="#007bff" />
                </div>
                <span className="rmd-upload-label">Upload from Drive</span>
            </button>

            <label className="rmd-upload-card">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleDeviceUpload} 
                    style={{ display: 'none' }} 
                />
                <div className="rmd-upload-icon-circle">
                    <Smartphone size={32} color="#007bff" />
                </div>
                <span className="rmd-upload-label">Choose from Devices</span>
            </label>
        </div>
    </div>
  );
};

export default PhotoUploadPage;
