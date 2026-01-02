import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { studentApi, AcademicDTO } from '@/lib/api';
import { BookOpen, Calendar, GraduationCap, Hash, Layers, Users } from 'lucide-react';

const StudentAcademics = () => {
  const [academics, setAcademics] = useState<AcademicDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        const response = await studentApi.getAcademics();
        setAcademics(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load academic information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAcademics();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!academics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Academic information not found</p>
      </div>
    );
  }

  const infoItems = [
    { icon: Hash, label: 'SR Number', value: academics.srno },
    { icon: GraduationCap, label: 'Course', value: academics.course },
    { icon: BookOpen, label: 'Branch', value: academics.branch },
    { icon: Users, label: 'Batch', value: academics.batch },
    { icon: Layers, label: 'Year', value: academics.year.toString() },
    { icon: Layers, label: 'Semester', value: academics.semester.toString() },
    { icon: Users, label: 'Section', value: academics.section },
    { icon: BookOpen, label: 'Type', value: academics.type },
    { icon: Calendar, label: 'Admission Date', value: new Date(academics.admissionDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Academic Information</h1>
          <p className="text-muted-foreground">Your enrollment and academic details</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Academic Details</CardTitle>
          <Badge variant={academics.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {academics.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAcademics;
