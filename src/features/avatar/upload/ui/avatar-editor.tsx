'use client';

import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { trpc } from '~/shared/api/trpc/client';
import { useToast } from '~/shared/ui/use-toast';

const ACCEPTED_TYPES = 'image/jpeg,image/jpg,image/png,image/webp,image/gif';
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function AvatarEditor() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const uploadAvatar = trpc.user.uploadAvatar.useMutation({
        onSuccess: async () => {
            await updateSession();
            router.refresh();
            toast({
                title: 'Avatar updated',
                description: 'Your profile picture has been updated.',
            });
        },
        onError: (error) => {
            toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSettled: () => setUploading(false),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_SIZE_BYTES) {
            toast({
                title: 'File too large',
                description: 'Image must be smaller than 2MB.',
                variant: 'destructive',
            });
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            if (!base64) return;
            setUploading(true);
            uploadAvatar.mutate({
                imageBase64: base64,
                contentType: file.type,
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    if (!session?.user) return null;

    const user = session.user;
    const displayName = user.name ?? 'User';

    return (
        <div className="flex items-center gap-4">
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={handleFileChange}
                className="sr-only"
                disabled={uploading}
                aria-label="Change avatar"
            />
            <div className="relative">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image ?? '/api/user/avatar'} />
                    <AvatarFallback className="text-lg">{displayName[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-0 bottom-0 h-8 w-8 rounded-full shadow"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    aria-label="Change avatar"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
            </div>
            <div>
                <h3 className="text-xl font-semibold">{displayName}</h3>
                <p className="text-muted-foreground text-sm">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
                <Button
                    type="button"
                    variant="link"
                    className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm underline-offset-4"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading…' : 'Change avatar'}
                </Button>
            </div>
        </div>
    );
}
