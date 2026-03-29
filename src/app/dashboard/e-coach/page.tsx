'use client';

import { useState, useEffect } from 'react';
import { Bot, Send, Dumbbell, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ECoachDashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Good morning! How are you feeling today? Let\u2019s check in before your workout.' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/ecoach')
      .then((r) => r.json())
      .then((convos) => {
        if (convos.length > 0 && convos[0].messages?.length > 0) {
          setMessages(convos[0].messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/ecoach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.message?.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message.content }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setSending(false);
  };

  const dailyTips = [
    { icon: Dumbbell, tip: 'Complete your 5 assigned exercises today' },
    { icon: TrendingUp, tip: 'Your compliance this week: 85% - keep it up!' },
    { icon: Lightbulb, tip: 'Tip: Apply ice after exercises to reduce inflammation' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">E-Coach AI</h1>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Your AI wellness coaching assistant.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center mb-1">
                        <Bot className="h-3 w-3 mr-1 text-primary" />
                        <span className="text-xs font-medium text-primary">E-Coach</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your E-Coach..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <Button onClick={handleSend} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                E-Coach is a coaching assistant, not a medical advisor. Consult your therapist for medical concerns.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-foreground mb-3">Today&apos;s Overview</h3>
            <div className="space-y-3">
              {dailyTips.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start">
                    <Icon className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{item.tip}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-foreground mb-3">Weekly Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Workouts</span>
                  <span className="font-medium text-foreground">4/5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pain Trend</span>
                  <span className="font-medium text-success">Improving</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success rounded-full h-2" style={{ width: '70%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Compliance</span>
                  <span className="font-medium text-foreground">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent rounded-full h-2" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-warning/5 border-warning/20">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Symptom Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you experience increased pain or swelling, your E-Coach will flag it for your therapist.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
