import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Article {
  id: number;
  title: string;
  perex: string;
  content: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/articles/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Článek nebyl nalezen');
        }
        return response.json();
      })
      .then(data => setArticle(data))
      .catch(err => setError(err.message));
  }, [id]);

  return (
    <div className="bg-[#0a0f1f] text-slate-300 font-sans leading-relaxed min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {article ? (
          <article>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-lg text-slate-400 mb-8">{article.perex}</p>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        ) : (
          !error && <p>Načítání článku...</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
