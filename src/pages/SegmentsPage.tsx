import React, { useState, useEffect } from 'react';
import { Plus, Users, Filter, Edit2, Trash2, Eye, Send } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

// Add missing interfaces
interface SegmentRule {
  field: string;
  operator: string;
  value: string;
  type: 'and' | 'or';
}

interface SegmentCriteria {
  rules: SegmentRule[];
  logic: 'AND' | 'OR';
}

interface Segment {
  _id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

const SegmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: [{ field: 'totalSpent', operator: 'gte', value: '', type: 'and' as const }]
  });

  const ruleFields = [
    { value: 'totalSpent', label: 'Total Spent' },
    { value: 'total_spend', label: 'Total Spend' },
    { value: 'orderCount', label: 'Order Count' },
    { value: 'visits', label: 'Visit Count' },
    { value: 'lastOrderDate', label: 'Last Order Date' },
    { value: 'last_active_date', label: 'Last Active Date' },
    { value: 'location', label: 'Location' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'createdAt', label: 'Registration Date' }
  ];

  const operators = [
    { value: 'eq', label: 'Equals' },
    { value: 'ne', label: 'Not Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lt', label: 'Less Than' },
    { value: 'lte', label: 'Less Than or Equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' }
  ];

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.segments);
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch segments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async () => {
    try {
      const criteria = {
        rules: formData.rules.map(rule => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value
        })),
        logic: 'AND' as const
      };

      const response = await api.post(endpoints.segments, {
        name: formData.name,
        description: formData.description,
        criteria
      });

      setSegments([...segments, response.data]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Segment created successfully",
      });
    } catch (error) {
      console.error('Error creating segment:', error);
      toast({
        title: "Error",
        description: "Failed to create segment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSegment = async () => {
    if (!selectedSegment) return;

    try {
      const criteria = {
        rules: formData.rules.map(rule => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value
        })),
        logic: 'AND' as const
      };

      const response = await api.put(endpoints.segment(selectedSegment._id), {
        name: formData.name,
        description: formData.description,
        criteria
      });

      setSegments(segments.map(s => s._id === selectedSegment._id ? response.data : s));
      setIsEditDialogOpen(false);
      setSelectedSegment(null);
      resetForm();
      toast({
        title: "Success",
        description: "Segment updated successfully",
      });
    } catch (error) {
      console.error('Error updating segment:', error);
      toast({
        title: "Error",
        description: "Failed to update segment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this segment?')) return;

    try {
      await api.delete(endpoints.segment(segmentId));
      setSegments(segments.filter(s => s._id !== segmentId));
      toast({
        title: "Success",
        description: "Segment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast({
        title: "Error",
        description: "Failed to delete segment",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaignForSegment = (segmentId: string) => {
    // Navigate to campaigns page with the selected segment
    navigate('/campaigns', { state: { selectedSegmentId: segmentId } });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rules: [{ field: 'totalSpent', operator: 'gte', value: '', type: 'and' }]
    });
  };

  const openEditDialog = (segment: Segment) => {
    setSelectedSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description,
      rules: segment.criteria?.rules?.map(rule => ({ ...rule, type: 'and' as const })) || [{ field: 'totalSpent', operator: 'gte', value: '', type: 'and' }]
    });
    setIsEditDialogOpen(true);
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { field: 'totalSpent', operator: 'gte', value: '', type: 'and' }]
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRule = (index: number, field: keyof SegmentRule, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Customer Segments</h1>
          <p className="text-muted-foreground">
            Create and manage customer segments for targeted marketing
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
              <DialogDescription>
                Define criteria to automatically group customers into segments
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Segment Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., High Value Customers"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the segment"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Segment Rules</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRule}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </Button>
                </div>
                
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select value={rule.field} onValueChange={(value) => updateRule(index, 'field', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {ruleFields.map(field => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Select value={rule.operator} onValueChange={(value) => updateRule(index, 'operator', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                    </div>
                    
                    {formData.rules.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeRule(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSegment}>Create Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {segment.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {segment.customerCount || 0}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(segment.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(segment)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteSegment(segment._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" onClick={() => handleCreateCampaignForSegment(segment._id)}>
                <Send className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No segments yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first customer segment to get started with targeted marketing.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
            <DialogDescription>
              Update segment criteria and details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Segment Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., High Value Customers"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the segment"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Segment Rules</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRule}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>
              
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Select value={rule.field} onValueChange={(value) => updateRule(index, 'field', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {ruleFields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select value={rule.operator} onValueChange={(value) => updateRule(index, 'operator', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Input
                      value={rule.value}
                      onChange={(e) => updateRule(index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                  </div>
                  
                  {formData.rules.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeRule(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSegment}>Update Segment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SegmentsPage;