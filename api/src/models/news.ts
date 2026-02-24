export interface NewsItem {
    id: string;
    title: string;
    subtitle?: string;
    contentMarkdown: string;
    imageUrl: string;
    author: {
        name: string;
        avatarUrl: string;
    };
    attachments: {
        name: string;
        url: string;
    }[];
    date: string;
    isHighlight: boolean;
    createdAt: string;
    views?: number;
    likes?: number;
}
