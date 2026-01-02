import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { studentApi, StudentDTO } from '@/lib/api';
import { Loader2, Save, User } from 'lucide-react';

const StudentProfile = () => {
  const [profile, setProfile] = useState<StudentDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      await studentApi.editProfile(profile);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof StudentDTO, value: string | number) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profile.firstname || ''}
                  onChange={(e) => updateField('firstname', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profile.lastname || ''}
                  onChange={(e) => updateField('lastname', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Roll Number</Label>
              <Input value={profile.rno || ''} disabled />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Input
                  value={profile.bloodgroup || ''}
                  onChange={(e) => updateField('bloodgroup', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Mother Tongue</Label>
                <Input
                  value={profile.mothertongue || ''}
                  onChange={(e) => updateField('mothertongue', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Religion</Label>
                <Input
                  value={profile.religion || ''}
                  onChange={(e) => updateField('religion', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Caste</Label>
                <Input
                  value={profile.caste || ''}
                  onChange={(e) => updateField('caste', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Input
                value={profile.martialstatus || ''}
                onChange={(e) => updateField('martialstatus', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Family & Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Family & Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Father's Name</Label>
              <Input
                value={profile.fathername || ''}
                onChange={(e) => updateField('fathername', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother's Name</Label>
              <Input
                value={profile.mothername || ''}
                onChange={(e) => updateField('mothername', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Student Mobile</Label>
              <Input
                type="number"
                value={profile.smobile || ''}
                onChange={(e) => updateField('smobile', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father's Mobile</Label>
              <Input
                type="number"
                value={profile.fmobile || ''}
                onChange={(e) => updateField('fmobile', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Present Address</Label>
              <Textarea
                value={profile.presentAddress || ''}
                onChange={(e) => updateField('presentAddress', e.target.value)}
                disabled={!isEditing}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Permanent Address</Label>
              <Textarea
                value={profile.permanantAddress || ''}
                onChange={(e) => updateField('permanantAddress', e.target.value)}
                disabled={!isEditing}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
