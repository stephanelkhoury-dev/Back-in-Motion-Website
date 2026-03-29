'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, Building2, Clock, Globe, Bell, Shield, Palette } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure platform and business settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
            <div className="space-y-4">
              <Input id="clinic-name" label="Clinic Name" defaultValue="Back in Motion" />
              <Input id="tagline" label="Tagline" defaultValue="Digital Wellness & Rehabilitation" />
              <Input id="email" label="Contact Email" defaultValue="info@backinmotion.com" type="email" />
              <Input id="phone" label="Phone Number" defaultValue="+961 1 234 567" />
              <Input id="address" label="Address" defaultValue="Beirut, Lebanon" />
              <Input id="website" label="Website URL" defaultValue="https://backinmotion.com" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Default Currency</label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="USD">USD – US Dollar</option>
                  <option value="LBP">LBP – Lebanese Pound</option>
                  <option value="EUR">EUR – Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="Asia/Beirut">Asia/Beirut (GMT+2)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                </select>
              </div>
              <Button><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Business Hours */}
      {activeTab === 'hours' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Business Hours</h2>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-foreground">{day}</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={day !== 'Sunday'}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Open</span>
                  </label>
                  <Input id={`${day}-open`} type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-muted-foreground">to</span>
                  <Input id={`${day}-close`} type="time" defaultValue={day === 'Saturday' ? '14:00' : '18:00'} className="w-32" />
                </div>
              ))}
              <div className="pt-4">
                <Button><Save className="h-4 w-4 mr-1" /> Save Hours</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h2>
            <div className="space-y-4">
              {[
                { label: 'Appointment reminders (24h before)', enabled: true },
                { label: 'Exercise daily reminders', enabled: true },
                { label: 'Package expiry alerts (7 days before)', enabled: true },
                { label: 'Payment overdue notifications', enabled: true },
                { label: 'Post-session follow-up messages', enabled: false },
                { label: 'Re-engagement after 14 days inactivity', enabled: false },
                { label: 'New booking confirmation to staff', enabled: true },
                { label: 'Weekly analytics summary email', enabled: true },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{notif.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-foreground mb-2">Default Channels</h3>
                <div className="flex gap-4">
                  {['In-App', 'Email', 'WhatsApp', 'SMS'].map((ch) => (
                    <label key={ch} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={ch !== 'SMS'} className="rounded border-border" />
                      <span className="text-sm text-muted-foreground">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button><Save className="h-4 w-4 mr-1" /> Save Notification Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Branding */}
      {activeTab === 'branding' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Logo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">Drag and drop your logo, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">SVG, PNG, or JPG (max 2MB)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#0D9488" className="w-10 h-10 rounded cursor-pointer" />
                    <Input id="primary-color" defaultValue="#0D9488" className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#6366F1" className="w-10 h-10 rounded cursor-pointer" />
                    <Input id="secondary-color" defaultValue="#6366F1" className="flex-1" />
                  </div>
                </div>
              </div>
              <Button><Save className="h-4 w-4 mr-1" /> Save Branding</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Integrations</h2>
            <div className="space-y-4">
              {[
                { name: 'WhatsApp Business API', description: 'Send appointment reminders and follow-ups via WhatsApp.', connected: true },
                { name: 'Stripe Payments', description: 'Accept online credit card payments.', connected: false },
                { name: 'Google Calendar', description: 'Sync appointments with Google Calendar.', connected: true },
                { name: 'Zoom / Google Meet', description: 'Enable virtual consultations for dietitian sessions.', connected: false },
                { name: 'Mailchimp', description: 'Sync client list for email marketing campaigns.', connected: false },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                  <Button variant={integration.connected ? 'outline' : 'primary'} size="sm">
                    {integration.connected ? 'Connected' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Session Timeout</p>
                  <p className="text-xs text-muted-foreground">Automatically log out inactive users.</p>
                </div>
                <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Password Policy</p>
                  <p className="text-xs text-muted-foreground">Minimum password requirements for all users.</p>
                </div>
                <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="standard">Standard (8+ chars)</option>
                  <option value="strong">Strong (12+ chars, mixed)</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Data Export</p>
                  <p className="text-xs text-muted-foreground">Export all platform data for compliance.</p>
                </div>
                <Button variant="outline" size="sm">Export Data</Button>
              </div>
              <Button><Save className="h-4 w-4 mr-1" /> Save Security Settings</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
