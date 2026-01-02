import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { studentApi, AcademicDTO } from '@/lib/api';
import { Calendar, Loader2, Eye } from 'lucide-react';

const StudentSchedule = () => {
  const [academics, setAcademics] = useState<AcademicDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(false);
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

  const handleViewSchedule = async () => {
    if (!academics) return;
    
    setViewing(true);
    try {
      const response = await studentApi.viewSchedule(
        academics.branch,
        academics.year,
        academics.semester,
        academics.section
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load schedule. It may not be uploaded yet.',
        variant: 'destructive',
      });
    } finally {
      setViewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">View your class timetable</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {academics ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-semibold">{academics.branch}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{academics.year}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">Semester</p>
                  <p className="font-semibold">{academics.semester}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p className="font-semibold">{academics.section}</p>
                </div>
              </div>
              
              <Button onClick={handleViewSchedule} disabled={viewing}>
                {viewing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Timetable
                  </>
                )}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">Academic information not available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSchedule;
