import React, { useState, useEffect } from 'react';
import { Plus, Send, Edit2, Trash2, Eye, Calendar, Users, BarChart3, Megaphone, Mail, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import api, { endpoints } from '@/lib/api';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  segmentId: string;
  segmentName?: string;
  message: {
    subject?: string;
    content: string;
    template?: string;
  };
  scheduledDate?: string;
  sentDate?: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Segment {
  _id: string;
  name: string;
  customerCount: number;
}

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'email' as 'email' | 'sms' | 'push',
    segmentId: '',
    message: {
      subject: '',
      content: '',
      template: '',
    } as { subject?: string; content: string; template?: string; },
    scheduledDate: ''
  });

  // Helper functions - ADD THESE MISSING FUNCTIONS
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'sms':
        return '💬';
      case 'push':
        return '🔔';
      default:
        return '📧';
    }
  };

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      case 'sent':
        return 'default';
      case 'paused':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.campaigns);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await api.get(endpoints.segments);
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const message: { subject?: string; content: string; template?: string; } = {
        content: formData.message.content,
      };
      
      if (formData.message.subject?.trim()) {
        message.subject = formData.message.subject;
      }
      
      if (formData.message.template?.trim()) {
        message.template = formData.message.template;
      }

      const campaignData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        segmentId: formData.segmentId,
        message,
        scheduledDate: formData.scheduledDate || undefined,
        status: formData.scheduledDate ? 'scheduled' : 'draft'
      };

      const response = await api.post(endpoints.campaigns, campaignData);
      setCampaigns([...campaigns, response.data]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      segmentId: campaign.segmentId,
      message: {
        subject: campaign.message?.subject || '',
        content: campaign.message?.content || '',
        template: campaign.message?.template || '',
      },
      scheduledDate: campaign.scheduledDate ? new Date(campaign.scheduledDate).toISOString().slice(0, 16) : ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      const message: { subject?: string; content: string; template?: string; } = {
        content: formData.message.content,
      };
      
      if (formData.message.subject?.trim()) {
        message.subject = formData.message.subject;
      }
      
      if (formData.message.template?.trim()) {
        message.template = formData.message.template;
      }

      const campaignData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        segmentId: formData.segmentId,
        message,
        scheduledDate: formData.scheduledDate || undefined,
      };

      const response = await api.put(endpoints.campaign(selectedCampaign._id), campaignData);
      
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(c => c._id === selectedCampaign._id ? response.data : c)
      );
      
      setIsEditDialogOpen(false);
      setSelectedCampaign(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      await api.post(endpoints.campaignSend(campaignId));
      fetchCampaigns(); // Refresh to get updated status
      toast({
        title: "Success",
        description: "Campaign sent successfully",
      });
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await api.delete(endpoints.campaign(campaignId));
      setCampaigns(campaigns.filter(c => c._id !== campaignId));
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'email',
      segmentId: '',
      message: {
        subject: '',
        content: '',
        template: '',
      } as { subject?: string; content: string; template?: string; },
      scheduledDate: ''
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.status === activeTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage targeted marketing campaigns for your customer segments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign for your target segment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Black Friday Sale"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">📧 Email</SelectItem>
                      <SelectItem value="sms">💬 SMS</SelectItem>
                      <SelectItem value="push">🔔 Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the campaign"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="segment">Target Segment</Label>
                  <Select value={formData.segmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, segmentId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map(segment => (
                        <SelectItem key={segment._id} value={segment._id}>
                          {segment.name} ({segment.customerCount} customers)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>

              {formData.type === 'email' && (
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.message.subject}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      message: { ...prev.message, subject: e.target.value }
                    }))}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={formData.message.content}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    message: { ...prev.message, content: e.target.value }
                  }))}
                  placeholder="Enter your message content here..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(campaign.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {campaign.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <div>Segment: {campaign.segmentName || 'Unknown'}</div>
                    {campaign.scheduledDate && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled: {new Date(campaign.scheduledDate).toLocaleString()}
                      </div>
                    )}
                    {campaign.sentDate && (
                      <div className="flex items-center gap-1 mt-1">
                        <Send className="h-3 w-3" />
                        Sent: {new Date(campaign.sentDate).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {campaign.status === 'sent' && campaign.stats && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Sent:</span> <span>{campaign.stats.sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivered:</span> <span>{campaign.stats.delivered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opened:</span> <span>{campaign.stats.opened}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clicked:</span> <span>{campaign.stats.clicked}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(campaign)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCampaign(campaign._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                    <Button size="sm" onClick={() => handleSendCampaign(campaign._id)}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </Button>
                  )}
                  {campaign.status === 'sent' && (
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {activeTab === 'all' ? 'No campaigns yet' : `No ${activeTab} campaigns`}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {activeTab === 'all' 
                  ? 'Create your first marketing campaign to engage with your customers.'
                  : `You don't have any ${activeTab} campaigns at the moment.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update campaign details and message content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Campaign Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Black Friday Sale"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Campaign Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="sms">💬 SMS</SelectItem>
                    <SelectItem value="push">🔔 Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the campaign"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-segment">Target Segment</Label>
                <Select value={formData.segmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, segmentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map(segment => (
                      <SelectItem key={segment._id} value={segment._id}>
                        {segment.name} ({segment.customerCount} customers)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-scheduledDate">Schedule Date (Optional)</Label>
                <Input
                  id="edit-scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            </div>

            {formData.type === 'email' && (
              <div>
                <Label htmlFor="edit-subject">Email Subject</Label>
                <Input
                  id="edit-subject"
                  value={formData.message.subject}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    message: { ...prev.message, subject: e.target.value }
                  }))}
                  placeholder="Enter email subject"
                />
              </div>
            )}

            <div>
              <Label htmlFor="edit-content">Message Content</Label>
              <Textarea
                id="edit-content"
                rows={6}
                value={formData.message.content}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  message: { ...prev.message, content: e.target.value }
                }))}
                placeholder="Enter your message content here..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCampaign}>Update Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsPage;