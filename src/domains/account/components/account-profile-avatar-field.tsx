'use client';

import { IconLoader2, IconUpload, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { uploadUserAvatar } from '@/domains/account/lib/upload-user-avatar';
import { IMAGE_FALLBACK } from '@/lib/images';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

interface AccountProfileAvatarFieldProps {
  avatarUrl: string;
  fallbackLabel: string;
  onAvatarUrlChange: (url: string) => void;
}

/** Avatar preview + upload/remove controls for account profile forms. */
export function AccountProfileAvatarField({
  avatarUrl,
  fallbackLabel,
  onAvatarUrlChange
}: AccountProfileAvatarFieldProps) {
  const t = useTranslations('account.overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const publicUrl = await uploadUserAvatar(file);
      onAvatarUrlChange(publicUrl);
      toast.success(t('avatarUploaded'));
    } catch (error) {
      toast.error(t('avatarUploadFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setIsUploading(false);
    }
  };

  const previewSrc = avatarUrl.trim() || IMAGE_FALLBACK;
  const showImage = avatarUrl.trim().length > 0;

  return (
    <Flex direction='row' align='center' gap={4} className='col-span-2 flex-wrap'>
      <div className='border-border/40 bg-muted/30 relative size-20 overflow-hidden rounded-full border'>
        {showImage ? (
          <AppImage
            src={previewSrc}
            alt={fallbackLabel}
            fill
            sizes='80px'
            className='object-cover'
          />
        ) : (
          <Flex align='center' justify='center' fullWidth className='size-full'>
            <Typography.Large className='text-accent font-semibold'>
              {fallbackLabel.slice(0, 2).toUpperCase()}
            </Typography.Large>
          </Flex>
        )}
      </div>

      <Flex direction='column' gap={2} className='min-w-48 flex-1'>
        <Typography.Subtle>{t('avatarLabel')}</Typography.Subtle>
        <input
          ref={fileInputRef}
          type='file'
          accept={ACCEPTED_TYPES}
          className='hidden'
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
            event.target.value = '';
          }}
        />
        <Flex direction='row' gap={2} wrap='wrap'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <IconLoader2 className='size-4 animate-spin' aria-hidden />
            ) : (
              <IconUpload className='size-4' aria-hidden />
            )}
            {t('uploadAvatar')}
          </Button>
          {avatarUrl ? (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              disabled={isUploading}
              onClick={() => onAvatarUrlChange('')}
            >
              <IconX className='size-4' aria-hidden />
              {t('removeAvatar')}
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
}
