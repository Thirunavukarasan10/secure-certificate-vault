import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchMyProfile, updateMyProfile, BASE_URL } from '../../lib/api.js';
import toast from 'react-hot-toast';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState({
    fullName: '',
    email: '',
    department: '',
    collegeName: '',
    contactNumber: '',
    address: '',
    bio: '',
    profilePicUrl: '',
    role: 'Verifier (Employer)',
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [profilePic, setProfilePic] = React.useState(null);
  const [profilePicPreview, setProfilePicPreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchMyProfile();
      if (data) {
        setProfile({
          fullName: data.fullName || user?.identifier?.split('@')[0] || 'Verifier',
          email: data.user?.email || user?.identifier || '',
          department: data.department || '',
          collegeName: data.collegeName || '',
          contactNumber: data.contactNumber || '',
          address: data.address || '',
          bio: data.bio || '',
          profilePicUrl: data.profilePicUrl || '',
          role: 'Verifier (Employer)',
        });
        if (data.profilePicUrl) {
          const baseUrl = BASE_URL.replace('/api', '');
          setProfilePicPreview(baseUrl + data.profilePicUrl);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Set defaults from user context
      const email = user?.identifier || '';
      setProfile({
        fullName: email.split('@')[0] || 'Verifier',
        email: email,
        department: '',
        collegeName: '',
        contactNumber: '',
        address: '',
        bio: '',
        profilePicUrl: '',
        role: 'Verifier (Employer)',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePic(null);
    setProfilePicPreview(profile.profilePicUrl ? BASE_URL.replace('/api', '') + profile.profilePicUrl : null);
    loadProfile();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      if (profile.fullName) formData.append('fullName', profile.fullName);
      if (profile.department) formData.append('department', profile.department);
      if (profile.collegeName) formData.append('collegeName', profile.collegeName);
      if (profile.contactNumber) formData.append('contactNumber', profile.contactNumber);
      if (profile.address) formData.append('address', profile.address);
      if (profile.bio) formData.append('bio', profile.bio);
      if (profilePic) formData.append('profilePic', profilePic);

      const updated = await updateMyProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setProfilePic(null);
      await loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={nav} />
        <main className="flex-1 overflow-y-auto p-6">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            {!isEditing && (
              <Button onClick={handleEdit} variant="primary">
                Edit Profile
              </Button>
            )}
          </div>

          <Card className="mb-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-500 ring-4 ring-white shadow-lg">
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                        {profile.fullName?.charAt(0)?.toUpperCase() || user?.identifier?.charAt(0)?.toUpperCase() || 'V'}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 rounded-full bg-purple-600 p-2 text-white shadow-md transition hover:bg-purple-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isEditing && (
                  <p className="mt-2 text-xs text-gray-500">Click to change photo</p>
                )}
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{profile.fullName || 'Verifier'}</h3>
                  <p className="text-sm text-gray-500">{profile.role}</p>
                </div>

                {isEditing ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email"
                      value={profile.email}
                      disabled
                      className="opacity-60"
                    />
                    <Input
                      label="Organization"
                      value={profile.collegeName}
                      onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                      placeholder="Enter organization name"
                    />
                    <Input
                      label="Department"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      placeholder="e.g. HR, Recruitment"
                    />
                    <Input
                      label="Contact Number"
                      value={profile.contactNumber}
                      onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                      placeholder="+1234567890"
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm">
                        <div className="mb-1 font-medium">Bio</div>
                        <textarea
                          className="input min-h-[100px] w-full resize-none"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell us about your organization..."
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</div>
                      <div className="mt-1 text-sm text-gray-900">{profile.email || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</div>
                      <div className="mt-1 text-sm text-gray-900">{profile.role}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Organization</div>
                      <div className="mt-1 text-sm text-gray-900">{profile.collegeName || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</div>
                      <div className="mt-1 text-sm text-gray-900">{profile.department || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Number</div>
                      <div className="mt-1 text-sm text-gray-900">{profile.contactNumber || '—'}</div>
                    </div>
                    {profile.address && (
                      <div className="md:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Address</div>
                        <div className="mt-1 text-sm text-gray-900">{profile.address}</div>
                      </div>
                    )}
                    {profile.bio && (
                      <div className="md:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bio</div>
                        <div className="mt-1 text-sm text-gray-900">{profile.bio}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3 border-t pt-4">
                <Button onClick={handleSave} variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
