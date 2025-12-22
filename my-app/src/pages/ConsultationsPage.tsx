
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoConsultPage from './VideoConsultPage';
import './ConsultationsPage.css';

// SVGs or Images can be replaced with actual assets or Lucide icons
import { ArrowLeft } from 'lucide-react';

const ConsultationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'free' | 'paid'>('free');
  // Lifted state
  const [consultationType, setConsultationType] = useState<'in-clinic' | 'off-clinic' | 'video'>('in-clinic');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const navigate = useNavigate();

  // Handle Tab Switching
  // Tab Order: Free -> Paid
  const renderContent = () => {
    
    if (activeTab === 'free') {
      return showQuestionForm ? (
        <AskQuestionForm onBack={() => setShowQuestionForm(false)} />
      ) : (
        <FreeConsultationEmptyState onAskClick={() => setShowQuestionForm(true)} />
      );
    }

    // Default: Paid Tab
    return <PaidConsultationHome consultationType={consultationType} />;
  };

  return (
    <div className="consultations-page">
      <div className="consultations-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
        </button>
        <h1>Online consultations</h1>
      </div>

      <div className="consultations-tabs">
        <button 
          className={`tab-btn ${activeTab === 'free' ? 'active' : ''}`} 
          onClick={() => setActiveTab('free')}
        >
          Free
        </button>
        
        {/* Paid Tab with integrated Dropdown */}
        <div 
          className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveTab('paid')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          {activeTab === 'paid' ? (
             <select 
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value as any)}
                className="tab-header-dropdown"
                onClick={(e) => e.stopPropagation()} // Prevent tab click toggle if necessary
             >
                <option value="in-clinic">In-clinic</option>
                <option value="off-clinic">Off-clinic</option>
                <option value="video">Video Consultant</option>
             </select>
          ) : (
             <span>Paid</span>
          )}
        </div>
      </div>

      <div className="consultations-content">
        {renderContent()}
      </div>
    </div>
  );
};

// --- Sub-Components ---

// Updated to accept props
const PaidConsultationHome = ({ consultationType }: { consultationType: 'in-clinic' | 'off-clinic' | 'video' }) => {
  return (
    <div className="paid-tab-container">
      {/* Selector removed from here as it is now in the header */}

      {consultationType === 'in-clinic' && (
        <div className="paid-hero">
           <div className="paid-hero-image-wrapper">
               <img src="/images/consult/consult_hero.png" alt="Doctor Illustration" className="paid-hero-img" onError={(e) => e.currentTarget.style.display='none'} />
               <div className="paid-hero-fallback-visual">
                  👩‍⚕️ 💬
               </div>
           </div>
           
           <h2>Get Well. Online.</h2>
           <p className="paid-hero-desc">
             Skip the traffic and waiting rooms.<br/>
             Get an expert medical opinion using online consultation without disrupting your daily life
           </p>
        </div>
      )}

      {consultationType === 'off-clinic' && (
          <div className="paid-hero">
              <div className="paid-hero-fallback-visual">
                  🏥
              </div>
              <h2>Off-clinic Consultation</h2>
              <p className="paid-hero-desc">
                  Visit our clinic for a physical examination.<br/>
                  Get personalized care and direct interaction with our specialists.
              </p>
          </div>
      )}

      {consultationType === 'video' && (
        <div className="video-consult-section">
            <VideoConsultPage />
        </div>
      )}
    </div>
  );
};

const FreeConsultationEmptyState = ({ onAskClick }: { onAskClick: () => void }) => {
  return (
    <div className="free-tab-empty">
      <div className="empty-state-icon">
        <div className="question-mark-circle">?</div>
        <div className="dots">...</div>
      </div>
      <h3>You havent asked any queries yet,</h3>
      <p>Ask a question now!</p>
      
      <button className="btn-primary ask-btn" onClick={onAskClick}>
        Ask a free question
      </button>
    </div>
  );
};

const AskQuestionForm = ({ onBack }: { onBack: () => void }) => {
    const handleSubmit = () => {
        alert("Your free question has been sent to your doctor!");
        onBack(); // Optional: Go back to the main list after submit
    };

    return (
        <div className="ask-question-form">
            <div className="form-header">
                <button onClick={onBack} className="form-back-link">
                    <ArrowLeft size={20} /> Back
                </button>
                <h3>Ask free question</h3>
                <button className="submit-btn" onClick={handleSubmit}>SUBMIT</button>
            </div>
            
            <div className="form-group">
                <label>For</label>
                <select className="form-select">
                    <option>Select a profile</option>
                    <option>Myself</option>
                    <option>Family Member</option>
                </select>
            </div>

            <div className="form-group">
                <label>Problem type</label>
                <select className="form-select">
                    <option>Treatment pref.</option>
                    <option>General Query</option>
                </select>
            </div>

            <div className="form-group">
                <label>Title (min 10 chars)</label>
                <input type="text" className="form-input" placeholder="Title" />
                <span className="char-count">0/40</span>
            </div>

            <div className="form-group">
                <label>Description (min 100 chars)</label>
                <textarea className="form-textarea" placeholder="Description"></textarea>
                <span className="char-count">0/1000</span>
            </div>
             
             <div className="form-attachments">
                {/* Attachment icon placeholder */}
                <button className="attach-btn">📎</button>
             </div>
        </div>
    )
}


export default ConsultationsPage;
