import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Upload, FileText } from 'lucide-react';

export default function DocumentsPage() {
  const documents = [
    { name: 'MRI Report - Knee', type: 'Medical Report', date: 'Mar 8, 2026', size: '2.4 MB' },
    { name: 'X-Ray - Right Knee', type: 'Scan', date: 'Mar 5, 2026', size: '1.8 MB' },
    { name: 'Consent Form - Physio', type: 'Consent', date: 'Mar 10, 2026', size: '120 KB' },
    { name: 'Consent Form - Electrolysis', type: 'Consent', date: 'Mar 18, 2026', size: '95 KB' },
    { name: 'Insurance Card', type: 'Insurance', date: 'Mar 1, 2026', size: '340 KB' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm">Upload and manage your medical documents.</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-1" /> Upload
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Document</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium text-foreground">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.type}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doc.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
