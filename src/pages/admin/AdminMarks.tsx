import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api';
import { GraduationCap, Upload, Loader2 } from 'lucide-react';

const AdminMarks = () => {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [externalFile, setExternalFile] = useState<File | null>(null);
  const [uploadingInternal, setUploadingInternal] = useState(false);
  const [uploadingExternal, setUploadingExternal] = useState(false);
  const { toast } = useToast();

  const handleUploadInternal = async () => {
    if (!internalFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploadingInternal(true);
    try {
      await adminApi.uploadInternalMarks(internalFile);
      toast({ title: 'Success', description: 'Internal marks uploaded successfully' });
      setInternalFile(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload internal marks', variant: 'destructive' });
    } finally {
      setUploadingInternal(false);
    }
  };

  const handleUploadExternal = async () => {
    if (!externalFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploadingExternal(true);
    try {
      await adminApi.uploadExternalMarks(externalFile);
      toast({ title: 'Success', description: 'External marks uploaded successfully' });
      setExternalFile(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload external marks', variant: 'destructive' });
    } finally {
      setUploadingExternal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Marks Management</h1>
          <p className="text-muted-foreground">Upload internal and external examination marks</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Internal Marks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Internal Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Excel/CSV File</Label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setInternalFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleUploadInternal} disabled={uploadingInternal} className="w-full">
              {uploadingInternal ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" />Upload Internal Marks</>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Upload mid-term examination marks including seminar, openbook, descriptive, and objective scores.
            </p>
          </CardContent>
        </Card>

        {/* Upload External Marks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload External Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Excel/CSV File</Label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setExternalFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleUploadExternal} disabled={uploadingExternal} className="w-full">
              {uploadingExternal ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" />Upload External Marks</>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Upload final examination marks including total marks, grades, and final grades.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMarks;
