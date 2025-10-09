
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Article {
  id: number;
  title: string;
  perex: string;
  content: string;
  imageUrl?: string;
  slug?: string;
}

const AllArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a: Article, b: Article) => b.id - a.id);
        setArticles(sortedData);
      });
  }, []);

  return (
    <div className="bg-[#0a0f1f] text-slate-300 font-sans leading-relaxed">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Všechny články</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link to={`/clanek/${article.slug || article.id}`} key={article.id} className="block border border-slate-700 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors">
                {article.imageUrl && (
                  <img src={`${article.imageUrl}`} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p>{article.perex}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllArticlesPage;
