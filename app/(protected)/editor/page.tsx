'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import {
  useSaveCallback,
  useLoadData,
  options,
  useSetData,
  dataKey,
} from '~/components/Editor';
import { Article } from '~/lib/ArticleTypes';
import TagsPicker from '~/components/TagsPicker';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '~/lib/lib';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Card, CardContent } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Loader2, Upload, Save } from 'lucide-react';
import { trpc } from '~/lib/trpc/client';
import { useToast } from '~/hooks/use-toast';

const Editor = dynamic(
  () =>
    import('~/components/Editor/editor').then((mod) => mod.EditorContainer) as any,
  { ssr: false }
) as any;

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [uploading, setUploading] = useState(false);
  const [article, setArticle] = useState<Partial<Article>>({});

  // Fetch article if editing
  const { data: existingArticle, isLoading: articleLoading } =
    trpc.article.getBySlug.useQuery(
      { slug: editSlug! },
      { enabled: !!editSlug }
    );

  // Load data from props or localStorage
  const { data: localData, loading: localLoading } = useLoadData();
  const data = editSlug ? existingArticle?.content : localData;

  useSetData(editor as EditorJS, data as OutputData);

  // Initialize article state
  useEffect(() => {
    if (existingArticle && editSlug) {
      setArticle(existingArticle);
      if (existingArticle.img) {
        setImageSrc(existingArticle.img);
      }
    }
  }, [existingArticle, editSlug]);

  // Mutations
  const createMutation = trpc.article.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Article created successfully',
      });
      localStorage.removeItem(dataKey);
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
      localStorage.removeItem(dataKey);
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

  const onSave = useSaveCallback(editor as EditorJS);

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

  const uploadImageToS3 = async (file: File): Promise<string> => {
    // TODO: Implement S3 upload via tRPC
    // For now, return a placeholder
    // In a real implementation, you'd:
    // 1. Call a tRPC procedure to get a presigned URL
    // 2. Upload the file directly to S3
    // 3. Return the public URL
    return imageSrc || '';
  };

  const onSubmit = async () => {
    if (!article.title || !article.category || !article.description) {
      toast({
        title: 'Validation Error',
        description: 'Title, category, and description are required',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const editorData = await onSave();

      let imageUrl = article.img;
      if (file && imageSrc) {
        imageUrl = await uploadImageToS3(file);
      }

      const slug = getSlug(article.title);

      if (editSlug) {
        // Update existing article
        updateMutation.mutate({
          slug: editSlug,
          title: article.title,
          description: article.description,
          category: article.category,
          tags: article.tags,
          img: imageUrl,
          content: editorData,
        });
      } else {
        // Create new article
        createMutation.mutate({
          slug,
          title: article.title,
          description: article.description,
          category: article.category,
          tags: article.tags || [],
          img: imageUrl,
          content: editorData,
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
  const disabled =
    editor === null || localLoading || authLoading || uploading;

  if (authLoading || (editSlug && articleLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        {editSlug ? 'Edit Article' : 'Create New Article'}
      </h1>

      <Card>
        <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          {editSlug ? (
            <h2 className="text-2xl font-semibold">{article.title}</h2>
          ) : (
            <Input
              id="title"
              value={article.title || ''}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
              placeholder="Enter article title..."
              disabled={!!editSlug}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={article.description || ''}
            onChange={(e) =>
              setArticle({ ...article, description: e.target.value })
            }
            placeholder="Brief description of your article..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={article.category}
            onValueChange={(value) =>
              setArticle({ ...article, category: value })
            }
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
            value={article.tags || []}
            onChange={(tags) => setArticle({ ...article, tags })}
            defaultValue={existingArticle?.tags}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Cover Image</Label>
          <p className="text-sm text-muted-foreground">
            Image will be converted to 2:1 ratio
          </p>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {(imageSrc || article.img) && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={imageSrc || article.img}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Card>
            <CardContent className="p-6">
              <Editor
                reInit
                editorRef={setEditor}
                options={options}
                data={data}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onSubmit}
            disabled={disabled}
            size="lg"
            className="w-full sm:w-auto"
          >
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
