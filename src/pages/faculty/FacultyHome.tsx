import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { commonApi, NoticeDTO } from '@/lib/api';
import { Bell, User } from 'lucide-react';

const FacultyHome = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<NoticeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await commonApi.getNotices();
        setNotices(response.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

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
        <h1 className="text-2xl font-bold">Welcome, Faculty!</h1>
        <p className="text-primary-foreground/80 mt-1">{user?.email}</p>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/faculty/profile"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium">My Profile</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Notices */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle className="text-lg">Recent Notices</CardTitle>
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

export default FacultyHome;
