import { Badge } from '../ui/badge';

export function StatusPill({ value }) {
  const tone = String(value || '').toLowerCase();
  const mapped = tone.includes('done') || tone.includes('complete') ? 'green' : tone.includes('hold') || tone.includes('blocked') ? 'amber' : tone.includes('review') ? 'blue' : tone.includes('critical') || tone.includes('cancel') ? 'rose' : 'slate';
  return <Badge tone={mapped}>{value || '—'}</Badge>;
}
