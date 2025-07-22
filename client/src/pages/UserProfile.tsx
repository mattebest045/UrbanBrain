import React, { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  Calendar,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  MapPin,
  User,
  Phone,
  Save,
  Search,
  Settings,
  Send,
  Shield,
  X,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { useAuth } from '@/hooks/AuthContext';
import { UserProfile as UserProfileType, UserStatusMap } from '@/types/userProfile';
import { useDebounce } from '@/hooks/useDebounce';

const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileType>({
    nome: '',
    cognome: '',
    email: '',
    luogo: '',
    tipo: 'citizen', // Default role, can be 'citizen', 'operator', or 'admin'
    createdAt: '', // ISO date string
    stato: 1, // Default status
    id: '', // User ID
  });
  const { updateUserProfile, logout } = useAuth();
  const [editData, setEditData] = useState(profileData);
  const [accountSearch, setAccountSearch] = useState('');
  const [accountStatus, setAccountStatus] = useState(1);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  // Gestione della ricerca degli utenti per l'amministratore
  const debouncedSearch = useDebounce(accountSearch, 400);
  const [userResults, setUserResults] = useState<UserProfileType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      if (!token) throw new Error('Token mancante');

      const response = await api.get('/user/profile', {
        headers: {
          accessToken: token, // questo deve corrispondere a req.header("accessToken")
        },
      });
      setProfileData(response.data.data);
    } catch (err: any) {
      console.table(err);
      // Gestione degli errori, ad esempio mostrare un messaggio all'utente
      console.error('Errore nel recupero del profilo:', err);
      const status = err?.response?.statusCode;
      console.log('Status code:', status);
      if (status === 498) {
        // Token scaduto
        localStorage.removeItem('accessToken');
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
      } else {
        // Altri errori
        toast({
          title: 'Error',
          description:
            'Your session has expired or you are not authorized to view this page. Please log in again.',
          variant: 'destructive',
        });
        // Redirect alla pagina di login
        navigate('/login');
      }
      // console.error('Errore nel recupero profilo:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.get(`/user/search?q=${debouncedSearch}`, {
        headers: {
          accessToken: token, // questo deve corrispondere a req.header("accessToken")
        },
      });
      setUserResults(res.data.data); // array di utenti trovati
      console.log('Search results: ', userResults);
    } catch (err) {
      console.error('Errore nel recupero utenti:', err);
      setUserResults([]);
    }
  };

  useEffect(() => {
    fetchProfile();

    if (!debouncedSearch.trim()) {
      setUserResults([]);
      return;
    }

    fetchUsers();
  }, [debouncedSearch]);

  if (loading) return <p>Caricamento profilo...</p>;
  if (!profileData) return <p>Impossibile caricare i dati utente.</p>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    // Add API call to save changes
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token mancante');
      api.put('/user/modify', editData, {
        headers: {
          accessToken: token,
        },
      });
      // Aggiorno anche la label nella navbar
      updateUserProfile(editData.nome, editData.cognome, editData.luogo);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (err: any) {
      console.error('Errore nel salvataggio del profilo:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token mancante');
      await api.delete('/user/', {
        headers: {
          accessToken: token,
        },
      });
      logout();
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
        variant: 'destructive',
      });
    } catch (err: any) {
      console.error("Errore nella cancellazione dell'account:", err);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again later.',
        variant: 'destructive',
      });
    }
    // Redirect to home or login page
    navigate('/');
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token mancante');
      await api.put(
        '/user/modify/password',
        { newPassword },
        {
          headers: {
            accessToken: token,
          },
        }
      );
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully changed.',
      });
      setShowPasswordForm(false);
      setNewPassword('');
    } catch (err: any) {
      console.error('Errore nel cambio password:', err);
      toast({
        title: 'Error',
        description: 'Failed to change password. Please try again later.',
        variant: 'destructive',
      });
    }
  };
  const getRoleInfo = (tipo: string) => {
    switch (tipo) {
      case 'admin':
        return {
          label: 'Administrator',
          icon: Shield,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
        };
      case 'operatore':
        return {
          label: 'City Operator',
          icon: Settings,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/10',
        };
      default:
        return {
          label: 'cittadino',
          icon: Heart,
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
        };
    }
  };

  const getStatusLabel = (status: number): string => {
    const statusLabels: Record<number, string> = {
      0: 'Inactive',
      1: 'Active',
      2: 'Warning',
      3: 'Banned',
    };
    return statusLabels[status] || 'Unknown';
  };

  const roleInfo = getRoleInfo(profileData.tipo);
  const RoleIcon = roleInfo.icon;

  const stats = [
    { label: 'Account Status', value: UserStatusMap[profileData.stato], icon: Award },
    {
      label: 'Member Since',
      value: new Date(profileData.createdAt).toLocaleDateString('it-IT'),
      icon: Activity,
    },
  ];

  const handleAccountManagement = async () => {
    if (!selectedUserId) return;

    try {
      const token = localStorage.getItem('accessToken');
      await api.put(
        `/user/modify/state/${selectedUserId}`,
        {
          stato: accountStatus,
        },
        {
          headers: {
            accessToken: token, // questo deve corrispondere a req.header("accessToken")
          },
        }
      );
      toast({
        title: 'Stato aggiornato con successo',
        description: `L'utente con ID ${selectedUserId} ha ora lo stato ${getStatusLabel(
          accountStatus
        )}`,
      });
      setAccountSearch('');
      setSelectedUserId(null);
      setUserResults([]);
    } catch (err) {
      console.error("Errore nell'aggiornamento dello stato:", err);
      toast({ title: "Errore nell'aggiornamento dello stato", variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">User Profile</h1>
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
                    <div
                      className={`absolute -bottom-2 -right-2 p-2 rounded-full ${roleInfo.bgColor}`}
                    >
                      <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {profileData.nome} {profileData.cognome}
                    </h3>
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${roleInfo.bgColor}`}
                    >
                      <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                      <span className={`font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">Email {profileData.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nome"
                        value={editData.nome}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.nome}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="cognome"
                        value={editData.cognome}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.cognome}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="luogo"
                        value={editData.luogo}
                        onChange={handleInputChange}
                        placeholder="Enter your location"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-background/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.luogo}</span>
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

              {/* Role-based Action Buttons */}
              <div className="mt-6 space-y-3">
                {profileData.tipo === 'citizen' && (
                  <button className="w-full btn-secondary flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>My Subscriptions</span>
                  </button>
                )}

                {profileData.tipo === 'operator' && (
                  <button className="w-full btn-secondary flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>My Events</span>
                  </button>
                )}

                {profileData.tipo === 'admin' && (
                  <>
                    <button className="w-full btn-secondary flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Events I Participate In</span>
                    </button>
                    <button className="w-full btn-secondary flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Events I Created</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="h-4 w-full"></div> */}
        {/* Quick Actions */}
        <div className="glass-morphism p-6 rounded-xl mt-5">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>

          <div className="space-y-3">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full flex items-center space-x-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/70 transition"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setNewPassword('');
                      }}
                      className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={deleteAccount}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
            >
              <Settings className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
        
        {profileData.tipo === 'admin' && (
          <div className="glass-morphism p-6 rounded-xl mt-5">
            <h3 className="text-lg font-bold mb-4">Account Management Panel</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">User ID or Email</label>
                <input
                  type="text"
                  value={accountSearch}
                  onChange={(e) => setAccountSearch(e.target.value)}
                  placeholder="Enter user ID or email address"
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
              {userResults.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select User</label>
                  {/* <select
                    value={selectedUserId ?? ''}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  >
                    <option value="" disabled>
                      Select a user
                    </option>
                    {userResults.map((user) => (
                      <option key={user.id} value={user.id}>
                        #{user.id} – {user.email} – {user.tipo} – {user.stato}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    value={selectedUserId?.toString() ?? ''}
                    onValueChange={(value) => setSelectedUserId(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un utente" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem
                        value="placeholder"
                        disabled
                        className="text-muted-foreground italic"
                      >
                        Seleziona un utente
                      </SelectItem>
                      {userResults.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={user.id.toString()}
                          className="text-sm font-mono px-2 py-1"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              #{user.id} – {user.email}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.tipo} – {getStatusLabel(user.stato)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Account Status</label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                >
                  <option value={0}>Inactive</option>
                  <option value={1}>Active</option>
                  <option value={2}>Warning</option>
                  <option value={3}>Banned</option>
                </select>
              </div>
              <button
                onClick={handleAccountManagement}
                disabled={!accountSearch.trim()}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Settings className="h-4 w-4" />
                <span>Update Account Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
