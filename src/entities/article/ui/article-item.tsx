'use client';

import { authClient } from '~/shared/api/auth-client';
import type { SessionUser } from '~/shared/types/session';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from 'i18n/navigation';
import { useState } from 'react';
import type { Article } from '~/entities/article/model/types';
import { TagsList } from '~/entities/tag/ui/tags-list';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/shared/ui/dialog';
import { Badge } from '~/shared/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { trpc } from '~/shared/api/trpc/client';
import { useToast } from '~/shared/ui/use-toast';

export function ArticleItem(props: Article) {
    const img = props.img ?? `/img/${props.category}.png`;
    const { data: session } = authClient.useSession();
    const tCategory = useTranslations('category');
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const deleteMutation = trpc.article.delete.useMutation({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Article deleted successfully',
            });
            router.refresh();
            setDialogOpen(false);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const user = session?.user as SessionUser | undefined;
    const canEdit = user && (user.name === props.author || user.role === 'admin');

    const handleDelete = () => {
        deleteMutation.mutate({ slug: props.slug });
    };

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Article</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this article? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
                <Link href={`/${props.category}/${props.slug}`}>
                    <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                            alt={`Cover image for ${props.title}`}
                            className="object-cover transition-transform hover:scale-105"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src={img}
                        />
                    </div>
                </Link>
                <CardHeader className="min-h-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <Link href={`/${props.category}`}>
                            <Badge
                                variant="secondary"
                                className="hover:bg-primary hover:text-primary-foreground w-fit cursor-pointer transition-colors"
                            >
                                {tCategory(props.category)}
                            </Badge>
                        </Link>
                    </div>
                    <Link href={`/${props.category}/${props.slug}`}>
                        <CardTitle className="hover:text-primary line-clamp-2 transition-colors">
                            {props.title}
                        </CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-3">{props.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-col gap-2">
                    <div className="text-muted-foreground flex gap-2 text-sm">
                        <span>@{props.author}</span>
                        <span>•</span>
                        <span>{new Date(props.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <TagsList tags={props.tags} />
                        {canEdit && (
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => router.push(`/editor?edit=${props.slug}`)}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
