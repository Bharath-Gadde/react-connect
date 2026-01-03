import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2008';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<string>('/auth/login', { usernameOrEmail: email, password }),
  signup: (email: string, password: string, role: string) =>
    api.post<string>('/auth/signup', { email, password, role }),
  changePassword: (email: string, password: string, newpassword: string) =>
    api.post<string>('/auth/changepassword', { email, password, newpassword }),
};

// Student API
export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  editProfile: (data: StudentDTO) => api.post('/student/editprofile', data),
  getAcademics: () => api.get('/student/academics'),
  getInternalMarks: (semester: number) => api.get(`/student/internalmarks/${semester}`),
  getExternalMarks: (semester: number) => api.get(`/student/externalmarks/${semester}`),
  uploadDocument: (formData: FormData) =>
    api.post('/student/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: () => api.get('/student/get/documents'),
  viewDocument: (id: number) =>
    api.get(`/student/document/${id}/view`, { responseType: 'blob' }),
  viewSchedule: (branch: string, year: number, semester: number, section: string) =>
    api.get('/student/schedule/view', {
      params: { branch, year, semester, section },
      responseType: 'blob',
    }),
};

// Faculty API
export const facultyApi = {
  getProfile: () => api.get('/faculty/profile'),
  editProfile: (data: FacultyDTO) => api.post('/faculty/edit-profile', data),
};

// Admin API
export const adminApi = {
  uploadUsers: (file: File, role: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadAcademics: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload-academics', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  promoteBatch: (batch: string) => api.post(`/admin/promote/${batch}`),
  uploadDetainedList: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/update-detainedlist', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadInternalMarks: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/internalmarks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadExternalMarks: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/externalmarks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadSchedule: (branch: string, year: number, semester: number, section: string, title: string, file: File) => {
    const formData = new FormData();
    formData.append('branch', branch);
    formData.append('year', year.toString());
    formData.append('semester', semester.toString());
    formData.append('section', section);
    formData.append('title', title);
    formData.append('file', file);
    return api.post('/admin/upload/schedule', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Common API
export const commonApi = {
  postNotice: (title: string, description: string, file: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    return api.post('/comm/post/notice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getNotices: () => api.get('/comm/get/notices'),
  viewNotice: (id: number) =>
    api.get(`/comm/notice/${id}/view`, { responseType: 'blob' }),
};

// Types
export interface StudentDTO {
  rno?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  fathername?: string;
  mothername?: string;
  religion?: string;
  caste?: string;
  smobile?: number;
  fmobile?: number;
  bloodgroup?: string;
  mothertongue?: string;
  martialstatus?: string;
  permanantAddress?: string;
  presentAddress?: string;
}

export interface FacultyDTO {
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  gender?: string;
  branch?: string;
  position?: string;
  address?: string;
  workexperience?: string;
  about?: string;
  martialstatus?: string;
  bloodgroup?: string;
  contactemail?: string;
  mobile?: number;
}

export interface AcademicDTO {
  srno: string;
  branch: string;
  batch: string;
  course: string;
  year: number;
  semester: number;
  section: string;
  type: string;
  admissionDate: string;
  status: string;
}

export interface InternalResultDTO {
  semester: number;
  subjectName: string;
  seminar1: number;
  openbook1: number;
  descriptive1: number;
  objective1: number;
  seminar2: number;
  openbook2: number;
  descriptive2: number;
  objective2: number;
  total1: number;
  total2: number;
  finalInternalMarks: number;
}

export interface ExternalResultDTO {
  srno: string;
  subjectName: string;
  semester: number;
  year: number;
  total: number;
  grade: string;
  finalGrade: string;
}

export interface NoticeDTO {
  noticeId: number;
  title: string;
  description: string;
  postedAt: string;
}

export interface StudentDocumentDTO {
  documentId: number;
  documentType: string;
  title: string;
  originalFilename: string;
  uploadedAt: string;
}

export default api;
