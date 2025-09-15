"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Users, UserPlus, Settings, AlertTriangle, CheckCircle, Clock, Star } from "lucide-react";

/**
 * Team Management System implementing The Aegrid Rules
 * Rule 1: Purpose-driven team assignments based on asset criticality
 * Rule 2: Risk-based team allocation for RCM-lite strategies
 * Rule 3: Critical asset focus - most skilled attention to critical assets
 * @component TeamManagement
 * @example
 * ```tsx
 * <TeamManagement />
 * ```
 * @accessibility
 * - ARIA roles: main, table, dialog
 * - Keyboard navigation: Tab through team management interface
 * - Screen reader: Announces team assignments and criticality levels
 */
export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Mock team data - in real implementation, this would come from API
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "SUPERVISOR",
      specialisation: "Critical Infrastructure",
      experience: "8 years",
      currentAssignments: 3,
      criticalAssetExperience: true,
      status: "active",
      avatar: null,
      skills: ["Electrical", "Mechanical", "Safety Systems"],
      certifications: ["ISO 55000", "RCM Level 2"],
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      role: "CREW",
      specialisation: "General Maintenance",
      experience: "5 years",
      currentAssignments: 2,
      criticalAssetExperience: false,
      status: "active",
      avatar: null,
      skills: ["Plumbing", "HVAC", "General Repairs"],
      certifications: ["Trade Certificate"],
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@example.com",
      role: "CREW",
      specialisation: "Safety Systems",
      experience: "6 years",
      currentAssignments: 4,
      criticalAssetExperience: true,
      status: "busy",
      avatar: null,
      skills: ["Safety Systems", "Fire Protection", "Emergency Response"],
      certifications: ["Safety Officer", "Emergency Response"],
      lastActive: "30 minutes ago"
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@example.com",
      role: "SUPERVISOR",
      specialisation: "Asset Planning",
      experience: "12 years",
      currentAssignments: 2,
      criticalAssetExperience: true,
      status: "active",
      avatar: null,
      skills: ["Asset Management", "Planning", "Risk Assessment"],
      certifications: ["ISO 55000", "RCM Level 3", "Project Management"],
      lastActive: "15 minutes ago"
    }
  ];

  const assetAssignments = [
    {
      id: 1,
      assetName: "Main Water Treatment Plant",
      criticality: "Critical",
      assignedTo: "Sarah Johnson",
      priority: "High",
      dueDate: "2024-01-15",
      status: "In Progress",
      workType: "Preventive Maintenance"
    },
    {
      id: 2,
      assetName: "Emergency Generator System",
      criticality: "Critical",
      assignedTo: "Emma Rodriguez",
      priority: "High",
      dueDate: "2024-01-12",
      status: "Scheduled",
      workType: "Safety Inspection"
    },
    {
      id: 3,
      assetName: "Office HVAC System",
      criticality: "Medium",
      assignedTo: "Michael Chen",
      priority: "Medium",
      dueDate: "2024-01-20",
      status: "Planned",
      workType: "Routine Maintenance"
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "busy": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage team assignments based on asset criticality and RCM-lite strategies
          </p>
        </div>
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to the asset management team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" placeholder="Full name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="CREW">Crew Member</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialisation" className="text-right">
                  Specialisation
                </Label>
                <Input id="specialisation" className="col-span-3" placeholder="e.g., Critical Infrastructure" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddMemberOpen(false)}>
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Asset Experts</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.criticalAssetExperience).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Certified for critical assets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.reduce((sum, member) => sum + member.currentAssignments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all team members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetAssignments.filter(a => a.criticality === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring expert attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="assignments">Asset Assignments</TabsTrigger>
          <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisors</SelectItem>
                <SelectItem value="CREW">Crew Members</SelectItem>
                <SelectItem value="MANAGER">Managers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team assignments based on asset criticality and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Specialisation</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Critical Assets</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback>
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.specialisation}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.criticalAssetExperience ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {member.criticalAssetExperience ? "Certified" : "Training"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asset Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Assignments</CardTitle>
              <CardDescription>
                Current asset assignments prioritised by criticality and team expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Work Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.assetName}</TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(assignment.criticality)}>
                          {assignment.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.assignedTo}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.status}</Badge>
                      </TableCell>
                      <TableCell>{assignment.workType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Matrix Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Matrix</CardTitle>
              <CardDescription>
                Team capabilities aligned with asset criticality requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.specialisation}</div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-sm font-medium">Skills:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Certifications:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
