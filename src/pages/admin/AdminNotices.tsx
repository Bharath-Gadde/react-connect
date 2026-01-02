import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { commonApi, NoticeDTO } from '@/lib/api';
import { Bell, Upload, Loader2, Eye } from 'lucide-react';

const AdminNotices = () => {
  const [notices, setNotices] = useState<NoticeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await commonApi.getNotices();
      setNotices(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load notices', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !file) {
      toast({ title: 'Error', description: 'Please fill all fields and select a file', variant: 'destructive' });
      return;
    }

    setPosting(true);
    try {
      await commonApi.postNotice(title, description, file);
      toast({ title: 'Success', description: 'Notice posted successfully' });
      setTitle('');
      setDescription('');
      setFile(null);
      fetchNotices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to post notice', variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await commonApi.viewNotice(id);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to view notice', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Notices Management</h1>
          <p className="text-muted-foreground">Post and manage announcements</p>
        </div>
      </div>

      {/* Post Notice Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Post New Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notice title"
              />
            </div>
            <div className="space-y-2">
              <Label>Attachment</Label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notice description"
              rows={3}
            />
          </div>
          <Button onClick={handlePost} disabled={posting}>
            {posting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Posting...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" />Post Notice</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notices List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notices.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No notices posted yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Posted At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice.noticeId}>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notice.description}</TableCell>
                    <TableCell>{new Date(notice.postedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(notice.noticeId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotices;
