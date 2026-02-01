'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ProseMirrorJSON, TiptapEditorRef } from '~/components/Tiptap/TiptapEditor';
import { Article } from '~/lib/ArticleTypes';
import TagsPicker from '~/components/TagsPicker';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '~/lib/lib';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Card, CardContent } from '~/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { trpc } from '~/lib/trpc/client';
import { useToast } from '~/hooks/use-toast';

const TiptapEditorDynamic = dynamic(
    () => import('~/components/Tiptap/TiptapEditor').then((m) => ({ default: m.TiptapEditor })),
    { ssr: false },
);

export default function EditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editSlug = searchParams.get('edit');
    const { data: session, status } = useSession();
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [editorReady, setEditorReady] = useState(false);
    const tiptapRef = useRef<TiptapEditorRef | null>(null);
    const [uploading, setUploading] = useState(false);
    const [article, setArticle] = useState<Partial<Article>>({});

    // Fetch article if editing
    const { data: existingArticle, isLoading: articleLoading } = trpc.article.getBySlug.useQuery(
        { slug: editSlug! },
        { enabled: !!editSlug },
    );

    // Initial content for Tiptap: use contentPm when editing, else empty doc
    const initialContent: ProseMirrorJSON | null =
        editSlug && existingArticle?.contentPm && typeof existingArticle.contentPm === 'object'
            ? (existingArticle.contentPm as ProseMirrorJSON)
            : null;

    // Derive form article: when editing, merge existingArticle with local overrides
    const effectiveArticle: Partial<Article> =
        editSlug && existingArticle ? { ...existingArticle, ...article } : article;
    const displayImageSrc = imageSrc ?? effectiveArticle.img ?? null;

    // Mutations
    const createMutation = trpc.article.create.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: 'Article created successfully',
            });
            router.push(`/${data.category}/${data.slug}`);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            setUploading(false);
        },
    });

    const updateMutation = trpc.article.update.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: 'Article updated successfully',
            });
            router.push(`/${data!.category}/${data!.slug}`);
        },
        onError: (error) => {
            toast({
                title: 'Error',
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
                title: 'Validation Error',
                description: 'Title, category, and description are required',
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
                title: 'Error',
                description: 'Failed to save article',
                variant: 'destructive',
            });
            setUploading(false);
        }
    };

    // Check permissions for editing
    useEffect(() => {
        if (
            editSlug &&
            existingArticle &&
            session &&
            existingArticle.author !== session.user.name &&
            session.user.role !== 'admin'
        ) {
            toast({
                title: 'Access Denied',
                description: 'You do not have permission to edit this article',
                variant: 'destructive',
            });
            router.push('/');
        }
    }, [editSlug, existingArticle, session, router, toast]);

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
            <h1 className="mb-8 text-3xl font-bold">{editSlug ? 'Edit Article' : 'Create New Article'}</h1>

            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        {editSlug ? (
                            <h2 className="text-2xl font-semibold">{effectiveArticle.title}</h2>
                        ) : (
                            <Input
                                id="title"
                                value={effectiveArticle.title || ''}
                                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                                placeholder="Enter article title..."
                                disabled={!!editSlug}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={effectiveArticle.description || ''}
                            onChange={(e) => setArticle({ ...article, description: e.target.value })}
                            placeholder="Brief description of your article..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={effectiveArticle.category}
                            onValueChange={(value) => setArticle({ ...article, category: value })}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="capitalize">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <TagsPicker
                            value={effectiveArticle.tags || []}
                            onChange={(tags) => setArticle({ ...article, tags })}
                            defaultValue={existingArticle?.tags}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Cover Image</Label>
                        <p className="text-muted-foreground text-sm">Image will be converted to 2:1 ratio</p>
                        <div className="flex items-center gap-4">
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        {displayImageSrc && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={displayImageSrc}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized={displayImageSrc.startsWith('data:')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Card>
                            <CardContent className="p-6">
                                <TiptapEditorDynamic
                                    content={initialContent}
                                    editorRef={tiptapRef}
                                    onReady={() => setEditorReady(true)}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button onClick={onSubmit} disabled={disabled} size="lg" className="w-full sm:w-auto">
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    {editSlug ? 'Update Article' : 'Publish Article'}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
