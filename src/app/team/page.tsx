import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { TEAM_MEMBERS } from '@/lib/constants';
import { Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team | Nicolas Web',
  description: 'Meet our expert team of physiotherapists, dietitians, aesthetic specialists, and fitness coaches.',
};

export default function TeamPage() {
  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Our Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A multidisciplinary team of licensed professionals dedicated to your wellness journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Card key={member.id} hover className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.title}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{member.bio}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {member.specialties.map((s) => (
                    <Badge key={s} variant="primary" className="text-xs">{s}</Badge>
                  ))}
                </div>
                {member.languages && (
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <Languages className="h-3 w-3 mr-1" />
                    {member.languages.join(', ')}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
