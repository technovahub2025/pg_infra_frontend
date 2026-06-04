import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[90] flex items-center justify-center bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
      <WifiOff className="mr-2 h-4 w-4" />
      You are offline. Changes will sync when the connection returns.
    </div>
  );
}
