import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    enabled: user?.role === 'admin',
  });

  const { data: forms, isLoading: formsLoading } = useQuery({
    queryKey: ["/api/forms"],
  });

  const handleCreateForm = () => {
    setLocation("/form-builder");
  };

  const handleManageUsers = () => {
    setLocation("/users");
  };

  const handleViewReports = () => {
    setLocation("/reports");
  };

  return (
    <main className="p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          {user?.role === 'admin' 
            ? "Manage your forms, users, and view analytics" 
            : "View your assigned forms and submissions"
          }
        </p>
      </div>

      {/* Stats Cards - Admin Only */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Forms</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {statsLoading ? "..." : stats?.totalForms || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-wpforms text-primary-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">
                  <i className="fas fa-arrow-up mr-1"></i>12%
                </span>
                <span className="text-slate-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {statsLoading ? "..." : stats?.activeUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">
                  <i className="fas fa-arrow-up mr-1"></i>8%
                </span>
                <span className="text-slate-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Form Submissions</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {statsLoading ? "..." : stats?.totalSubmissions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-paper-plane text-yellow-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">
                  <i className="fas fa-arrow-up mr-1"></i>23%
                </span>
                <span className="text-slate-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Revenue</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ₹{statsLoading ? "..." : stats?.revenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-rupee-sign text-purple-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">
                  <i className="fas fa-arrow-up mr-1"></i>15%
                </span>
                <span className="text-slate-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {formsLoading ? (
              <p className="text-slate-500">Loading forms...</p>
            ) : forms?.length === 0 ? (
              <p className="text-slate-500">No forms created yet</p>
            ) : (
              <div className="space-y-3">
                {forms?.slice(0, 5).map((form: any) => (
                  <div key={form.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-wpforms text-primary-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{form.title}</p>
                        <p className="text-xs text-slate-500">
                          Created {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={form.isActive ? "default" : "secondary"}>
                      {form.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === 'admin' && (
              <>
                <Button onClick={handleCreateForm} className="w-full justify-start" size="lg">
                  <i className="fas fa-plus mr-2"></i>
                  Create New Form
                </Button>
                <Button onClick={handleManageUsers} variant="outline" className="w-full justify-start" size="lg">
                  <i className="fas fa-user-plus mr-2"></i>
                  Add New User
                </Button>
                <Button onClick={handleViewReports} variant="outline" className="w-full justify-start" size="lg">
                  <i className="fas fa-download mr-2"></i>
                  Export Reports
                </Button>
              </>
            )}
            <Button 
              onClick={() => setLocation("/form-builder")} 
              variant="outline" 
              className="w-full justify-start" 
              size="lg"
            >
              <i className="fas fa-edit mr-2"></i>
              {user?.role === 'admin' ? 'Form Builder' : 'View My Forms'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
