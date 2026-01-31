import { auth } from '~/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import AvatarEditor from '~/components/AvatarEditor';
import { Separator } from '~/components/ui/separator';
import { CalendarDays, Mail, UserCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarEditor />

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.regDate && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Member since{' '}
                    {new Date(user.regDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <Button variant="outline" className="w-full" asChild>
              <Link href={`/articles/user/${user.name}`}>
                <UserCircle className="mr-2 h-4 w-4" />
                View Your Articles
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/editor">Create New Article</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/articles/user/${user.name}`}>
                Manage Articles
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Browse Articles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
