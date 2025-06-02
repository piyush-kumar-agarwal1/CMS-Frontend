import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Megaphone, Calendar, BarChart3, BrainCircuit, Sparkles, Clock, Tag,MessageSquare, Brain } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  segment: {
    _id: string;
    name: string;
    estimatedCount: number;
  };
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
  estimatedCount: number; // <-- use this!
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

  const [insights, setInsights] = useState<any | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);

  // New states
  const [messageIdeas, setMessageIdeas] = useState<string[]>([]);
  const [idealSendTime, setIdealSendTime] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

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
      // Fix: Use the correct endpoint format
      await api.post(`${endpoints.campaigns}/${campaignId}/send`);
      fetchCampaigns();
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

  const fetchCampaignInsights = async (campaignId: string) => {
    setInsightsLoading(true);
    setInsightsError('');
    setShowInsightsDialog(true);
    try {
      const response = await api.post(`/ai/analyze/${campaignId}`);
      setInsights(response.data);
    } catch (error) {
      setInsightsError('Failed to fetch AI insights.');
    } finally {
      setInsightsLoading(false);
    }
  };

  // New function to generate campaign ideas
  const generateCampaignIdeas = async (objective: string) => {
    if (!formData.segmentId || !objective) return;
    
    setAiLoading(true);
    try {
      // Call your backend (we'll create this endpoint)
      const response = await api.post('/ai/campaign-ideas', {
        segmentId: formData.segmentId,
        objective: objective,
        type: formData.type
      });
      
      setMessageIdeas(response.data.suggestions);
      setIdealSendTime(response.data.bestSendTime);
      setSuggestedTags(response.data.tags);
    } catch (error) {
      console.error('Error generating campaign ideas:', error);
      toast({
        title: "AI Error",
        description: "Could not generate campaign ideas",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Comment out the applySuggestion function
  /*
  const applySuggestion = (idea: string, tags: string[], sendTime: string, closePopover: boolean = false) => {
    console.log('Applying suggestion:', { idea, tags, sendTime }); // Debug log
    
    // Update the form data with all suggestion elements
    setFormData(prev => {
      const updated = {
        ...prev, 
        message: { 
          ...prev.message, 
          content: idea 
        },
        // Apply suggested send time if available (convert to datetime-local format if needed)
        scheduledDate: sendTime && sendTime !== 'No specific time suggested' ? 
          convertToDateTimeLocal(sendTime) : prev.scheduledDate
      };
      console.log('Updated form data:', updated); // Debug log
      return updated;
    });
    
    // Store the suggested tags for potential use in campaign creation
    setSuggestedTags(tags);
    
    // Visual feedback
    toast({
      title: "✨ AI Suggestion Applied",
      description: `Message content updated: "${idea.substring(0, 50)}${idea.length > 50 ? '...' : ''}"`,
      duration: 3000,
    });

    // Close the popover if requested
    if (closePopover) {
      const popoverElement = document.querySelector('[data-state="open"][role="dialog"]');
      if (popoverElement) {
        const closeButton = popoverElement.querySelector('button[aria-label="Close"]');
        if (closeButton) {
          (closeButton as HTMLButtonElement).click();
        }
      }
    }
    
    // Highlight the textarea to make the change obvious
    setTimeout(() => {
      // Try multiple selectors to find the content textarea
      const textarea = document.getElementById('content') || 
                      document.getElementById('edit-content') ||
                      document.querySelector('textarea[placeholder*="message content"]') ||
                      document.querySelector('textarea');
                      
      if (textarea) {
        console.log('Found textarea, applying highlight'); // Debug log
        
        // Apply highlight effect
        textarea.classList.add('border-primary', 'ring-2', 'ring-primary', 'border-2');
        
        // Scroll it into view
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus the textarea to make it more obvious
        textarea.focus();
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          textarea.classList.remove('border-primary', 'ring-2', 'ring-primary', 'border-2');
        }, 3000);
      } else {
        console.log('Textarea not found!'); // Debug log
      }
    }, 300); // Increased delay to ensure DOM is updated
  };
  */

  // Comment out the convertToDateTimeLocal helper function
  /*
  const convertToDateTimeLocal = (aiTime: string): string => {
    try {
      // If it's already in the right format, return as-is
      if (aiTime.includes('T') && aiTime.length >= 16) {
        return aiTime.substring(0, 16);
      }
      
      // Try to parse common AI response formats like "Tuesday, 10 AM"
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // Default to tomorrow at a reasonable time
      tomorrow.setHours(10, 0, 0, 0);
      
      return tomorrow.toISOString().substring(0, 16);
    } catch (error) {
      console.error('Error converting time:', error);
      return '';
    }
  };
  */

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage targeted marketing campaigns for your customer segments
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* AI Campaign Ideas Button - NOW AT THE TOP */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-auto">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generate AI Ideas
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">AI-Powered Campaign Ideas</h4>
                <p className="text-sm text-muted-foreground">
                  Get creative suggestions for your campaign message, tags, and ideal send time.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="objective">Campaign Objective</Label>
                    <Input
                      id="objective"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g., Increase sales"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-segment">Segment</Label>
                    <Select value={formData.segmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, segmentId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map(segment => (
                          <SelectItem key={segment._id} value={segment._id}>
                            {segment.name} ({segment.estimatedCount} customers)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setMessageIdeas([])}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Ideas
                  </Button>
                  <Button 
                    onClick={() => {
                      generateCampaignIdeas(formData.description);
                    }}
                    className="bg-primary text-primary-foreground"
                  >
                    {aiLoading ? 'Generating...' : 'Generate Ideas'}
                  </Button>
                </div>

                {messageIdeas.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Suggested Message Ideas</h5>
                    <ul className="list-disc ml-5 space-y-2">
                      {messageIdeas.map((idea, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-sm">{idea}</span>
                          {/* Comment out the Apply button for now */}
                          {/*
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => applySuggestion(idea, suggestedTags, idealSendTime, true)}
                          >
                            <Sparkles className="mr-1 h-4 w-4" />
                            Apply All
                          </Button>
                          */}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {idealSendTime && (
                  <div className="mt-4">
                    <strong>AI Suggested Send Time:</strong>
                    <p>{idealSendTime}</p>
                  </div>
                )}

                {suggestedTags.length > 0 && (
                  <div className="mt-4">
                    <strong>Suggested Tags:</strong>
                    <div className="flex gap-2 flex-wrap">
                      {suggestedTags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-200 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
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
                            {segment.name} ({segment.estimatedCount} customers)
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

              {/* After the campaign name and description fields */}
              {formData.segmentId && (
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-sm flex items-center">
                        <BrainCircuit className="w-4 h-4 mr-2 text-primary" />
                        AI Campaign Assistant
                      </CardTitle>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Generate Ideas
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">What's your campaign objective?</h4>
                            <Select onValueChange={(value) => generateCampaignIdeas(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select objective" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="win_back">Win back inactive customers</SelectItem>
                                <SelectItem value="upsell">Upsell to existing customers</SelectItem>
                                <SelectItem value="new_product">Introduce a new product</SelectItem>
                                <SelectItem value="discount">Promote a discount/sale</SelectItem>
                                <SelectItem value="event">Announce an event</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {aiLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messageIdeas.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs flex items-center">
                              <Sparkles className="w-3 h-3 mr-1 text-primary" />
                              Message Suggestions:
                            </Label>
                            <div className="space-y-1">
                              {messageIdeas.map((idea, i) => (
                                <div key={i} className="text-xs p-2 bg-white border rounded-md relative">
                                  {idea}
                                  {/* Comment out the Apply button for now */}
                                  {/*
                                  <div className="mt-2 flex justify-end">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="flex items-center"
                                      onClick={() => applySuggestion(idea, suggestedTags, idealSendTime)}
                                    >
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      Apply All
                                    </Button>
                                  </div>
                                  */}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {idealSendTime && (
                          <div>
                            <Label className="text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-primary" />
                              Best Send Time:
                            </Label>
                            <p className="text-xs">{idealSendTime}</p>
                          </div>
                        )}
                        
                        {suggestedTags.length > 0 && (
                          <div>
                            <Label className="text-xs flex items-center">
                              <Tag className="w-3 h-3 mr-1 text-primary" />
                              Suggested Tags:
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {suggestedTags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                  <div>Segment: {campaign.segment?.name || 'Unknown'}</div>
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
                    <Button 
                      size="sm" 
                      onClick={() => handleSendCampaign(campaign._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </Button>
                  )}
                  {campaign.status === 'sent' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fetchCampaignInsights(campaign._id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View AI Insights
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
                        {segment.name} ({segment.estimatedCount} customers)
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

      {/* AI Insights Dialog */}
      <Dialog open={showInsightsDialog} onOpenChange={setShowInsightsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Campaign Insights
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis and recommendations for your campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {insightsLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Analyzing campaign...</span>
              </div>
            )}
            
            {insightsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-medium">Error</div>
                <div className="text-red-600 text-sm">{insightsError}</div>
              </div>
            )}
            
            {insights && (
              <div className="space-y-6">
                {/* Performance Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance Summary
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{insights.summary}</p>
                </div>

                {/* Message Suggestions */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message Suggestions
                  </h3>
                  <div className="space-y-2">
                    {insights.suggestions.map((suggestion: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-white rounded border">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-green-700">{i + 1}</span>
                        </div>
                        <p className="text-green-800 text-sm flex-1">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Tags */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Recommended Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best Send Time */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Optimal Send Time
                  </h3>
                  <p className="text-orange-800 text-sm">{insights.nextBestTime}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowInsightsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsPage;