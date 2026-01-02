import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api';
import { BookOpen, Upload, Loader2, ArrowUp, AlertTriangle } from 'lucide-react';

const AdminAcademics = () => {
  const [academicsFile, setAcademicsFile] = useState<File | null>(null);
  const [detainedFile, setDetainedFile] = useState<File | null>(null);
  const [batch, setBatch] = useState('');
  const [uploadingAcademics, setUploadingAcademics] = useState(false);
  const [uploadingDetained, setUploadingDetained] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const { toast } = useToast();

  const handleUploadAcademics = async () => {
    if (!academicsFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploadingAcademics(true);
    try {
      await adminApi.uploadAcademics(academicsFile);
      toast({ title: 'Success', description: 'Academic data uploaded successfully' });
      setAcademicsFile(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload academic data', variant: 'destructive' });
    } finally {
      setUploadingAcademics(false);
    }
  };

  const handleUploadDetained = async () => {
    if (!detainedFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploadingDetained(true);
    try {
      await adminApi.uploadDetainedList(detainedFile);
      toast({ title: 'Success', description: 'Detained list uploaded successfully' });
      setDetainedFile(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload detained list', variant: 'destructive' });
    } finally {
      setUploadingDetained(false);
    }
  };

  const handlePromoteBatch = async () => {
    if (!batch) {
      toast({ title: 'Error', description: 'Please enter a batch', variant: 'destructive' });
      return;
    }

    setPromoting(true);
    try {
      const response = await adminApi.promoteBatch(batch);
      toast({ title: 'Success', description: response.data });
      setBatch('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to promote batch', variant: 'destructive' });
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Academic Management</h1>
          <p className="text-muted-foreground">Manage academic data, promotions, and detained students</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Academics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Academic Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Excel/CSV File</Label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setAcademicsFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleUploadAcademics} disabled={uploadingAcademics} className="w-full">
              {uploadingAcademics ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" />Upload</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Promote Batch */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5" />
              Promote Batch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Batch (e.g., 2021-2025)</Label>
              <Input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="Enter batch"
              />
            </div>
            <Button onClick={handlePromoteBatch} disabled={promoting} className="w-full">
              {promoting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Promoting...</>
              ) : (
                <><ArrowUp className="h-4 w-4 mr-2" />Promote</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Upload Detained List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Upload Detained Students List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Excel/CSV File</Label>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setDetainedFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleUploadDetained} disabled={uploadingDetained} className="w-full">
                  {uploadingDetained ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" />Upload</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAcademics;
