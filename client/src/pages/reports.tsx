import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Reports() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    form: "all",
    dateRange: "30days",
    user: "all",
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/submissions"],
  });

  const { data: forms } = useQuery({
    queryKey: ["/api/forms"],
  });

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/export/csv", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "form-submissions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "CSV exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive",
      });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <main className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600">You need admin privileges to access reports.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Generate and export form submission reports</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleExportCSV}>
            <i className="fas fa-download mr-2"></i>Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Form</label>
              <Select value={filters.form} onValueChange={(value) => setFilters(prev => ({ ...prev, form: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {forms?.map((form: any) => (
                    <SelectItem key={form.id} value={form.id.toString()}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
              <Select value={filters.user} onValueChange={(value) => setFilters(prev => ({ ...prev, user: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <p className="text-slate-500">Loading submissions...</p>
          ) : !submissions || submissions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-chart-bar text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">No form submissions found</p>
              <p className="text-sm text-slate-400 mt-2">
                Submissions will appear here once forms are completed
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Collection Plan</TableHead>
                    <TableHead>Water Plan</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission: any) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Form {submission.formId}</Badge>
                      </TableCell>
                      <TableCell>{submission.userId}</TableCell>
                      <TableCell>
                        {submission.customerId ? `Customer ${submission.customerId}` : "-"}
                      </TableCell>
                      <TableCell>
                        {submission.collectionPlan ? `₹${Number(submission.collectionPlan).toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        {submission.waterPlan ? `${submission.waterPlan} cases` : "-"}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
