import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminHome from './AdminHome';
import AdminUsers from './AdminUsers';
import AdminAcademics from './AdminAcademics';
import AdminMarks from './AdminMarks';
import AdminSchedule from './AdminSchedule';
import AdminNotices from './AdminNotices';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="academics" element={<AdminAcademics />} />
        <Route path="marks" element={<AdminMarks />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="notices" element={<AdminNotices />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
