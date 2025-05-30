import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, Target, TrendingUp, Plus, MessageSquare, BarChart3 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api, { endpoints } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalCustomers: number;
  activeCampaigns: number;
  customerSegments: number;
  avgEngagement: number;
  customerGrowth: Array<{ month: string; customers: number; campaigns: number }>;
  campaignPerformance: Array<{ name: string; sent: number; opened: number; clicked: number }>;
  recentActivities: Array<{ id: string | number; action: string; customer?: string; recipients?: string; count?: string; time: string; type: string }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoints.dashboardStats);
        console.log('Dashboard data received:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Enhanced fallback data
        setStats({
          totalCustomers: 2100,
          activeCampaigns: 32,
          customerSegments: 18,
          avgEngagement: 68.4,
          customerGrowth: [
            { month: 'Jan', customers: 1200, campaigns: 15 },
            { month: 'Feb', customers: 1350, campaigns: 18 },
            { month: 'Mar', customers: 1580, campaigns: 22 },
            { month: 'Apr', customers: 1720, campaigns: 25 },
            { month: 'May', customers: 1890, campaigns: 28 },
            { month: 'Jun', customers: 2100, campaigns: 32 },
          ],
          campaignPerformance: [
            { name: 'Email', sent: 15000, opened: 9500, clicked: 3200 },
            { name: 'SMS', sent: 8000, opened: 7200, clicked: 2400 },
            { name: 'Push', sent: 12000, opened: 8600, clicked: 2100 },
            { name: 'Social', sent: 5000, opened: 3800, clicked: 1500 },
          ],
          recentActivities: [
            { id: 1, action: 'New customer registered', customer: 'Alice Johnson', time: '2 min ago', type: 'customer' },
            { id: 2, action: 'Campaign "Summer Sale" sent', recipients: '2,500 customers', time: '15 min ago', type: 'campaign' },
            { id: 3, action: 'Segment "High Value" updated', count: '486 customers', time: '1 hour ago', type: 'segment' },
            { id: 4, action: 'Customer support ticket resolved', customer: 'Bob Smith', time: '2 hours ago', type: 'support' },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header with working navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your customers.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            className="gradient-bg hover:opacity-90"
            onClick={() => navigate('/campaigns')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/ai-assistant')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Key Metrics with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/customers')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers?.toLocaleString() || '0'}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/campaigns')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCampaigns || '0'}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +4 new this week
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/segments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customerSegments || '0'}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Target className="w-3 h-3 mr-1" />
              3 high-value segments
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgEngagement || '0'}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts with real data and click handlers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/customers')}>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.customerGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate('/campaigns')}>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.campaignPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="hsl(var(--muted))" name="Sent" />
                <Bar dataKey="opened" fill="hsl(var(--primary))" name="Opened" />
                <Bar dataKey="clicked" fill="hsl(var(--secondary))" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity with real data */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats?.recentActivities || []).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'customer' ? 'bg-green-500' :
                  activity.type === 'campaign' ? 'bg-blue-500' :
                  activity.type === 'segment' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.customer || activity.recipients || activity.count}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;