'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    fetch('/api/user/profile').then(r => r.ok ? r.json() : null).then(data => {
      if (data) setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
      });
    });
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || null,
        dateOfBirth: profile.dateOfBirth || null,
      }),
    });
    if (res.ok) setProfileMsg('Profile updated successfully.');
    else {
      const err = await res.json();
      setProfileMsg(err.error || 'Failed to update profile.');
    }
    setSavingProfile(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordMsg('Passwords do not match.');
      return;
    }
    setSavingPassword(true);
    setPasswordMsg('');
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    });
    if (res.ok) {
      setPasswordMsg('Password updated successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      const err = await res.json();
      setPasswordMsg(err.error || 'Failed to update password.');
    }
    setSavingPassword(false);
  }

  if (status === 'loading') return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              <Input id="lastName" label="Last Name" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <Input id="email" label="Email" type="email" value={profile.email} disabled />
            <Input id="phone" label="Phone" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            <Input id="dob" label="Date of Birth" type="date" value={profile.dateOfBirth} onChange={e => setProfile(p => ({ ...p, dateOfBirth: e.target.value }))} />
            {profileMsg && <p className={`text-sm ${profileMsg.includes('success') ? 'text-success' : 'text-danger'}`}>{profileMsg}</p>}
            <Button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input id="currentPassword" label="Current Password" type="password" placeholder="Enter current password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} />
            <Input id="newPassword" label="New Password" type="password" placeholder="Enter new password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} />
            <Input id="confirmNewPassword" label="Confirm New Password" type="password" placeholder="Confirm new password" value={passwords.confirmNewPassword} onChange={e => setPasswords(p => ({ ...p, confirmNewPassword: e.target.value }))} />
            {passwordMsg && <p className={`text-sm ${passwordMsg.includes('success') ? 'text-success' : 'text-danger'}`}>{passwordMsg}</p>}
            <Button type="submit" variant="outline" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
