import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: "fas fa-tachometer-alt" },
    ...(user?.role === 'admin' ? [
      { name: "Form Builder", href: "/form-builder", icon: "fas fa-edit" },
      { name: "Users", href: "/users", icon: "fas fa-users" },
      { name: "Reports", href: "/reports", icon: "fas fa-chart-bar" },
    ] : [
      { name: "My Forms", href: "/form-builder", icon: "fas fa-wpforms" },
    ]),
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-primary-600">
            <i className="fas fa-wpforms mr-2"></i>
            FormBuilder Pro
          </div>
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => setLocation(item.href)}
                className={`px-3 py-2 text-sm font-medium ${
                  location === item.href
                    ? "text-primary-600 border-b-2 border-primary-500 rounded-none"
                    : "text-slate-600 hover:text-primary-600"
                }`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <i className="fas fa-bell text-lg"></i>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback className="bg-primary-500 text-white">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user?.firstName || user?.email || "User"}
                </span>
                <i className="fas fa-chevron-down text-slate-400"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
