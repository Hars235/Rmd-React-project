import React, { useState } from 'react';
import { 
  Search, 
  Stethoscope, 
  Smile, 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Ear,
  Eye,
  Syringe,
  Activity,
  Pill
} from 'lucide-react';
import './AppointmentsPage.css';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  filterValue: string;
  icon: React.ReactNode;
}

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categories: Category[] = [
    { id: 'general', name: 'General Physician', filterValue: 'General Physician', icon: <Stethoscope size={32} /> },
    { id: 'skin', name: 'Skin & Hair', filterValue: 'Dermatologist', icon: <Smile size={32} /> },
    { id: 'women', name: "Women's Health", filterValue: 'Gynecologist/Obstetrician', icon: <Heart size={32} /> },
    { id: 'dental', name: 'Dental Care', filterValue: 'Dentist', icon: <Smile size={32} /> },
    { id: 'child', name: 'Child Specialist', filterValue: 'Pediatrician', icon: <Baby size={32} /> },
    { id: 'ent', name: 'Ear, Nose, Throat', filterValue: 'ENT', icon: <Ear size={32} /> },
    { id: 'mental', name: 'Mental Wellness', filterValue: 'Psychiatrist', icon: <Brain size={32} /> },
    { id: 'ortho', name: 'Bones & Joints', filterValue: 'Orthopedic', icon: <Bone size={32} /> },
    { id: 'eye', name: 'Eye Specialist', filterValue: 'Ophthalmologist', icon: <Eye size={32} /> },
    { id: 'gas', name: 'Gastroenterology', filterValue: 'Gastroenterologist', icon: <Activity size={32} /> },
    { id: 'surg', name: 'General Surgery', filterValue: 'General Surgeon', icon: <Syringe size={32} /> },
    { id: 'ure', name: 'Urology', filterValue: 'Urologist', icon: <Activity size={32} /> }, // Added Urology since we have a doctor
    { id: 'cardio', name: 'Heart', filterValue: 'Cardiologist', icon: <Heart size={32} /> }, // Added Cardio explicitly if needed, or mapped
    { id: 'med', name: 'Medicines', filterValue: 'Medicines', icon: <Pill size={32} /> },
  ];

  const handleCategoryClick = (filterValue: string) => {
    navigate(`/find-doctors?category=${encodeURIComponent(filterValue)}`);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>Book an Appointment</h1>
        <p>Find the best doctors and specialists near you</p>
      </div>

      <div className="appointments-search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search doctors, clinics, hospitals, etc." 
          className="appointments-search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="categories-section">
        <h2>Consult with Top Specialists</h2>
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategoryClick(category.filterValue)}
            >
              <div className="category-icon-wrapper">
                {category.icon}
              </div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
