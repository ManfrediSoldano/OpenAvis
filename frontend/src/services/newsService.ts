import client from "../api/client";

export interface NewsHighlight {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
}

export interface NewsDetail {
    id: string;
    title: string;
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
    views?: number;
    likes?: number;
}



export const getHighlights = async (): Promise<NewsHighlight[]> => {
    try {
        const response = await client.get('/api/getHighlights');
        return response.data as NewsHighlight[];
    } catch (error) {
        console.error("Failed to fetch highlights", error);
        return [];
    }
};

export const retrieveNews = async (id: string): Promise<NewsDetail | null> => {
    try {
        const response = await client.get(`/api/retrieveNews?id=${id}`);
        return response.data as NewsDetail;
    } catch (error) {
        if ((error as any).response?.status === 404) return null;
        console.error("Failed to retrieve news", error);
        return null;
    }
};

export const likeNews = async (id: string): Promise<NewsDetail | null> => {
    try {
        const response = await client.post(`/api/interactNews?id=${id}&action=like`);
        return response.data as NewsDetail;
    } catch (error) {
        console.error("Failed to like news", error);
        return null;
    }
};
