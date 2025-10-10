

import React, { useState, useEffect, FormEvent, ChangeEvent, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ProjectTimeTrackerAdmin from '../components/ProjectTimeTrackerAdmin';
const RichTextEditor = lazy(() => import('../components/RichTextEditor'));

// Helper to get the auth token
const getAuthToken = () => localStorage.getItem('authToken');

interface Article {
  id: number;
  title: string;
  perex: string;
  content: string;
  imageUrl?: string;
}

interface FormSubmission {
  id: number;
  submittedAt: string;
  name: string;
  email: string;
  message: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [uploading, setUploading] = useState(false);

  // State for password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const fetchWithAuth = (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
    // For multipart/form-data, let the browser set the Content-Type
    if (options.body instanceof FormData) {
      // @ts-ignore
      delete headers['Content-Type'];
    }
    return fetch(url, { ...options, headers });
  };

  const fetchArticles = () => {
    fetch('/api/articles')
      .then(response => response.json())
      .then(data => setArticles(data));
  };

  const fetchSubmissions = () => {
    fetchWithAuth('/api/contact')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sortedData = data.sort((a: FormSubmission, b: FormSubmission) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setFormSubmissions(sortedData);
        } else {
          setFormSubmissions([]);
        }
      });
  };

  useEffect(() => {
    fetchArticles();
    fetchSubmissions();
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Opravdu chcete smazat tento článek?')) {
      fetchWithAuth(`/api/articles/${id}`, { method: 'DELETE' })
        .then(() => fetchArticles());
    }
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentArticle({ id: 0, title: '', perex: '', content: '', imageUrl: '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentArticle(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      setUploading(true);

      fetchWithAuth('/api/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.imageUrl && currentArticle) {
          setCurrentArticle({ ...currentArticle, imageUrl: data.imageUrl });
        }
        setUploading(false);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setUploading(false);
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArticle) return;

    const url = currentArticle.id === 0 
      ? '/api/articles' 
      : `/api/articles/${currentArticle.id}`;
      
    const method = currentArticle.id === 0 ? 'POST' : 'PUT';

    fetchWithAuth(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentArticle),
    }).then(() => {
      fetchArticles();
      handleCancel();
    });
  };

  const handleSubmissionClick = (submission: FormSubmission) => {
    const subject = encodeURIComponent(`Re: Vaše zpráva na Ryplify`);
    const body = encodeURIComponent(`\n\n---\nPůvodní zpráva:\n${submission.message}`);
    window.location.href = `mailto:${submission.email}?subject=${subject}&body=${body}`;
  }

  const handleDeleteSubmission = (id: number) => {
    if (window.confirm('Opravdu chcete smazat tento záznam?')) {
      fetchWithAuth(`/api/contact/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) {
            fetchSubmissions();
          } else {
            console.error("Failed to delete submission");
          }
        });
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Nová hesla se neshodují.');
      return;
    }
    if (!newPassword || !oldPassword) {
        setPasswordError('Všechna pole jsou povinná.');
        return;
    }

    try {
        const response = await fetchWithAuth('/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Něco se pokazilo');
        }
        setPasswordMessage(data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err: any) {
        setPasswordError(err.message);
    }
  };

  if (isEditing && currentArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
            &larr; Zpět na přehled
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-slate-300">{currentArticle.id === 0 ? 'Přidat článek' : 'Upravit článek'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-slate-300">Název</label>
            <input
              type="text"
              value={currentArticle.title}
              onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
              className="w-full p-2 border rounded bg-slate-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-slate-300">Náhledový obrázek</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded bg-slate-700 text-white"
            />
            {uploading && <p>Nahrávám obrázek...</p>}
            {currentArticle.imageUrl && !uploading && (
              <div className="mt-4">
                <img src={`${currentArticle.imageUrl}`} alt="Náhled" className="max-w-xs rounded" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-slate-300">Perex</label>
            <textarea
              value={currentArticle.perex}
              onChange={(e) => setCurrentArticle({ ...currentArticle, perex: e.target.value })}
              className="w-full p-2 border rounded bg-slate-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-slate-300">Obsah</label>
            <Suspense fallback={<div>Načítání editoru...</div>}>
              <RichTextEditor
                content={currentArticle.content}
                onChange={(content) => {
                  if (currentArticle) {
                    setCurrentArticle({ ...currentArticle, content });
                  }
                }}
              />
            </Suspense>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" disabled={uploading}>
            {uploading ? 'Čekejte...' : 'Uložit'}
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Zrušit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-slate-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administrace</h1>
        <button onClick={handleLogout} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Odhlásit
        </button>
      </div>

      <div className="mb-8 p-4 border rounded-lg border-slate-700">
        <h2 className="text-xl font-bold mb-4 cursor-pointer" onClick={() => setIsPasswordFormVisible(!isPasswordFormVisible)}>
          Změna hesla {isPasswordFormVisible ? '▲' : '▼'}
        </h2>
        {isPasswordFormVisible && (
            <form onSubmit={handleChangePassword} className="max-w-md mt-4">
                <div className="mb-4">
                    <label className="block mb-1 text-slate-300">Původní heslo</label>
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-2 border rounded bg-slate-700 text-white" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-slate-300">Nové heslo</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded bg-slate-700 text-white" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-slate-300">Potvrdit nové heslo</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded bg-slate-700 text-white" />
                </div>
                {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
                {passwordMessage && <p className="text-green-500 mb-4">{passwordMessage}</p>}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Změnit heslo
                </button>
            </form>
        )}
      </div>
      
      <div className="mb-8 p-4 border rounded-lg border-slate-700">
        <h2 className="text-xl font-bold mb-4">Přehled návštěvnosti</h2>
        <AnalyticsDashboard fetchWithAuth={fetchWithAuth} />
      </div>

      <div className="mb-8 p-4 border rounded-lg border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Správa článků</h2>
          <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Přidat článek
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-700 p-2">Název</th>
              <th className="border-b border-slate-700 p-2">Akce</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td className="border-b border-slate-700 p-2">{article.title}</td>
                <td className="border-b border-slate-700 p-2">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleEdit(article)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                      Upravit
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Smazat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border rounded-lg border-slate-700">
        <h2 className="text-xl font-bold mb-4">Správa formuláře</h2>
        {/* On mobile, show a list of cards */}
        <div className="md:hidden">
          {formSubmissions.map(submission => (
            <div key={submission.id} className="bg-slate-800 rounded-lg p-4 mb-4">
              <div onClick={() => handleSubmissionClick(submission)} className="cursor-pointer">
                <p><strong className="font-semibold">Datum:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                <p><strong className="font-semibold">Jméno:</strong> {submission.name}</p>
                <p><strong className="font-semibold">Email:</strong> {submission.email}</p>
                <p className="truncate"><strong className="font-semibold">Zpráva:</strong> {submission.message}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteSubmission(submission.id); }}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-full"
              >
                Smazat
              </button>
            </div>
          ))}
        </div>
        {/* On desktop, show a table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-700 p-2">Datum</th>
                <th className="border-b border-slate-700 p-2">Jméno</th>
                <th className="border-b border-slate-700 p-2">Email</th>
                <th className="border-b border-slate-700 p-2">Zpráva</th>
                <th className="border-b border-slate-700 p-2">Akce</th>
              </tr>
            </thead>
            <tbody>
              {formSubmissions.map(submission => (
                <tr key={submission.id} className="hover:bg-slate-800 transition-colors">
                  <td onClick={() => handleSubmissionClick(submission)} className="cursor-pointer border-b border-slate-700 p-2">{new Date(submission.submittedAt).toLocaleString()}</td>
                  <td onClick={() => handleSubmissionClick(submission)} className="cursor-pointer border-b border-slate-700 p-2">{submission.name}</td>
                  <td onClick={() => handleSubmissionClick(submission)} className="cursor-pointer border-b border-slate-700 p-2">{submission.email}</td>
                  <td onClick={() => handleSubmissionClick(submission)} className="cursor-pointer border-b border-slate-700 p-2 whitespace-pre-wrap break-words max-w-xs">{submission.message}</td>
                  <td className="border-b border-slate-700 p-2">
                    <button 
                      onClick={() => handleDeleteSubmission(submission.id)} 
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 p-4 border rounded-lg border-slate-700">
        <h2 className="text-xl font-bold mb-4">Project Time Tracker</h2>
        <ProjectTimeTrackerAdmin />
      </div>

    </div>
  );
};

export default Admin;
