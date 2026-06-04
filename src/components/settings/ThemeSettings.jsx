import { Button } from '../ui/button';

export function ThemeSettings({ theme = 'system', onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {['light', 'dark', 'system'].map((option) => (
        <Button key={option} variant={theme === option ? 'primary' : 'secondary'} onClick={() => onChange?.(option)}>
          {option}
        </Button>
      ))}
    </div>
  );
}
