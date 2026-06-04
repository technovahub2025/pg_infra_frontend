import { Download } from 'lucide-react';
import { Button } from '../ui/button';

export function ExportButton({ onClick, children = 'Export' }) {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Download className="h-4 w-4" />
      {children}
    </Button>
  );
}

