export const API_BASE_URL = "/api/";

export interface LocalitiesResponse {
  locality: string;
}

export interface ClinicListResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  locality: string;
  lat: string;
  lng: string;
  logo: string;
  specializations: string;
}

export interface BasicDoctorDetails {
  lat: string;
  lng: string;
  name: string;
  city: string;
  icon: string;
  id: string;
  inst_id: string;
  timingStatus: string;
  verified: string;
}

export interface UserResponse {
  RESPONSE: string;
  STATUS: number;
  USER_DETAILS?: any;
  message?: string;
  code?: number;
}

export interface Coordinates {
  south: number;
  west: number;
  north: number;
  east: number;
}

// --- Authentication Interfaces ---
export interface UserRegistrationRequest {
  mobile_number: string;
  device_id: string;
  longitude?: number;
  latitude?: number;
}

export interface OTPRequest {
  mobile_number: string;
  device_id: string;
  name: string;
}

export interface OTPValidationRequest {
  mobile_number: string;
  otp: string;
}

// --- User Interfaces ---
export interface UserProfile {
  user_id: string;
  mobile_number: string;
  name: string;
  device_id: string;
  longitude?: number;
  latitude?: number;
  status: string;
  added_datetime?: string;
  registered_datetime?: string;
}

export interface UserProfileUpdate {
  name?: string;
  longitude?: number;
  latitude?: number;
}

export interface FavoriteClinicsUpdate {
  clinic_list: string[];
}

// --- Appointment Interfaces ---
export interface AppointmentBookingRequest {
  clinic_id: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  notes?: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  clinic_name: string;
  doctor_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  locality?: string;
}

// --- Provider & Feedback Interfaces ---
export interface ProviderRegistrationRequest {
  provider_type: 'clinic' | 'doctor' | 'hospital' | 'pharmacy' | 'diagnostics' | 'dentist';
  name: string;
  mobile_number: string;
  email?: string;
  address: {
    street?: string;
    locality?: string;
    city?: string;
    pincode?: string;
  };
  latitude?: number;
  longitude?: number;
  specialization?: string;
  business_hours?: any;
}

export interface FeedbackSubmission {
  feedback_type: string;
  feedback_text: string;
  rating?: number;
  clinic_id?: string;
}

// --- Clinic Interfaces ---
export interface ClinicDetails {
  id: string;
  verified: string;
  inst_id: string;
  doc_id?: string;
  map_details: {
    name: string;
    type?: string;
    icon?: string;
    location?: { lat: number; lng: number }[];
    address?: { street: string; locality1: string; locality2: string }[];
    contact?: { phone: string; email: string; call?: string; whatsapp?: string }[];
    timings?: any;
    photo?: string[];
    url?: string;
    specialisation?: string[];
  };
}

export interface DoctorSlot {
  time: string;
  status?: string; 
}

export interface ClinicSlotResponse {
  period: string;
  slots: DoctorSlot[];
}

class ReachMyDoctorApi {
  private static authToken: string | null = null;

  static setAuthToken(token: string) {
    this.authToken = token;
  }
  
  static init() {
      console.log("ReachMyDoctorApi Initialized");
  }

  private static async request(endpoint: string, data: any = {}, method: string = "POST") {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      // Handle GET requests with query params if needed, but our helper is basic
      // For this implementation, we assume POST unless specified, or adjust wrapper
      // Actually, many new endpoints are GET. We need to support GET.
      
      const config: RequestInit = {
        method,
        headers,
      };

      let url = `${API_BASE_URL}${endpoint}`;
      
      if (method === "GET" && data && Object.keys(data).length > 0) {
        const params = new URLSearchParams(data as any).toString();
        url += `?${params}`;
      } else if (method !== "GET") {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      return await response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      return { RESPONSE: "FAILURE", message: "Network request failed" };
    }
  }

  // --- Authentication V2 ---

  static async authRegister(data: UserRegistrationRequest) {
    return this.request("auth/register", data, "POST");
  }

  static async authRequestOtp(data: OTPRequest) {
    return this.request("auth/otp/request", data, "POST");
  }

  static async authValidateOtp(data: OTPValidationRequest) {
    const response = await this.request("auth/otp/validate", data, "POST");
    if (response.token) {
        this.setAuthToken(response.token);
    }
    return response;
  }

  // --- User Management V2 ---

  static async getUserProfile() {
    return this.request("users/profile", {}, "GET");
  }

  static async updateUserProfile(data: UserProfileUpdate) {
    return this.request("users/profile", data, "PUT");
  }

  static async getFavoriteClinics() {
    return this.request("users/clinics", {}, "GET");
  }

  static async updateFavoriteClinics(data: FavoriteClinicsUpdate) {
    return this.request("users/clinics", data, "PUT");
  }

  static async getUserAppointments(type: 'active' | 'past' = 'active', limit: number = 20) {
    return this.request("users/appointments", { type, limit }, "GET");
  }

  // --- Location Services V2 ---

  static async getCities() {
    return this.request("locations/cities", {}, "GET");
  }

  static async getLocalitiesV2(city: string, search?: string) {
    return this.request("locations/localities", { city, search }, "GET");
  }

  static async getPincodesV2(city: string, search?: string) {
    return this.request("locations/pincodes", { city, search }, "GET");
  }

  static async geocodeLocation(latitude: number, longitude: number) {
    return this.request("locations/geocode", { latitude, longitude }, "POST");
  }

  // --- Clinics & Providers V2 ---

  static async searchClinics(filters: {
    city?: string;
    locality?: string;
    specialization?: string;
    name?: string;
    lat?: number;
    lng?: number;
    limit?: number;
  }) {
    return this.request("clinics/search", filters, "GET");
  }

  static async getClinicDetailsV2(clinicId: string) {
    return this.request(`clinics/${clinicId}`, {}, "GET");
  }

  static async getClinicSlotsV2(clinicId: string, date: string) {
    return this.request(`clinics/${clinicId}/slots`, { date }, "GET");
  }

  // --- Appointments V2 ---

  static async bookAppointmentV2(data: AppointmentBookingRequest) {
    return this.request("appointments", data, "POST");
  }

  static async cancelAppointment(appointmentId: string, reason?: string) {
    return this.request(`appointments/${appointmentId}/cancel`, { reason }, "POST");
  }

  // --- Provider Registration V2 ---

  static async registerProvider(data: ProviderRegistrationRequest) {
    return this.request("providers/register", data, "POST");
  }

  // --- Feedback V2 ---

  static async getFeedbackOptions() {
    return this.request("feedback/options", {}, "GET");
  }

  static async submitFeedback(data: FeedbackSubmission) {
    return this.request("feedback", data, "POST");
  }

  // ==========================================
  // EXISTING/LEGACY METHODS (V1) - Kept for compatibility
  // ==========================================

  // --- Search & Location APIs (V1) ---

  static async getLocalities(city: string, searchTerm: string): Promise<LocalitiesResponse[]> {
    try {
        const body = JSON.stringify({
            city: city,
            search_term: searchTerm
        });

        const response = await fetch("https://reachmydoctor.in/api/v1/autocomplete/get_localities", {
            method: "POST",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                "content-type": "text/plain"
            },
            body: body
        });

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("getLocalities failed", err);
        return [];
    }
  }

  static async getPincodes(city: string, searchTerm: string) {
    return this.request("v1/autocomplete/get_pincodes", {
      city,
      search_term: searchTerm,
    });
  }

  static async getPinLocalities(city: string, searchTerm: string) {
    return this.request("v1/autocomplete/locality_pincode", {
      city,
      search_term: searchTerm,
    });
  }

  // --- Doctor & Clinic Search APIs (V1) ---

  /**
   * Search for clinics/doctors by type (specialization) and location.
   */
  static async getClinicsList(type: string, city: string, locality: string = "", book: string = ""): Promise<ClinicListResponse[]> {
    const response = await this.request("v1/map/get_clinic_list", {
      type,
      city,
      loc: locality,
      booking: book,
    });
    if (response.RESPONSE === "SUCCESS") {
      return response.CLINIC_LIST || [];
    }
    return [];
  }

  static async getClinicsByName(clinicName: string, city: string, locality: string, book: string = "") {
    const response = await this.request("v1/map/get_clinics", {
      clinic_name: clinicName,
      city,
      locality,
      book,
    });
    return response.GET_CLINICS || [];
  }

  static async getMapCenter(specialization: string, city: string, locality: string = "") {
    try {
        const body = JSON.stringify({
            type: specialization.includes(":") ? specialization : `doctor:${specialization}`,
            city: city,
            locality: locality
        });

        const response = await fetch("https://reachmydoctor.in/api/v1/map/get_map_center", {
            method: "POST",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "text/plain"
            },
            body: body
        });

        return await response.json();
    } catch (err) {
        console.error("getMapCenter failed", err);
        return null; // Return null on failure logic
    }
  }

  static async getMapDetails(specialization: string, city: string, locality: string, coordinates: Coordinates) {
    return this.request("v1/map/get_basic_details", {
      type: specialization,
      city,
      locality,
      lat1: coordinates.south.toString(),
      lat2: coordinates.west.toString(),
      lng1: coordinates.north.toString(),
      lng2: coordinates.east.toString()
    });
  }

  static async getMapBasicDetails(specialization: string, city: string, locality: string, coordinates: Coordinates): Promise<BasicDoctorDetails[]> {
      try {
        const formattedType = specialization === "Clinic" ? "Clinic:Clinic" : (specialization.includes(":") ? specialization : `doctor:${specialization}`);
        
        const body = JSON.stringify({
            type: formattedType,
            city: city,
            locality: "", // Force empty locality to use coordinate filtering
            lat1: coordinates.south.toString(),
            lat2: coordinates.west.toString(),
            lng1: coordinates.north.toString(),
            lng2: coordinates.east.toString()
        });
        
        const response = await fetch("https://reachmydoctor.in/api/v1/map/get_basic_details", {
            method: "POST",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "text/plain"
            },
            body: body
        });
        
        const data = await response.json();
        
        if (data.RESPONSE === "SUCCESS") {
            return data.MAP_BASIC_DETAILS || [];
        }
        return [];
      } catch (err) {
          console.error("getMapBasicDetails failed", err);
          return [];
      }
  }

  // --- Clinic & Doctor Details (V1) ---

  static async getClinicDetails(id: string) {
    return this.request("v1/map/get_details", { id });
  }

  static async getDoctors(institutionId: string) {
    const response = await this.request("hub/web/get_doctors", {
      institution_id: institutionId,
    });
    return response;
  }

  /* 
   * Get locations for a specific doctor 
   */
  static async getDoctorLocations(doctorId: string, institutionId: string, locationId: string) {
    return this.request("hub/web/get_locations", {
      doctor_id: doctorId,
      institution_id: institutionId,
      location_id: locationId
    });
  }

  static async getClinicSlots(id: string, _date: string) {
    try {
        // User snippet only sends id in body, ignoring date for now as per specific request snippet
        const body = JSON.stringify({
            id: id
        });

        const response = await fetch("https://reachmydoctor.in/api/v1/verified/get_clinic_slots", {
            method: "POST",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "text/plain"
            },
            body: body
        });

        return await response.json();
    } catch (err) {
        console.error("getClinicSlots failed", err);
        return { RESPONSE: "FAILURE" };
    }
  }

  /*
   * Get specific booking slots for a doctor
   */
  static async getDoctorBookingSlots(doctorId: string, institutionId: string, locationId: string) {
     return this.request("hub/web/get_doctor_booking", {
      doctor_id: doctorId,
      institution_id: institutionId,
      location_id: locationId
    });
  }

  // --- User & Auth APIs (V1) ---

  static async checkIfUserExists(mobile: string): Promise<UserResponse> {
    return this.request("hub/web/get_user", { mobile_no: mobile });
  }

  static async requestOtp(mobile: string, name: string) {
    return this.request("v1/user/register_otp_request", {
      mobile_number: mobile,
      name,
      device_id: "",
    });
  }

  static async registerUser(mobile: string, otp: string, name: string) {
    return this.request("v1/user/register_user", {
      mobile_number: mobile,
      otp,
      name,
    });
  }

  // --- Booking APIs (v1) ---

  static async fixAppointmentVerified(details: {
    mobile: string;
    date: string; // YYYY-MM-DD
    timeSlot: string; // "10:00"
    rmdId: string;
    userName: string;
    clinicName: string;
    locality: string;
    docMob?: string;
  }) {
    return this.request("v1/verified/request_appointment", {
      client_mobile: details.mobile,
      appt_date: details.date,
      appt_time: details.timeSlot,
      formatted_appt_time: details.timeSlot,
      rmd_id: details.rmdId,
      name: details.userName,
      clinicName: details.clinicName,
      locality2: details.locality,
      docMob: details.docMob || "",
      clinicVerified: "1",
      reqFrom: "web",
    });
  }

  static async fixAppointmentGeneric(details: {
    name: string;
    mobile: string;
    clinicName: string;
    address: string;
    date: string;
    time: string;
    clinicId: string;
    note: string;
    locality: string;
  }) {
    return this.request("v1/main/request_appointment", {
        name: details.name,
        mobile: details.mobile,
        clinicName: details.clinicName,
        address: details.address,
        date: details.date,
        time: details.time,
        clinicId: details.clinicId,
        noteToDoctor: details.note,
        locality: details.locality
    });
  }
}

export default ReachMyDoctorApi;
