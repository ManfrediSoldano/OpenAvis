import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighlights, NewsHighlight } from '../../services/newsService';
import './NewsSection.css';
import { Skeleton } from 'primereact/skeleton';

const NewsSection: React.FC = () => {
    const [highlights, setHighlights] = useState<NewsHighlight[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getHighlights();
                setHighlights(data);
            } catch (error) {
                console.error("Error fetching highlights:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderSkeletons = () => {
        return Array.from({ length: 3 }).map((_, index) => (
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

    if (loading) {
        return (
            <section className="news-section">
                <h2>In evidenza</h2>
                <div className="news-grid">
                    {renderSkeletons()}
                </div>
            </section>
        );
    }

    if (highlights.length === 0) {
        return null;
    }

    return (
        <section className="news-section">
            <h2>In evidenza</h2>
            <div className="news-grid">
                {highlights.map((item) => {
                    const isSurvey = item.contentType === 'survey';
                    return (
                    <article
                        key={`${item.contentType || 'news'}-${item.id}`}
                        className="news-card"
                        onClick={() => navigate(isSurvey ? `/survey/${item.id}` : `/news/${item.id}`)}
                    >
                        <div className="news-image-container">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="news-image" />
                            ) : (
                                <div className="highlight-image-placeholder" aria-hidden="true">
                                    <i className="pi pi-list-check"></i>
                                </div>
                            )}
                            <span className={`highlight-type-badge ${isSurvey ? 'survey' : 'news'}`}>
                                {isSurvey ? 'Sondaggio' : 'Notizia'}
                            </span>
                        </div>
                        <div className="news-content">
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-subtitle">{item.subtitle}</p>
                            <span className="news-link">{isSurvey ? 'Partecipa' : 'Leggi tutto'} &rarr;</span>
                        </div>
                    </article>
                    );
                })}
            </div>
            <div className="news-footer" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/news')}
                    style={{
                        padding: '0.8rem 2rem',
                        backgroundColor: '#0075be',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005fa0')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0075be')}
                >
                    Vedi tutte le notizie
                </button>
            </div>
        </section>
    );
};

export default NewsSection;
