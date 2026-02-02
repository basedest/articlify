'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ProseMirrorJSON, TiptapEditorRef } from '~/widgets/editor';
import type { Article } from '~/entities/article/model/types';
import { TagsPicker } from '~/entities/tag/ui/tags-picker';
import { useSession } from 'next-auth/react';
import { useRouter } from '~/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { categories } from '~/shared/config/categories';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Textarea } from '~/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { Card, CardContent } from '~/shared/ui/card';
import { Loader2, Save } from 'lucide-react';
import { trpc } from '~/shared/api/trpc/client';
import { useToast } from '~/shared/ui/use-toast';

const TiptapEditorDynamic = dynamic(() => import('~/widgets/editor').then((m) => ({ default: m.TiptapEditor })), {
    ssr: false,
});

export function EditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editSlug = searchParams.get('edit');
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const t = useTranslations('editor');
    const tAuth = useTranslations('auth');
    const tCategory = useTranslations('category');

    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [editorReady, setEditorReady] = useState(false);
    const tiptapRef = useRef<TiptapEditorRef | null>(null);
    const [uploading, setUploading] = useState(false);
    const [article, setArticle] = useState<Partial<Article>>({});

    const { data: existingArticle, isLoading: articleLoading } = trpc.article.getBySlug.useQuery(
        { slug: editSlug! },
        { enabled: !!editSlug },
    );

    const initialContent: ProseMirrorJSON | null =
        editSlug && existingArticle?.contentPm && typeof existingArticle.contentPm === 'object'
            ? (existingArticle.contentPm as ProseMirrorJSON)
            : null;

    const effectiveArticle: Partial<Article> =
        editSlug && existingArticle ? { ...existingArticle, ...article } : article;
    const displayImageSrc = imageSrc ?? effectiveArticle.img ?? null;

    const createMutation = trpc.article.create.useMutation({
        onSuccess: (data) => {
            toast({
                title: t('success'),
                description: t('articleCreated'),
            });
            router.push(`/${data.category}/${data.slug}`);
        },
        onError: (error) => {
            toast({
                title: t('error'),
                description: error.message,
                variant: 'destructive',
            });
            setUploading(false);
        },
    });

    const updateMutation = trpc.article.update.useMutation({
        onSuccess: (data) => {
            toast({
                title: t('success'),
                description: t('articleUpdated'),
            });
            router.push(`/${data!.category}/${data!.slug}`);
        },
        onError: (error) => {
            toast({
                title: t('error'),
                description: error.message,
                variant: 'destructive',
            });
            setUploading(false);
        },
    });

    const getSlug = (t: string) => {
        const filter = /[^а-яё\w-]/g;
        return t.toLowerCase().split(' ').join('-').replace(filter, '');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const uploadCoverImageMutation = trpc.article.uploadCoverImage.useMutation();

    const onSubmit = async () => {
        if (!effectiveArticle.title || !effectiveArticle.category || !effectiveArticle.description) {
            toast({
                title: t('validationError'),
                description: t('titleCategoryDescriptionRequired'),
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
            const contentPm: ProseMirrorJSON = tiptapRef.current?.getJSON() ?? {};

            let imageUrl: string | undefined = effectiveArticle.img;
            if (file && imageSrc && imageSrc.startsWith('data:')) {
                const match = imageSrc.match(/^data:([^;]+);base64,(.+)$/);
                if (match) {
                    const [, contentType, base64] = match;
                    const result = await uploadCoverImageMutation.mutateAsync({
                        imageBase64: base64,
                        contentType: contentType ?? 'image/jpeg',
                    });
                    imageUrl = result.url;
                }
            }

            const slug = getSlug(effectiveArticle.title!);

            if (editSlug) {
                updateMutation.mutate({
                    slug: editSlug,
                    title: effectiveArticle.title!,
                    description: effectiveArticle.description!,
                    category: effectiveArticle.category!,
                    tags: effectiveArticle.tags,
                    img: imageUrl,
                    contentPm: contentPm,
                    contentFormat: 'pm',
                    contentSchemaVersion: 1,
                });
            } else {
                createMutation.mutate({
                    slug,
                    title: effectiveArticle.title!,
                    description: effectiveArticle.description!,
                    category: effectiveArticle.category!,
                    tags: effectiveArticle.tags || [],
                    img: imageUrl,
                    contentPm: contentPm,
                    contentFormat: 'pm',
                    contentSchemaVersion: 1,
                });
            }
        } catch (error) {
            toast({
                title: t('error'),
                description: t('failedToSave'),
                variant: 'destructive',
            });
            setUploading(false);
        }
    };

    useEffect(() => {
        if (
            editSlug &&
            existingArticle &&
            session &&
            existingArticle.author !== session.user.name &&
            session.user.role !== 'admin'
        ) {
            toast({
                title: tAuth('accessDenied'),
                description: t('noPermissionToEdit'),
                variant: 'destructive',
            });
            router.push('/');
        }
    }, [editSlug, existingArticle, session, router, toast, t, tAuth]);

    const authLoading = status === 'loading';
    const disabled = !editorReady || authLoading || uploading;

    if (authLoading || (editSlug && articleLoading)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">{editSlug ? t('editArticle') : t('createNewArticle')}</h1>

            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t('title')}</Label>
                        {editSlug ? (
                            <h2 className="text-2xl font-semibold">{effectiveArticle.title}</h2>
                        ) : (
                            <Input
                                id="title"
                                value={effectiveArticle.title || ''}
                                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                                placeholder={t('placeholderTitle')}
                                disabled={!!editSlug}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('description')}</Label>
                        <Textarea
                            id="description"
                            value={effectiveArticle.description || ''}
                            onChange={(e) => setArticle({ ...article, description: e.target.value })}
                            placeholder={t('placeholderDescription')}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">{t('category')}</Label>
                        <Select
                            value={effectiveArticle.category}
                            onValueChange={(value) => setArticle({ ...article, category: value })}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder={t('selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {tCategory(cat)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">{t('tags')}</Label>
                        <TagsPicker
                            value={effectiveArticle.tags || []}
                            onChange={(tags) => setArticle({ ...article, tags })}
                            defaultValue={existingArticle?.tags}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">{t('coverImage')}</Label>
                        <p className="text-muted-foreground text-sm">{t('coverImageNote')}</p>
                        <div className="flex items-center gap-4">
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        {displayImageSrc && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={displayImageSrc}
                                    alt={t('preview')}
                                    fill
                                    className="object-cover"
                                    unoptimized={displayImageSrc.startsWith('data:')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t('content')}</Label>
                        <TiptapEditorDynamic
                            content={initialContent}
                            editorRef={tiptapRef}
                            onReady={() => setEditorReady(true)}
                        />
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button onClick={onSubmit} disabled={disabled} size="lg" className="w-full sm:w-auto">
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    {editSlug ? t('updateArticle') : t('publishArticle')}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
