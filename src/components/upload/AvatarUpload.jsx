import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { DropZone } from './DropZone';
import { LazyImage } from '../shared/LazyImage';

export function AvatarUpload({ avatar, name }) {
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (file) => uploadService.uploadAvatar(file),
    onSuccess: (data) => {
      const avatarUrl = data?.avatarUrl || data?.avatar || data;
      toast.success('Avatar updated');
      if (currentUser) {
        setAuth({ user: { ...currentUser, avatar: avatarUrl } });
      }
      queryClient.invalidateQueries({ queryKey: ['employee'] });
    },
    onError: () => toast.error('Avatar upload failed'),
  });

  return (
    <div className="space-y-3">
      <DropZone
        onDrop={(files) => {
          const file = files?.[0];
          if (file) mutation.mutate(file);
        }}
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        className="flex h-48 flex-col items-center justify-center"
      >
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-sky-500/15 text-sky-300">
          {avatar ? (
            <LazyImage
              src={avatar}
              alt={name}
              containerClassName="h-full w-full"
              className="h-full w-full object-cover"
              fallback={<Camera className="h-8 w-8" />}
            />
          ) : (
            <Camera className="h-8 w-8" />
          )}
        </div>
        <div className="mt-3 text-sm font-semibold text-[rgb(var(--text))]">{name || 'Upload avatar'}</div>
        <div className="text-xs text-slate-500">Click or drag to replace the avatar</div>
      </DropZone>
      <div className="flex justify-center">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Change Avatar
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) mutation.mutate(file);
        }}
      />
    </div>
  );
}
