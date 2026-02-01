'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Article } from '~/lib/ArticleTypes';
import { User } from '~/lib/UserTypes';
import TagsList from '../TagsList';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { trpc } from '~/lib/trpc/client';
import { useToast } from '~/hooks/use-toast';

const ArticleItem: React.FC<Article> = (props) => {
    const img = props.img ?? `/img/${props.category}.png`;
    const { data: session } = useSession();
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

    const canEdit = session?.user && (session.user.name === props.author || session.user.role === 'admin');

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

            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
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
                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="w-fit uppercase">
                            {props.category}
                        </Badge>
                    </div>
                    <Link href={`/${props.category}/${props.slug}`}>
                        <CardTitle className="hover:text-primary line-clamp-2 transition-colors">
                            {props.title}
                        </CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-3">{props.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground mb-4 flex gap-2 text-sm">
                        <span>@{props.author}</span>
                        <span>•</span>
                        <span>{new Date(props.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <TagsList tags={props.tags} />
                        {canEdit && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/editor?edit=${props.slug}`)}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
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
};

export default ArticleItem;
