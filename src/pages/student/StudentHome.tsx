import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { studentApi, commonApi, AcademicDTO, NoticeDTO } from '@/lib/api';
import { BookOpen, FileText, Calendar, User, Bell, GraduationCap } from 'lucide-react';

const StudentHome = () => {
  const { user } = useAuth();
  const [academics, setAcademics] = useState<AcademicDTO | null>(null);
  const [notices, setNotices] = useState<NoticeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicsRes, noticesRes] = await Promise.all([
          studentApi.getAcademics(),
          commonApi.getNotices(),
        ]);
        setAcademics(academicsRes.data);
        setNotices(noticesRes.data.slice(0, 3)); // Show only latest 3
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickLinks = [
    { icon: User, label: 'My Profile', href: '/student/profile', color: 'text-primary' },
    { icon: BookOpen, label: 'Academics', href: '/student/academics', color: 'text-primary' },
    { icon: GraduationCap, label: 'Results', href: '/student/results', color: 'text-primary' },
    { icon: FileText, label: 'Documents', href: '/student/documents', color: 'text-primary' },
    { icon: Calendar, label: 'Schedule', href: '/student/schedule', color: 'text-primary' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-primary-foreground/80 mt-1">{user?.email}</p>
      </div>

      {/* Stats Cards */}
      {academics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Year</CardDescription>
              <CardTitle className="text-3xl">{academics.year}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Semester</CardDescription>
              <CardTitle className="text-3xl">{academics.semester}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Section</CardDescription>
              <CardTitle className="text-3xl">{academics.section}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Branch</CardDescription>
              <CardTitle className="text-xl">{academics.branch}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notices
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No notices available</p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.noticeId}
                  className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <h4 className="font-medium">{notice.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notice.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notice.postedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHome;
