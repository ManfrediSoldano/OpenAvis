import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighlights, NewsHighlight } from '../../services/newsService';
import './NewsPage.css';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import '../pages/NotFoundPage.css';

const NewsListPage: React.FC = () => {
    const [news, setNews] = useState<NewsHighlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await getHighlights();
                setNews(data);
                if (!data || data.length === 0) {
                    // We could distinguish between "no data" and "error", 
                    // but for now we'll treat empty as a valid state but shown with the same UI pattern
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className="news-card">
                <div className="news-image-container">
                    <Skeleton width="100%" height="100%" borderRadius="0" />
                </div>
                <div className="news-content">
                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    <Skeleton width="40%" height="1rem" className="mb-3" />
                    <Skeleton width="100%" height="0.8rem" className="mb-1" />
                    <Skeleton width="100%" height="0.8rem" className="mb-1" />
                    <Skeleton width="90%" height="0.8rem" className="mb-3" />
                    <Skeleton width="30%" height="1rem" className="mt-auto" />
                </div>
            </article>
        ));
    };

    return (
        <div className="news-list-page" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
            <h1 style={{ color: '#0075be', marginBottom: '2rem', textAlign: 'center' }}>Notizie</h1>

            {loading ? (
                <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {renderSkeletons()}
                </div>
            ) : (news.length === 0 || error) ? (
                <div className="notfound-container" style={{ minHeight: '40vh' }}>
                    <motion.div
                        className="notfound-content"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <motion.i
                            className={`pi ${error ? 'pi-exclamation-triangle' : 'pi-calendar-times'} notfound-icon`}
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                        ></motion.i>
                        <h2 className="notfound-title" style={{ fontSize: '2.5rem' }}>
                            {error ? 'Errore' : 'Nessuna Notizia'}
                        </h2>
                        <p className="notfound-description">
                            {error
                                ? "Si è verificato un problema durante il caricamento delle notizie. Riprova più tardi."
                                : "Al momento non ci sono notizie da visualizzare. Torna a trovarci presto!"}
                        </p>
                        <div className="flex flex-column gap-2">
                            <Button
                                label={error ? "Riprova" : "Torna alla Home"}
                                icon={`pi ${error ? 'pi-refresh' : 'pi-home'}`}
                                className="home-button mb-2"
                                onClick={() => error ? window.location.reload() : navigate("/")}
                            />
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="news-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/news/${item.id}`)}
                        >
                            <div className="news-image-container">
                                <img src={item.imageUrl} alt={item.title} className="news-image" />
                            </div>
                            <div className="news-content">
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-subtitle">{item.subtitle}</p>
                                <span className="news-link">Leggi tutto &rarr;</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsListPage;
