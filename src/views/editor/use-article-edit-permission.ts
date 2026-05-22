'use client';

import { useEffect } from 'react';
import { useRouter } from 'i18n/navigation';
import { useTranslations } from 'next-intl';
import type { Article } from '~/entities/article/model/types';
import type { SessionUser } from '~/shared/types/session';
import { useToast } from '~/shared/ui/use-toast';

interface Args {
    editSlug: string | null;
    existingArticle: Article | null | undefined;
    sessionUser: SessionUser | undefined;
}

/**
 * When editing, verifies the session user owns the article (or is admin) and
 * redirects with a toast otherwise. No-op for create flow.
 */
export function useArticleEditPermission({ editSlug, existingArticle, sessionUser }: Args) {
    const router = useRouter();
    const { toast } = useToast();
    const t = useTranslations('editor');
    const tAuth = useTranslations('auth');

    useEffect(() => {
        if (!editSlug || !existingArticle || !sessionUser) return;
        const isAdmin = sessionUser.role === 'admin';
        const isOwner = existingArticle.authorId
            ? existingArticle.authorId === sessionUser.id
            : existingArticle.author === sessionUser.name;
        if (!isOwner && !isAdmin) {
            toast({
                title: tAuth('accessDenied'),
                description: t('noPermissionToEdit'),
                variant: 'destructive',
            });
            router.push('/');
        }
    }, [editSlug, existingArticle, sessionUser, router, toast, t, tAuth]);
}
