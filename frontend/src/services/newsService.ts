import { ReactNode } from "react";

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
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:7071/api";

export const getHighlights = async (): Promise<NewsHighlight[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/getHighlights`);
        if (!response.ok) {
            throw new Error(`Error fetching highlights: ${response.statusText}`);
        }
        const data = await response.json();
        return data as NewsHighlight[];
    } catch (error) {
        console.error("Failed to fetch highlights", error);
        return [];
    }
};

export const retrieveNews = async (id: string): Promise<NewsDetail | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/retrieveNews?id=${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Error retrieving news: ${response.statusText}`);
        }
        const data = await response.json();
        return data as NewsDetail;
    } catch (error) {
        console.error("Failed to retrieve news", error);
        // Fallback to null or rethrow based on strategy
        return null;
    }
};
