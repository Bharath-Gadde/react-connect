import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users, BookOpen, GraduationCap, Calendar, Bell } from 'lucide-react';

const AdminHome = () => {
  const { user } = useAuth();

  const adminLinks = [
    { icon: Users, label: 'User Management', href: '/admin/users', description: 'Upload and manage users' },
    { icon: BookOpen, label: 'Academic Management', href: '/admin/academics', description: 'Manage academic data' },
    { icon: GraduationCap, label: 'Marks Management', href: '/admin/marks', description: 'Upload internal/external marks' },
    { icon: Calendar, label: 'Schedule Management', href: '/admin/schedule', description: 'Upload class timetables' },
    { icon: Bell, label: 'Notices', href: '/admin/notices', description: 'Post and manage notices' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-primary-foreground/80 mt-1">{user?.email}</p>
      </div>

      {/* Admin Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((link) => (
          <Link key={link.href} to={link.href}>
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
