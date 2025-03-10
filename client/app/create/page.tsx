"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useProject } from './ProjectContext';

const ProjectSubmissionForm = () => {
  const { toast } = useToast();
  const { 
    submitProject, 
    isLoading, 
    error, 
    transactionStatus, 
    isSuccess, 
    walletAddress, 
    isConnected 
  } = useProject();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    target: '',
    deadline: '',
    team: [
      {
        member: '', // Will be filled with wallet address
        role: 'Owner'
      }
    ]
  });

  // Update owner's address when wallet connects
  useEffect(() => {
    if (walletAddress) {
      const updatedTeam = [...formData.team];
      updatedTeam[0] = {
        ...updatedTeam[0],
        member: walletAddress
      };
      
      setFormData(prevData => ({
        ...prevData,
        team: updatedTeam
      }));
    }
  }, [walletAddress]);

  // Display error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  // Display success toast when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "Your project has been successfully created on the blockchain",
      });
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        image: '',
        target: '',
        deadline: '',
        team: [
          {
            member: walletAddress,
            role: 'Owner'
          }
        ]
      });
    }
  }, [isSuccess, toast, walletAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeam = [...formData.team];
    updatedTeam[index] = {
      ...updatedTeam[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      team: updatedTeam
    });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...formData.team, { member: '', role: '' }]
    });
  };

  const removeTeamMember = (index) => {
    // Don't allow removing the owner
    if (index === 0) return;
    
    const updatedTeam = formData.team.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      team: updatedTeam
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to submit a project",
      });
      return;
    }
    
    // Validate form
    if (!formData.title || !formData.description || !formData.image || 
        !formData.target || !formData.deadline) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    // Validate team members
    for (const member of formData.team) {
      if (!member.member || !member.role) {
        toast({
          variant: "destructive",
          title: "Incomplete team information",
          description: "Please provide both wallet address and role for all team members",
        });
        return;
      }
    }
    
    // Prepare project data
    const projectData = {
      ...formData,
      target: parseFloat(formData.target),
      deadline: new Date(formData.deadline).getTime() / 1000, // Convert to UNIX timestamp
    };
    
    // Submit project to the blockchain
    await submitProject(projectData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a New Project</CardTitle>
        <CardDescription>Fill in the details to create your crowdfunding project on the blockchain</CardDescription>
      </CardHeader>
      
      {!isConnected && (
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to submit a project
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      {transactionStatus && (
        <CardContent>
          <Alert className={isSuccess ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
            <AlertTitle>{isSuccess ? "Success" : "Transaction Status"}</AlertTitle>
            <AlertDescription>
              {transactionStatus}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              required
              placeholder="Enter project title"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              required
              placeholder="Describe your project"
              className="min-h-32"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              name="image" 
              value={formData.image} 
              onChange={handleInputChange} 
              required
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Funding Target (ETH)</Label>
              <Input 
                id="target" 
                name="target" 
                type="number" 
                min="0" 
                step="0.01" 
                value={formData.target} 
                onChange={handleInputChange} 
                required
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                value={formData.deadline} 
                onChange={handleInputChange} 
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addTeamMember}
                className="flex items-center gap-1"
                disabled={isLoading}
              >
                <PlusCircle className="h-4 w-4" /> Add Member
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.team.map((member, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`member-${index}`}>Wallet Address</Label>
                    <Input 
                      id={`member-${index}`}
                      value={member.member} 
                      onChange={(e) => handleTeamMemberChange(index, 'member', e.target.value)}
                      required
                      placeholder="0x..."
                      disabled={index === 0 || isLoading} // Owner address can't be changed
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`role-${index}`}>Role</Label>
                    <Input 
                      id={`role-${index}`}
                      value={member.role} 
                      onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                      required
                      placeholder="Role in project"
                      disabled={index === 0 || isLoading} // Owner role can't be changed
                    />
                  </div>
                  
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="mt-8" 
                      onClick={() => removeTeamMember(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isConnected}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              "Submit Project"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectSubmissionForm;