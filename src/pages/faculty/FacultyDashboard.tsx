import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FacultyHome from './FacultyHome';
import FacultyProfile from './FacultyProfile';

const FacultyDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<FacultyHome />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
