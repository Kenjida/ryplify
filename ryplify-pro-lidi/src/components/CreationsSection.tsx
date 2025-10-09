import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  perex: string;
  imageUrl?: string;
  slug?: string;
}

const CreationsSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Fetch articles from the main site's live API
    fetch('https://vibe.ryplify.eu/api/articles')
      .then(response => response.json())
      .then(data => {
        // Sort articles to get the newest ones and take the latest 3
        const sortedData = data.sort((a: Article, b: Article) => b.id - a.id);
        setArticles(sortedData.slice(0, 3));
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  return (
    <section id="creations" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Moje výtvory</h2>
          <p className="text-lg text-slate-400 mt-4">Ukázka několika projektů a myšlenek, které jsem nedávno realizoval.</p>
          <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <a 
              href={`https://vibe.ryplify.eu/clanek/${article.slug || article.id}`} 
              key={article.id} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-red-500 hover:-translate-y-2 transition-all duration-300"
            >
              {article.imageUrl && (
                <img src={`https://vibe.ryplify.eu${article.imageUrl}`} alt={article.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                <p className="text-slate-400">{article.perex}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreationsSection;
