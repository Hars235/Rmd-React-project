
import React from 'react';
import { Stethoscope, Building2, Building, Pill, Smile, Leaf, Activity } from 'lucide-react';

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  clinic: string;
  fee: string;
  availability: string;
  image: string;
  slots: { date: string; times: string[] }[];
};

export type BookingSlot = {
  date: string;
  time: string;
};

// Logo URL for the map marker
export const LOGO_URL = "/images/consult/logo.png";

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Anjali Desai",
    specialty: "Dentist",
    experience: "12 years experience",
    location: "Jubilee Hills, Hyderabad",
    clinic: "Apollo Dental, Road No 92",
    fee: "₹500",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png", 
    slots: [
      { date: "Today", times: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
      { date: "Tomorrow", times: ["09:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "15 years experience",
    location: "Kondapur, Hyderabad",
    clinic: "Kims Hospital, Kondapur Main Road",
    fee: "₹600",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["05:00 PM", "06:30 PM", "08:00 PM"] },
      { date: "Tomorrow", times: ["10:30 AM", "12:30 PM", "05:30 PM"] }
    ]
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist/Obstetrician",
    experience: "9 years experience",
    location: "Banjara Hills, Hyderabad",
    clinic: "Rainbow Children's Hospital, Road No 2",
    fee: "₹700",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
       { date: "Tomorrow", times: ["11:00 AM", "01:00 PM", "04:00 PM"] }
    ]
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Dermatologist",
    experience: "8 years experience",
    location: "Madhapur, Hyderabad",
    clinic: "Skin & Hair Clinic, Hitech City Rd",
    fee: "₹800",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["02:00 PM", "03:30 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "04:30 PM"] }
    ]
  },
  {
    id: 5,
    name: "Dr. Siddalinga Swamy",
    specialty: "Urologist",
    experience: "10 years experience",
    location: "Ramachandrapuram, Hyderabad",
    clinic: "Shree Veda Multispeciality Hospital, NH 65, Ashok Nagar",
    fee: "₹800",
    availability: "Available Today",
    image: "/images/dr_siddalinga_swamy.png",
    slots: [
      { date: "Today", times: ["10:00 AM", "01:00 PM", "06:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "02:00 PM", "05:00 PM"] }
    ]
  },

  // Bangalore Doctors
  {
    id: 6,
    name: "Dr. Rajesh Kumar",
    specialty: "Dentist",
    experience: "8 years experience",
    location: "Indiranagar, Bangalore",
    clinic: "Apollo Dental, 100 Feet Road",
    fee: "₹600",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["10:00 AM", "05:00 PM"] }
    ]
  },
  {
    id: 7,
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    experience: "12 years experience",
    location: "Koramangala, Bangalore",
    clinic: "Skin Care Clinic, 80 Feet Road",
    fee: "₹900",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["11:00 AM", "03:00 PM"] }
    ]
  },
  // Chennai Doctors
  {
    id: 8,
    name: "Dr. Suresh Reddy",
    specialty: "General Physician",
    experience: "15 years experience",
    location: "Adyar, Chennai",
    clinic: "Apollo Hospital, Greams Road",
    fee: "₹700",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
        { date: "Today", times: ["09:00 AM", "01:00 PM"] }
    ]
  },
  // Mumbai Doctors
  {
    id: 9,
    name: "Dr. Anita Desai",
    specialty: "Gynecologist/Obstetrician",
    experience: "9 years experience",
    location: "Bandra West, Mumbai",
    clinic: "Lilavati Hospital, Bandra Reclamation",
    fee: "₹1200",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
        { date: "Tomorrow", times: ["10:00 AM", "02:00 PM"] }
    ]
  },
  // New Bangalore Doctors
  {
    id: 10,
    name: "Dr. Suresh Gupta",
    specialty: "Cardiologist",
    experience: "18 years experience",
    location: "Whitefield, Bangalore",
    clinic: "Manipal Hospital, Whitefield Main Rd",
    fee: "₹900",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["09:00 AM", "11:00 AM"] },
      { date: "Tomorrow", times: ["10:00 AM", "01:00 PM"] }
    ]
  },
  {
    id: 11,
    name: "Dr. Meena Iyer",
    specialty: "Gynecologist/Obstetrician",
    experience: "14 years experience",
    location: "Jayanagar, Bangalore",
    clinic: "Cloudnine Hospital, 3rd Block",
    fee: "₹750",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["02:00 PM", "04:30 PM", "06:00 PM"] }
    ]
  },
  {
    id: 12,
    name: "Dr. Amit Patil",
    specialty: "Orthopedic",
    experience: "10 years experience",
    location: "HSR Layout, Bangalore",
    clinic: "Narayana Hrudayalaya Clinic, Sector 2",
    fee: "₹650",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["05:00 PM", "07:30 PM"] }
    ]
  },
  {
    id: 13,
    name: "Dr. Sneha Reddy",
    specialty: "Pediatrician",
    experience: "7 years experience",
    location: "Malleshwaram, Bangalore",
    clinic: "Columbia Asia Referral Hospital, Gateway",
    fee: "₹600",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["10:00 AM", "01:00 PM"] },
      { date: "Tomorrow", times: ["09:30 AM", "12:00 PM"] }
    ]
  },
  // New Hyderabad Doctors
  {
    id: 14,
    name: "Dr. Ravi Varma",
    specialty: "Cardiologist",
    experience: "20 years experience",
    location: "Gachibowli, Hyderabad",
    clinic: "Continental Hospitals, Financial District",
    fee: "₹1000",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["11:00 AM", "02:00 PM"] }
    ]
  },
  {
    id: 15,
    name: "Dr. Latika Rao",
    specialty: "Dermatologist",
    experience: "6 years experience",
    location: "Kukatpally, Hyderabad",
    clinic: "Oliva Skin & Hair Clinic, KPHB Colony",
    fee: "₹550",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["03:00 PM", "05:00 PM", "07:00 PM"] }
    ]
  }
];

// Interfaces for Category Data
export interface SubCategory {
    id: string;
    label: string;
    icon: React.ReactNode | string; // ReactNode or string char
    color: string;
}

export interface Category {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    subCategories: SubCategory[];
}

// Mock Data for Categories matching the screenshot
export const SEARCH_CATEGORIES: Category[] = [
  { 
    id: 'doctor', 
    label: 'Doctor', 
    icon: <Stethoscope size={18} />,
    color: '#007bff', // Blue
    subCategories: [
      { id: 'General Physician', label: 'General Physician', icon: 'G', color: '#6c757d' },
      { id: 'Pediatrician', label: 'Pediatrician', icon: 'P', color: '#e83e8c' },
      { id: 'Dermatologist', label: 'Dermatologist', icon: 'D', color: '#fd7e14' },
      { id: 'ENT Specialist', label: 'ENT Specialist', icon: 'E', color: '#007bff' },
      { id: 'Gynecologist/Obstetrician', label: 'Gynecologist/Obstetrician', icon: 'G', color: '#28a745' },
      { id: 'Physiotherapist', label: 'Physiotherapist', icon: 'P', color: '#20c997' },
      { id: 'Urologist', label: 'Urologist', icon: 'U', color: '#007bff' },
      { id: 'Cardiologist', label: 'Cardiologist', icon: 'C', color: '#dc3545' }
    ]
  },
  { id: 'clinic', label: 'Clinic', icon: <Building2 size={18} />, color: '#17a2b8', subCategories: [] },
  { id: 'dentist', label: 'Dentist', icon: <Smile size={18} />, color: '#007bff', subCategories: [] },
  { id: 'diagnostics', label: 'Diagnostics', icon: <Activity size={18} />, color: '#17a2b8', subCategories: [] }, 
  { id: 'hospital', label: 'Hospital', icon: <Building size={18} />, color: '#dc3545', subCategories: [] },
  { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={18} />, color: '#28a745', subCategories: [] },
  { id: 'homeopathy', label: 'Homeopathy', icon: <Leaf size={18} />, color: '#20c997', subCategories: [] }
];
