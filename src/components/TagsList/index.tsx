import Link from 'next/link';
import React from 'react';
import { Badge } from '~/components/ui/badge';

const TagsList: React.FC<{ tags?: string[] }> = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-1 flex-wrap items-center gap-2">
            {tags.map((tag) => (
                <Link key={tag} href={`/articles/?tags=${tag}`}>
                    <Badge
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                    >
                        {tag}
                    </Badge>
                </Link>
            ))}
        </div>
    );
};

export default TagsList;
