import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { retrieveNews, NewsDetail } from '../../services/newsService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import './NewsPage.css';

const NewsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await retrieveNews(id);
                setNewsDetail(data);
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    if (!newsDetail) {
        return <div className="text-center p-5">Notizia non trovata</div>;
    }

    return (
        <article className="news-page fadein animation-duration-500">
            <img
                src={newsDetail.imageUrl}
                alt={newsDetail.title}
                className="news-header-image"
            />

            <header className="news-title-section">
                <h1 className="news-main-title">{newsDetail.title}</h1>
                <div className="news-meta">
                    <div className="news-author">
                        <Avatar
                            image={newsDetail.author.avatarUrl}
                            shape="circle"
                            size="large"
                            className="author-avatar"
                        />
                        <span className="font-bold">{newsDetail.author.name}</span>
                    </div>
                    <span className="news-date">| {newsDetail.date}</span>
                </div>
            </header>

            <div className="news-content-markdown">
                <ReactMarkdown>{newsDetail.contentMarkdown}</ReactMarkdown>
            </div>


            {newsDetail.attachments?.filter(a => a.url).length > 0 && (
                <section className="news-attachments">
                    <h3 className="attachments-title">
                        <i className="pi pi-paperclip mr-2"></i> Allegati
                    </h3>
                    <ul className="attachments-list">
                        {newsDetail.attachments
                            .filter(file => file.url)
                            .map((file, index) => (
                                <li key={index} className="attachment-item">
                                    <a href={file.url} className="attachment-link" download>
                                        <i className="pi pi-file-pdf attachment-icon"></i>
                                        <span>{file.name}</span>
                                    </a>
                                </li>
                            ))}
                    </ul>
                </section>
            )}


            <div className="text-center mt-5">
                <Button label="Torna alla Home" icon="pi pi-home" onClick={() => navigate('/')} text />
            </div>
        </article>
    );
};

export default NewsPage;
