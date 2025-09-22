"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Target,
  BarChart3,
  Activity,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Users,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface DemoScenario {
  title: string;
  description: string;
  narrative: string;
  metrics: {
    resilienceImprovement: number;
    costReduction: number;
    downtimeReduction: number;
    stakeholderSatisfaction: number;
  };
  keyStories: Array<{
    rule: string;
    story: string;
    impact: string;
    metrics: string;
  }>;
}

/**
 * Demo Showcase Component
 * Comprehensive demonstration of The Aegrid Rules in action
 */
export function DemoShowcase() {
  const [scenario, setScenario] = useState<string>("default");
  const [demoData, setDemoData] = useState<DemoScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<number>(0);

  useEffect(() => {
    loadDemoData();
  }, [scenario]);

  const loadDemoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/demo/data?scenario=${scenario}`);
      if (response.ok) {
        const data = await response.json();
        setDemoData(data.demoData);
      } else {
        setError("Failed to load demo data");
      }
    } catch (error) {
      setError("Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };

  const getRuleIcon = (rule: string) => {
    if (rule.includes("Rule 1")) return <Target className="h-5 w-5 text-blue-600" />;
    if (rule.includes("Rule 2")) return <BarChart3 className="h-5 w-5 text-red-600" />;
    if (rule.includes("Rule 3")) return <Activity className="h-5 w-5 text-green-600" />;
    if (rule.includes("Rule 4")) return <Clock className="h-5 w-5 text-purple-600" />;
    return <Shield className="h-5 w-5 text-gray-600" />;
  };

  const getRuleColor = (rule: string) => {
    if (rule.includes("Rule 1")) return "border-blue-200 bg-blue-50";
    if (rule.includes("Rule 2")) return "border-red-200 bg-red-50";
    if (rule.includes("Rule 3")) return "border-green-200 bg-green-50";
    if (rule.includes("Rule 4")) return "border-purple-200 bg-purple-50";
    return "border-gray-200 bg-gray-50";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading demo scenario...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadDemoData} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!demoData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{demoData.title}</h2>
          <p className="text-muted-foreground">{demoData.description}</p>
        </div>
        <div className="flex gap-2">
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Scenario</SelectItem>
              <SelectItem value="crisis">Crisis Response</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadDemoData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Demo Narrative */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Demo Narrative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">{demoData.narrative}</p>
        </CardContent>
      </Card>

      {/* Key Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Key Success Stories
          </CardTitle>
          <CardDescription>
            Real-world examples of The Aegrid Rules in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoData.keyStories.map((story, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-md ${getRuleColor(story.rule)}`}
                onClick={() => setActiveStory(index)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2">
                      {getRuleIcon(story.rule)}
                      <Badge variant="outline">{story.rule}</Badge>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{story.story}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{story.impact}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{story.metrics}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-green-600">{demoData.metrics.resilienceImprovement}%</p>
                <p className="text-xs text-muted-foreground">Resilience Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-blue-600">{demoData.metrics.costReduction}%</p>
                <p className="text-xs text-muted-foreground">Cost Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-purple-600">{demoData.metrics.downtimeReduction}%</p>
                <p className="text-xs text-muted-foreground">Downtime Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-orange-600">{demoData.metrics.stakeholderSatisfaction}%</p>
                <p className="text-xs text-muted-foreground">Stakeholder Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Story Detail */}
      {activeStory !== null && demoData.keyStories[activeStory] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRuleIcon(demoData.keyStories[activeStory].rule)}
              {demoData.keyStories[activeStory].rule}
            </CardTitle>
            <CardDescription>
              Detailed view of this success story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">The Story</h4>
                <p className="text-muted-foreground">{demoData.keyStories[activeStory].story}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Impact</h4>
                <p className="text-muted-foreground">{demoData.keyStories[activeStory].impact}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Metrics</h4>
                <p className="text-muted-foreground">{demoData.keyStories[activeStory].metrics}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  View Demo
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
