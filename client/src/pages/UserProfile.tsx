
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Shield,
  Settings,
  Heart,
  Activity,
  Award,
  Bell,
  Lock
} from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    role: 'citizen',
    joinDate: '2024-01-15',
    bio: 'Passionate about smart city technologies and community engagement. Active participant in local environmental initiatives.'
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', icon: Shield, color: 'text-red-400', bgColor: 'bg-red-400/10' };
      case 'operator':
        return { label: 'City Operator', icon: Settings, color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
      default:
        return { label: 'Citizen', icon: Heart, color: 'text-green-400', bgColor: 'bg-green-400/10' };
    }
  };

  const roleInfo = getRoleInfo(profileData.role);
  const RoleIcon = roleInfo.icon;

  const stats = [
    { label: 'Events Attended', value: '12', icon: Calendar },
    { label: 'Community Score', value: '847', icon: Award },
    { label: 'Days Active', value: '156', icon: Activity },
    { label: 'Contributions', value: '23', icon: Heart },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            User Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="glass-morphism p-8 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Avatar and Role */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-full ${roleInfo.bgColor}`}>
                      <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${roleInfo.bgColor}`}>
                      <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                      <span className={`font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      Member since {new Date(profileData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-background/30 rounded-lg">
                        <p className="text-muted-foreground">{profileData.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Activity Stats</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="font-bold text-primary">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notification Settings</span>
                </button>
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </button>
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
