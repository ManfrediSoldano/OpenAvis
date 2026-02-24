import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { retrieveNews, NewsDetail, likeNews } from '../../services/newsService';
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
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await retrieveNews(id);
                if (data) {
                    setNewsDetail(data);
                    setLikes(data.likes || 0);
                }
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    const handleLike = async () => {
        if (!id || isLiked) return;
        try {
            const updated = await likeNews(id);
            if (updated) {
                setLikes(updated.likes || (likes + 1));
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error liking news:", error);
        }
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = newsDetail?.title || "Leggi questa notizia su OpenAvis";
        let shareUrl = "";

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
    };

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
                    </p>
                    <Button
                        label="Vai alle Notizie"
                        icon="pi pi-list"
                        className="home-button mb-2"
                        onClick={() => navigate("/news")}
                    />
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

            <div className="news-interaction-bar">
                <div className="flex align-items-center justify-content-center gap-4">
                    <Button
                        icon={isLiked ? "pi pi-heart-fill" : "pi pi-heart"}
                        label={likes.toString()}
                        className={`p-button-rounded ${isLiked ? 'p-button-danger' : 'p-button-outlined p-button-secondary'} like-button`}
                        onClick={handleLike}
                        disabled={isLiked}
                        tooltip="Mi piace"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                    <div className="sharing-options flex gap-2">
                        <Button icon="pi pi-facebook" className="p-button-rounded p-button-info p-button-text" onClick={() => handleShare('facebook')} tooltip="Condividi su Facebook" />
                        <Button icon="pi pi-twitter" className="p-button-rounded p-button-info p-button-text" onClick={() => handleShare('twitter')} tooltip="Condividi su Twitter" />
                        <Button icon="pi pi-whatsapp" className="p-button-rounded p-button-success p-button-text" onClick={() => handleShare('whatsapp')} tooltip="Condividi su WhatsApp" />
                        <Button icon="pi pi-linkedin" className="p-button-rounded p-button-info p-button-text" onClick={() => handleShare('linkedin')} tooltip="Condividi su LinkedIn" />
                    </div>
                </div>
            </div>

            <div className="text-center mt-5">
                <Button label="Torna alle News" icon="pi pi-list" onClick={() => navigate('/news')} text />
                <Button label="Home" icon="pi pi-home" onClick={() => navigate('/')} text />
            </div>
        </article>
    );
};

export default NewsPage;
