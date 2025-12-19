import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EditableProfileRow from '../components/EditableProfileRow';
import './ProfilePage.css';

type TabType = 'Personal' | 'Medical' | 'Lifestyle';

// ProfileData interface matches App.tsx
export interface ProfileData {
  userName: string;
  contactNumber: string;
  email: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  maritalStatus: string;
  height: string;
  weight: string;
  emergencyContact: string;
  location: string;
  
  // Medical
  allergies: string;
  currentMeds: string;
  pastMeds: string;
  chronicDiseases: string;
  injuries: string;
  surgeries: string;

  // Lifestyle
  smoking: string;
  alcohol: string;
  activityLevel: string;
  foodPreference: string;
  occupation: string;
}

interface ProfilePageProps {
  data: ProfileData;
  onUpdate: (field: keyof ProfileData, value: string) => void;
  completion: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ data, onUpdate, completion }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Personal');

  // Local update wrapper to match signature if needed, or just use onUpdate directly
  // But the render methods use 'updateField' name.
  const updateField = onUpdate;

  const renderPersonalTab = () => (
    <>
      <div className="rmd-field-row" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="rmd-field-label" style={{ fontSize: '13px' }}>Name</span>
             <input 
                className="rmd-editable-input" 
                value={data.userName} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('userName', e.target.value)}
                style={{ fontSize: '16px', fontWeight: 500, borderBottom: '1px dashed #ccc' }}
             />
        </div>
        <button className="rmd-add-photo-btn" onClick={() => navigate('/profile/upload-photo')}>
          add<br/>photo
        </button>
      </div>

      <EditableProfileRow label="Contact Number" value={data.contactNumber} onSave={(v: string) => updateField('contactNumber', v)} />
      <EditableProfileRow label="Email Id" value={data.email} onSave={(v: string) => updateField('email', v)} placeholder="Add email" />
      <EditableProfileRow label="Gender" value={data.gender} onSave={(v: string) => updateField('gender', v)} placeholder="Add gender" />
      <EditableProfileRow label="Date of Birth" value={data.dob} onSave={(v: string) => updateField('dob', v)} placeholder="yyyy mm dd" />
      <EditableProfileRow label="Blood Group" value={data.bloodGroup} onSave={(v: string) => updateField('bloodGroup', v)} placeholder="add blood group" />
      <EditableProfileRow label="Marital Status" value={data.maritalStatus} onSave={(v: string) => updateField('maritalStatus', v)} placeholder="add marital status" />
      <EditableProfileRow label="Height" value={data.height} onSave={(v: string) => updateField('height', v)} placeholder="add height" />
      <EditableProfileRow label="Weight" value={data.weight} onSave={(v: string) => updateField('weight', v)} placeholder="add weight" />
      <EditableProfileRow label="Emergency Contact" value={data.emergencyContact} onSave={(v: string) => updateField('emergencyContact', v)} placeholder="add emergency details" />
      <EditableProfileRow label="Location" value={data.location} onSave={(v: string) => updateField('location', v)} placeholder="add details" isLast />
    </>
  );

  const renderMedicalTab = () => (
    <>
      <EditableProfileRow label="Allergies" value={data.allergies} onSave={(v: string) => updateField('allergies', v)} placeholder="add allergies" />
      <EditableProfileRow label="Current Medications" value={data.currentMeds} onSave={(v: string) => updateField('currentMeds', v)} placeholder="add medications" />
      <EditableProfileRow label="Past Medications" value={data.pastMeds} onSave={(v: string) => updateField('pastMeds', v)} placeholder="add medications" />
      <EditableProfileRow label="Chronic Diseases" value={data.chronicDiseases} onSave={(v: string) => updateField('chronicDiseases', v)} placeholder="add disease" />
      <EditableProfileRow label="Injuries" value={data.injuries} onSave={(v: string) => updateField('injuries', v)} placeholder="add incident" />
      <EditableProfileRow label="Surgeries" value={data.surgeries} onSave={(v: string) => updateField('surgeries', v)} placeholder="add surgeries" isLast />
    </>
  );

  const renderLifestyleTab = () => (
    <>
       <EditableProfileRow label="Smoking Habits" value={data.smoking} onSave={(v: string) => updateField('smoking', v)} placeholder="add details" />
       <EditableProfileRow label="Alcohol consumption" value={data.alcohol} onSave={(v: string) => updateField('alcohol', v)} placeholder="add details" />
       <EditableProfileRow label="Activity level" value={data.activityLevel} onSave={(v: string) => updateField('activityLevel', v)} placeholder="add details" />
       <EditableProfileRow label="Food Preference" value={data.foodPreference} onSave={(v: string) => updateField('foodPreference', v)} placeholder="add lifestyle" />
       <EditableProfileRow label="Occupation" value={data.occupation} onSave={(v: string) => updateField('occupation', v)} placeholder="add occupation" isLast />
    </>
  );

  return (
    <div className="rmd-profile-page">
      <div className="rmd-profile-container">
        {/* Header */}
        <div className="rmd-profile-header">
          <div className="rmd-ph-top">
            <button className="rmd-ph-back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={24} color="white" />
            </button>
            <span className="rmd-ph-title">{data.userName}</span>
          </div>

          {/* Tabs */}
          <div className="rmd-profile-tabs">
            {['Personal', 'Medical', 'Lifestyle'].map((tab) => (
                <button 
                key={tab}
                className={`rmd-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab as TabType)}
                >
                {tab}
                </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="rmd-profile-content">
          {activeTab === 'Personal' && renderPersonalTab()}
          {activeTab === 'Medical' && renderMedicalTab()}
          {activeTab === 'Lifestyle' && renderLifestyleTab()}
        </div>

        {/* Footer */}
        <div className="rmd-profile-footer">
            <button 
                className="rmd-complete-btn"
                onClick={() => alert("Profile data has been saved! You can close this page and come back later.")}
            >
                Complete profile
                <span className="rmd-complete-sub">{completion}% completed</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
