import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Lightbulb, Target, Users, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import api, { endpoints } from '@/lib/api';

interface AIInsight {
  id: string;
  type: 'segment' | 'campaign' | 'message' | 'analytics';
  title: string;
  description: string;
  confidence: number;
  tags: string[];
}

const AIAssistantPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'segment',
      title: 'High-Value Customer Opportunity',
      description: 'Consider creating a segment for customers who spent >$500 in last 90 days but haven\'t purchased in 30+ days.',
      confidence: 87,
      tags: ['retention', 'high-value', 'win-back']
    },
    {
      id: '2',
      type: 'campaign',
      title: 'Optimal Send Time Detected',
      description: 'Your email campaigns perform 23% better when sent on Tuesday between 10-11 AM.',
      confidence: 92,
      tags: ['timing', 'email', 'optimization']
    },
    {
      id: '3',
      type: 'message',
      title: 'Personalization Suggestion',
      description: 'Including customer\'s first name and last purchase category increases click rates by 18%.',
      confidence: 85,
      tags: ['personalization', 'performance', 'content']
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const response = await api.post('/ai/chat', { query });
      setResponse(response.data.response);
    } catch (error) {
      console.error('Error calling AI:', error);
      setResponse('Sorry, I encountered an error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'segment': return Target;
      case 'campaign': return Send;
      case 'message': return MessageSquare;
      case 'analytics': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 80) return 'bg-blue-100 text-blue-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="gradient-bg w-10 h-10 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Get intelligent insights and recommendations for your CRM strategy.</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by Gemini AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ask AI Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about customer segmentation, campaign optimization, or CRM best practices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., How can I create effective customer segments?"
                    className="h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="w-full gradient-bg hover:opacity-90"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>
              </form>

              {response && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <div className="gradient-bg w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-muted-foreground mb-2">AI Assistant</div>
                      <div className="prose prose-sm max-w-none">
                        {response.split('\n').map((line, index) => (
                          <p key={index} className="mb-2 last:mb-0">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common AI-powered tasks to help optimize your CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => setQuery('Suggest customer segments based on my data')}
                >
                  <Target className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Suggest Segments</div>
                    <div className="text-xs text-muted-foreground">AI-powered customer grouping</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => setQuery('What are the best campaign ideas for my business?')}
                >
                  <Send className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Campaign Ideas</div>
                    <div className="text-xs text-muted-foreground">Personalized campaign suggestions</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => setQuery('Optimize my message content for better engagement')}
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Message Optimization</div>
                    <div className="text-xs text-muted-foreground">Improve engagement rates</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => setQuery('Analyze my customer data for insights')}
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Data Analysis</div>
                    <div className="text-xs text-muted-foreground">Discover hidden patterns</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Proactive recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className="p-4 border rounded-lg hover-lift">
                    <div className="flex items-start gap-3">
                      <div className="gradient-bg w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getConfidenceColor(insight.confidence)}`}
                          >
                            {insight.confidence}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Smart Segmentation</div>
                  <div className="text-xs text-muted-foreground">AI-powered customer grouping</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Send className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Campaign Optimization</div>
                  <div className="text-xs text-muted-foreground">Timing and content suggestions</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Message Personalization</div>
                  <div className="text-xs text-muted-foreground">Dynamic content generation</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Predictive Analytics</div>
                  <div className="text-xs text-muted-foreground">Future behavior predictions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
