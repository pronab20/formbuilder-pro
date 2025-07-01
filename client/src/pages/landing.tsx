import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-4">
              <i className="fas fa-wpforms mr-2"></i>
              FormBuilder Pro
            </div>
            <CardTitle>Welcome to FormBuilder Pro</CardTitle>
            <CardDescription>
              Create, manage, and analyze forms with our powerful platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Features:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Drag-and-drop form builder</li>
                <li>• User and customer management</li>
                <li>• Real-time analytics and reports</li>
                <li>• Role-based access control</li>
                <li>• CSV export capabilities</li>
              </ul>
            </div>
            <Button onClick={handleLogin} className="w-full" size="lg">
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In to Continue
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Admin credentials: admin/admin for first-time setup
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
