import { Home, Users, Target, Mail, BarChart3, Settings, User, MessageSquare, Brain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
	{
		title: "Dashboard",
		url: "/", // Change from "/dashboard" to "/" to match your routing
		icon: Home,
	},
	{
		title: "Customers",
		url: "/customers",
		icon: Users,
	},
	{
		title: "Segments",
		url: "/segments",
		icon: Target,
	},
	{
		title: "Campaigns",
		url: "/campaigns",
		icon: Mail,
	},
	{
		title: "Analytics",
		url: "/analytics",
		icon: BarChart3,
	},
	{
		title: "AI Assistant",
		url: "/ai-assistant",
		icon: Brain,
	},
];

const bottomMenuItems = [
	{
		title: "Profile",
		url: "/profile",
		icon: User,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
];

export function AppSidebar() {
	const { user, logout } = useAuth();
	const location = useLocation();

	return (
		<Sidebar className="border-r-2 border-border">
			<SidebarHeader className="p-6">
				<div className="flex items-center space-x-3">
					<div className="gradient-bg w-10 h-10 rounded-xl flex items-center justify-center">
						<div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
							<span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">C</span>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-bold text-foreground">CustomerConnect</h2>
						<p className="text-xs text-muted-foreground">CRM Platform</p>
					</div>
				</div>
			</SidebarHeader>
			
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className={cn(
										"h-12 px-4 hover:bg-primary/10 transition-colors",
										location.pathname === item.url && "bg-primary/20 text-primary"
									)}>
										<Link to={item.url} className="flex items-center space-x-3">
											<item.icon className="w-5 h-5" />
											<span className="font-medium">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mt-auto">
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{bottomMenuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className={cn(
										"h-12 px-4 hover:bg-primary/10 transition-colors",
										location.pathname === item.url && "bg-primary/20 text-primary"
									)}>
										<Link to={item.url} className="flex items-center space-x-3">
											<item.icon className="w-5 h-5" />
											<span className="font-medium">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-6">
				<div className="flex items-center space-x-3 mb-4">
					<Avatar className="w-10 h-10">
						<AvatarImage src={user?.avatar} alt={user?.name} />
						<AvatarFallback className="gradient-bg text-white font-semibold">
							{user?.name?.charAt(0)?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
						<p className="text-xs text-muted-foreground truncate">{user?.email}</p>
					</div>
				</div>
				<Button 
					variant="outline" 
					size="sm" 
					onClick={logout}
					className="w-full"
				>
					Sign out
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
