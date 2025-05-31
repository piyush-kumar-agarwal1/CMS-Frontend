import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, Mail, DollarSign, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import api, { endpoints } from '@/lib/api';

interface AnalyticsData {
  totalCustomers: number;
  totalSegments: number;
  totalCampaigns: number;
  totalRevenue: number;
  campaignPerformance: Array<{
    name: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
  customerGrowth: Array<{
    month: string;
    customers: number;
    revenue: number;
  }>;
  segmentDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${endpoints.analytics}?timeRange=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // Mock data for development
      const mockData: AnalyticsData = {
        totalCustomers: 1248,
        totalSegments: 8,
        totalCampaigns: 23,
        totalRevenue: 89540,
        campaignPerformance: [
          { name: 'Black Friday Sale', sent: 1000, delivered: 980, opened: 450, clicked: 123 },
          { name: 'Product Launch', sent: 800, delivered: 785, opened: 321, clicked: 87 },
          { name: 'Newsletter #4', sent: 1200, delivered: 1180, opened: 234, clicked: 45 },
          { name: 'Customer Survey', sent: 500, delivered: 495, opened: 189, clicked: 67 },
          { name: 'Holiday Promo', sent: 1500, delivered: 1450, opened: 678, clicked: 234 },
        ],
        customerGrowth: [
          { month: 'Jan', customers: 100, revenue: 12000 },
          { month: 'Feb', customers: 180, revenue: 19000 },
          { month: 'Mar', customers: 250, revenue: 28000 },
          { month: 'Apr', customers: 340, revenue: 35000 },
          { month: 'May', customers: 480, revenue: 42000 },
          { month: 'Jun', customers: 620, revenue: 58000 },
          { month: 'Jul', customers: 780, revenue: 67000 },
          { month: 'Aug', customers: 920, revenue: 74000 },
          { month: 'Sep', customers: 1050, revenue: 81000 },
          { month: 'Oct', customers: 1180, revenue: 87000 },
          { month: 'Nov', customers: 1248, revenue: 89540 },
        ],
        segmentDistribution: [
          { name: 'High Value', value: 324, color: COLORS[0] },
          { name: 'Regular', value: 567, color: COLORS[1] },
          { name: 'New Customers', value: 234, color: COLORS[2] },
          { name: 'Inactive', value: 123, color: COLORS[3] },
        ]
      };
      setAnalytics(mockData);
      
      toast({
        title: "Using Demo Data",
        description: "Analytics endpoint not available, showing sample data",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your CRM performance and customer insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSegments}</div>
            <p className="text-xs text-muted-foreground">
              +2 new segments created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              +5 campaigns this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1 min-h-[350px]">
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Monthly customer acquisition and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 200 : 300}>
                  <LineChart data={analytics.customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Distribution</CardTitle>
                <CardDescription>Customer distribution across segments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.segmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.segmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {analytics.segmentDistribution.map((entry, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}: {entry.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Email campaign delivery and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                  <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                  <Bar dataKey="opened" fill="#ffc658" name="Opened" />
                  <Bar dataKey="clicked" fill="#ff7300" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Metrics</CardTitle>
              <CardDescription>Detailed customer analytics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Customer Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Detailed customer analytics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance</CardTitle>
              <CardDescription>How your customer segments are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Segment Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Detailed segment performance metrics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
