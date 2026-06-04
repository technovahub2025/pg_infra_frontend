import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0F2236',
          color: '#F0F4FA',
          border: '1px solid rgba(255,255,255,0.07)',
        },
      }}
    />
  );
}
