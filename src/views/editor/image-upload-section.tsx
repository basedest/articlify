'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';

interface ImageUploadSectionProps {
    onFileChange: (file: File | null, dataUrl: string | null) => void;
    displaySrc: string | null;
}

export function ImageUploadSection({ onFileChange, displaySrc }: ImageUploadSectionProps) {
    const t = useTranslations('editor');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            onFileChange(null, null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => onFileChange(selectedFile, reader.result as string);
        reader.readAsDataURL(selectedFile);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="image">{t('coverImage')}</Label>
            <p className="text-muted-foreground text-sm">{t('coverImageNote')}</p>
            <div className="flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            {displaySrc && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                        src={displaySrc}
                        alt={t('preview')}
                        fill
                        className="object-cover"
                        unoptimized={displaySrc.startsWith('data:')}
                    />
                </div>
            )}
        </div>
    );
}
