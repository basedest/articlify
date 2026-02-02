'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Link } from 'i18n/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UserMenu() {
    const { data: session } = useSession();
    const t = useTranslations('auth');
    const tButton = useTranslations('button');

    if (!session?.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image ?? '/api/user/avatar'} />
                        <AvatarFallback>{session.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{session.user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        {t('profile')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer dark:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {tButton('signOut')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
