import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { studentApi, InternalResultDTO, ExternalResultDTO } from '@/lib/api';
import { GraduationCap, Loader2 } from 'lucide-react';

const StudentResults = () => {
  const [semester, setSemester] = useState<string>('1');
  const [internalResults, setInternalResults] = useState<InternalResultDTO[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalResultDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, [semester]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [internalRes, externalRes] = await Promise.all([
        studentApi.getInternalMarks(parseInt(semester)),
        studentApi.getExternalMarks(parseInt(semester)),
      ]);
      setInternalResults(internalRes.data);
      setExternalResults(externalRes.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load results',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Examination Results</h1>
            <p className="text-muted-foreground">View your internal and external marks</p>
          </div>
        </div>
        
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>
                Semester {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="internal">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="internal">Internal Marks</TabsTrigger>
          <TabsTrigger value="external">External Marks</TabsTrigger>
        </TabsList>

        <TabsContent value="internal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Internal Examination - Semester {semester}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : internalResults.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No internal marks found for this semester</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Mid 1 - Seminar</TableHead>
                        <TableHead className="text-center">Mid 1 - Openbook</TableHead>
                        <TableHead className="text-center">Mid 1 - Descriptive</TableHead>
                        <TableHead className="text-center">Mid 1 - Objective</TableHead>
                        <TableHead className="text-center">Total 1</TableHead>
                        <TableHead className="text-center">Mid 2 - Seminar</TableHead>
                        <TableHead className="text-center">Mid 2 - Openbook</TableHead>
                        <TableHead className="text-center">Mid 2 - Descriptive</TableHead>
                        <TableHead className="text-center">Mid 2 - Objective</TableHead>
                        <TableHead className="text-center">Total 2</TableHead>
                        <TableHead className="text-center font-semibold">Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internalResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.subjectName}</TableCell>
                          <TableCell className="text-center">{result.seminar1}</TableCell>
                          <TableCell className="text-center">{result.openbook1}</TableCell>
                          <TableCell className="text-center">{result.descriptive1}</TableCell>
                          <TableCell className="text-center">{result.objective1}</TableCell>
                          <TableCell className="text-center font-medium">{result.total1}</TableCell>
                          <TableCell className="text-center">{result.seminar2}</TableCell>
                          <TableCell className="text-center">{result.openbook2}</TableCell>
                          <TableCell className="text-center">{result.descriptive2}</TableCell>
                          <TableCell className="text-center">{result.objective2}</TableCell>
                          <TableCell className="text-center font-medium">{result.total2}</TableCell>
                          <TableCell className="text-center font-bold text-primary">{result.finalInternalMarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>External Examination - Semester {semester}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : externalResults.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No external marks found for this semester</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Total Marks</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Final Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {externalResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.subjectName}</TableCell>
                        <TableCell className="text-center">{result.total}</TableCell>
                        <TableCell className="text-center">{result.grade}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{result.finalGrade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentResults;
