'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Settings, Globe, Palette, Shield, Save } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'Back in Motion',
    supportEmail: 'support@backinmotion.com',
    defaultCurrency: 'USD',
    defaultTimezone: 'America/New_York',
    maintenanceMode: false,
    allowRegistration: true,
    maxOrganizations: 100,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground text-sm">Configure global platform settings.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-foreground">General</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Platform Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings(s => ({ ...s, platformName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings(s => ({ ...s, supportEmail: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Default Currency</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings(s => ({ ...s, defaultCurrency: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="LBP">LBP (ل.ل)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Default Timezone</label>
                <select
                  value={settings.defaultTimezone}
                  onChange={(e) => setSettings(s => ({ ...s, defaultTimezone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground text-sm"
                >
                  <option value="America/New_York">Eastern (US)</option>
                  <option value="America/Chicago">Central (US)</option>
                  <option value="America/Los_Angeles">Pacific (US)</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Beirut">Beirut</option>
                  <option value="Asia/Dubai">Dubai</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-foreground">Access & Security</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings(s => ({ ...s, allowRegistration: e.target.checked }))}
                  className="h-4 w-4 rounded border-muted accent-amber-600"
                />
                <span className="text-sm text-foreground">Allow public registration</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings(s => ({ ...s, maintenanceMode: e.target.checked }))}
                  className="h-4 w-4 rounded border-muted accent-amber-600"
                />
                <span className="text-sm text-foreground">Maintenance mode</span>
              </label>
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-foreground mb-1">Max Organizations</label>
                <input
                  type="number"
                  value={settings.maxOrganizations}
                  onChange={(e) => setSettings(s => ({ ...s, maxOrganizations: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-foreground text-sm"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          {saved && <span className="text-sm text-green-600 font-medium">Settings saved!</span>}
        </div>
      </div>
    </div>
  );
}
