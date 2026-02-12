import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { retrieveNews, NewsDetail } from '../../services/newsService';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import './NewsPage.css';
import '../pages/NotFoundPage.css';
import { Skeleton } from 'primereact/skeleton';
import { motion } from 'framer-motion';

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
                // Simulate a slight delay for better UX if needed, but not required by user
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="news-page fadein animation-duration-500">
                <Skeleton width="100%" height="400px" className="news-header-image mb-4" />
                <header className="news-title-section">
                    <Skeleton width="80%" height="3rem" className="mx-auto mb-4" />
                    <div className="news-meta flex justify-content-center gap-3">
                        <Skeleton shape="circle" size="3rem" />
                        <Skeleton width="100px" height="1.5rem" />
                        <Skeleton width="80px" height="1.5rem" />
                    </div>
                </header>
                <div className="news-content-markdown mt-5">
                    <Skeleton width="100%" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="1.2rem" className="mb-2" />
                    <Skeleton width="90%" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="1.2rem" className="mb-2" />
                    <Skeleton width="80%" height="1.2rem" className="mb-4" />
                    <Skeleton width="100%" height="1.2rem" className="mb-2" />
                    <Skeleton width="95%" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="1.2rem" className="mb-2" />
                    <Skeleton width="85%" height="1.2rem" />
                </div>
            </div>
        );
    }

    if (!newsDetail) {
        return (
            <div className="notfound-container">
                <motion.div
                    className="notfound-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <motion.i
                        className="pi pi-search-minus notfound-icon"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 10
                        }}
                    ></motion.i>
                    <h1 className="notfound-title">Oops!</h1>
                    <h2 className="notfound-subtitle">Notizia non trovata</h2>
                    <p className="notfound-description">
                        Spiacenti, la notizia che stai cercando non esiste o è stata rimossa.
                        Torna all'elenco delle notizie per scoprire le ultime novità di AVIS.
                    </p>
                    <div className="flex flex-column gap-2">
                        <Button
                            label="Vai alle Notizie"
                            icon="pi pi-list"
                            className="home-button mb-2"
                            onClick={() => navigate("/news")}
                        />
                        <Button
                            label="Torna alla Home"
                            icon="pi pi-home"
                            onClick={() => navigate("/")}
                            text
                        />
                    </div>
                </motion.div>
            </div>
        );
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
