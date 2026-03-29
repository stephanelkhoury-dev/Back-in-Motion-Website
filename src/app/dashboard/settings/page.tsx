import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" defaultValue="John" />
              <Input id="lastName" label="Last Name" defaultValue="Doe" />
            </div>
            <Input id="email" label="Email" type="email" defaultValue="john@example.com" />
            <Input id="phone" label="Phone" type="tel" defaultValue="+961 XX XXX XXX" />
            <Input id="dob" label="Date of Birth" type="date" defaultValue="1990-01-15" />
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { label: 'Email reminders', desc: 'Receive appointment reminders via email' },
              { label: 'SMS reminders', desc: 'Receive reminders via SMS' },
              { label: 'WhatsApp reminders', desc: 'Receive reminders via WhatsApp' },
              { label: 'Push notifications', desc: 'Browser push notifications' },
              { label: 'Exercise reminders', desc: 'Daily exercise completion reminders' },
              { label: 'E-Coach updates', desc: 'AI coaching plan updates and tips' },
            ].map((pref) => (
              <label key={pref.label} className="flex items-start justify-between p-3 bg-muted rounded-lg cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1 rounded border-border" />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
          <form className="space-y-4">
            <Input id="currentPassword" label="Current Password" type="password" placeholder="Enter current password" />
            <Input id="newPassword" label="New Password" type="password" placeholder="Enter new password" />
            <Input id="confirmNewPassword" label="Confirm New Password" type="password" placeholder="Confirm new password" />
            <Button type="submit" variant="outline">Update Password</Button>
          </form>
        </Card>

        <Card className="border-danger/20">
          <h2 className="text-lg font-semibold text-danger mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
          <Button variant="danger">Delete Account</Button>
        </Card>
      </div>
    </div>
  );
}
