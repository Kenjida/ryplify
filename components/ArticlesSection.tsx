import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  perex: string;
  content: string;
  imageUrl?: string;
}

const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/articles')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a: Article, b: Article) => b.id - a.id);
        setArticles(sortedData);
      });
  }, []);

  return (
    <section id="articles" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Články</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map(article => (
            <Link to={`/clanek/${article.id}`} key={article.id} className="block border border-slate-700 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors">
              {article.imageUrl && (
                <img src={`http://localhost:3001${article.imageUrl}`} alt={article.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p>{article.perex}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/clanky" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Zobrazit všechny články
          </Link>
        </div>
      </div>
    </section>
  );
};


export default ArticlesSection;
