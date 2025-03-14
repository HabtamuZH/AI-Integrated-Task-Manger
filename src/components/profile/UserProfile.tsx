import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUser, getAchievements } from "@/lib/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  Edit,
  Save,
} from "lucide-react";

interface UserProfileProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userPhone?: string;
  userLocation?: string;
  userJoinDate?: string;
  userBio?: string;
  tasksCompleted?: number;
  currentStreak?: number;
  achievements?: Array<{ title: string; date: string; description: string }>;
  onSaveProfile?: (profileData: any) => void;
}

const UserProfile = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  userPhone = "+1 (555) 123-4567",
  userLocation = "San Francisco, CA",
  userJoinDate = "January 15, 2023",
  userBio = "Task management enthusiast and productivity expert. I love organizing my work and helping others do the same.",
  tasksCompleted = 157,
  currentStreak = 8,
  achievements = [
    {
      title: "Early Bird",
      date: "March 10, 2023",
      description: "Completed 5 tasks before 9 AM",
    },
    {
      title: "Productivity Master",
      date: "April 22, 2023",
      description: "Completed 50 tasks in a week",
    },
    {
      title: "Consistency King",
      date: "May 15, 2023",
      description: "Maintained a 7-day streak",
    },
  ],
  onSaveProfile = () => {},
}: UserProfileProps) => {
  const { user, profile } = useAuth();
  const [userAchievements, setUserAchievements] = useState(achievements);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: userPhone,
    location: userLocation,
    bio: userBio,
  });

  useEffect(() => {
    // Load user profile data if available
    if (profile) {
      setProfileData({
        name: profile.name || userName,
        email: profile.email || userEmail,
        phone: profile.phone || userPhone,
        location: profile.location || userLocation,
        bio: profile.bio || userBio,
      });
    }

    // Load achievements from database
    const loadAchievements = async () => {
      if (user) {
        try {
          const achievements = await getAchievements(user.id);
          if (achievements.length > 0) {
            setUserAchievements(achievements);
          }
        } catch (error) {
          console.error("Error loading achievements:", error);
        }
      }
    };

    loadAchievements();
  }, [user, profile, userName, userEmail, userPhone, userLocation, userBio]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedProfile = await updateUser(user.id, profileData);
      if (updatedProfile) {
        onSaveProfile(updatedProfile);
        alert("Profile updated successfully!");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">Profile</CardTitle>
                  <CardDescription>
                    View and manage your personal information
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                    <AvatarImage src={userAvatar} alt={profileData.name} />
                    <AvatarFallback className="text-4xl">
                      {profileData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}

                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentStreak} day streak
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {tasksCompleted} tasks completed
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {profileData.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Member since {userJoinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {isEditing && (
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setProfileData({
                      name: profile?.name || userName,
                      email: profile?.email || userEmail,
                      phone: profile?.phone || userPhone,
                      location: profile?.location || userLocation,
                      bio: profile?.bio || userBio,
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Achievements</CardTitle>
              <CardDescription>
                Track your progress and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userAchievements.map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-primary/10 mr-4">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked on {achievement.date}
                        </p>
                      </div>
                    </div>
                    {index < userAchievements.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
