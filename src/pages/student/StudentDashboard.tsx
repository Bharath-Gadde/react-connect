import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StudentHome from './StudentHome';
import StudentProfile from './StudentProfile';
import StudentAcademics from './StudentAcademics';
import StudentResults from './StudentResults';
import StudentDocuments from './StudentDocuments';
import StudentSchedule from './StudentSchedule';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="academics" element={<StudentAcademics />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="documents" element={<StudentDocuments />} />
        <Route path="schedule" element={<StudentSchedule />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
