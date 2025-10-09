
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import geoip from 'geoip-lite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

const port = process.env.PORT || 3000;

const dbPath = path.join(__dirname, 'public', 'db.json');

const uploadsDir = path.join(__dirname, 'public', 'uploads');

const JWT_SECRET = 'your-super-secret-key-that-should-be-in-env-vars'; // In a real app, use environment variables



// --- MIDDLEWARE ---

app.use(cors());

app.use(bodyParser.json());



// Serve static assets

    app.use('/uploads', express.static(uploadsDir));





// --- DB HELPER FUNCTIONS ---

const readDB = () => {

  try {

    const dbRaw = fs.readFileSync(dbPath, 'utf-8');

    return JSON.parse(dbRaw);

  } catch (error) {

    console.error("Error reading database file:", error);

    // Return a default structure if the file is empty or corrupt

    return { articles: [], formSubmissions: [], pageViews: [], user: null };

  }

};



const writeDB = (data) => {

  try {

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  } catch (error) {

    console.error("Error writing to database file:", error);

    // This error is critical, as it means data isn't being saved.

    // In a real app, you might want to alert an admin here.

  }

};



// --- INITIALIZATION ---

const initializeUser = async () => {

  const db = readDB();

  if (!db.user) {

    console.log('No user found, creating default user...');

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash('Samurai10', salt);

    db.user = {

      username: 'Kenji',

      password: hashedPassword

    };

    writeDB(db);

    console.log('Default user created.');

  }

};



// Create uploads directory if it doesn't exist

if (!fs.existsSync(uploadsDir)) {

  fs.mkdirSync(uploadsDir, { recursive: true });

}



// --- AUTHENTICATION --- 



// Login Endpoint

app.post('/api/login', async (req, res) => {

  const { username, password } = req.body;

  const db = readDB();

  const user = db.user;



  if (!user || user.username !== username) {

    return res.status(400).json({ message: 'Nesprávné jméno nebo heslo.' });

  }



  const isMatch = await bcrypt.compare(password, user.password);



  if (!isMatch) {

    return res.status(400).json({ message: 'Nesprávné jméno nebo heslo.' });

  }



  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ token });

});



// Token Verification Middleware

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN



    if (token == null) return res.sendStatus(401); // if there isn't any token



    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) return res.sendStatus(403);

        req.user = user;

        next(); // pass the execution off to whatever request the client intended

    });

};



// Change Password Endpoint

app.post('/api/change-password', verifyToken, async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const db = readDB();

    const user = db.user;



    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {

        return res.status(400).json({ message: 'Původní heslo není správné.' });

    }



    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    db.user.password = hashedPassword;

    writeDB(db);



    res.json({ message: 'Heslo bylo úspěšně změněno.' });

});



// --- UTILITY FUNCTIONS ---

const slugify = (text) => {

  return text.toString().toLowerCase()

    .normalize('NFD')           // split an accented letter in the base letter and the acent

    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents

    .replace(/\s+/g, '-')        // Replace spaces with -

    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars

    .replace(/\-\-+/g, '-')      // Replace multiple - with single -

    .replace(/^-+/, '')          // Trim - from start of text

    .replace(/-+$/, '');         // Trim - from end of text

};





// --- FILE UPLOAD ---

const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, uploadsDir),

  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)

});

const upload = multer({ storage: storage });



app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {

  if (!req.file) {

    return res.status(400).send('No file uploaded.');

  }

  res.json({ imageUrl: `/uploads/${req.file.filename}` });

});



// --- ARTICLES API ---

app.get('/api/articles', (req, res) => {

  const db = readDB();

  res.json(db.articles);

});



app.get('/api/articles/:slug', (req, res) => {

  const db = readDB();

  // First, try to find by slug

  let article = db.articles.find(a => a.slug === req.params.slug);

  // If not found, try to find by ID (for backward compatibility)

  if (!article) {

    const articleId = parseInt(req.params.slug, 10);

    if (!isNaN(articleId)) {

      article = db.articles.find(a => a.id === articleId);

    }

  }

  

  if (article) res.json(article);

  else res.status(404).send('Article not found');

});



app.post('/api/articles', verifyToken, (req, res) => {

  const db = readDB();

  const { title, perex, content, imageUrl } = req.body;

  const slug = slugify(title);

  const newArticle = { id: Date.now(), title, perex, content, imageUrl, slug };

  db.articles.push(newArticle);

  writeDB(db);

  res.status(201).json(newArticle);

});



app.put('/api/articles/:id', verifyToken, (req, res) => {

  const db = readDB();

  const articleId = parseInt(req.params.id, 10);

  const articleIndex = db.articles.findIndex(a => a.id === articleId);

  if (articleIndex === -1) return res.status(404).send('Article not found');

  

  const { title } = req.body;

  const newSlug = title ? slugify(title) : db.articles[articleIndex].slug;



  const updatedArticle = { 

    ...db.articles[articleIndex], 

    ...req.body,

    slug: newSlug

  };

  db.articles[articleIndex] = updatedArticle;

  writeDB(db);

  res.json(updatedArticle);

});



app.delete('/api/articles/:id', verifyToken, (req, res) => {

  const db = readDB();

  const newArticles = db.articles.filter(a => a.id !== parseInt(req.params.id, 10));

  if (db.articles.length === newArticles.length) return res.status(404).send('Article not found');

  db.articles = newArticles;

  writeDB(db);

  res.status(204).send();

});



// --- OTHER APIs (Contact, Analytics) ---

app.get('/api/contact', verifyToken, (req, res) => {

  const db = readDB();

  res.json(db.formSubmissions || []);

});



// POST a new form submission

app.post('/api/contact', (req, res) => {

  const db = readDB();

  if (!db.formSubmissions) db.formSubmissions = [];

  const newSubmission = { id: Date.now(), submittedAt: new Date().toISOString(), ...req.body };

  db.formSubmissions.push(newSubmission);

  writeDB(db);

  res.status(201).json(newSubmission);

});



app.post('/api/track', (req, res) => {

  const db = readDB();

  if (!db.pageViews) db.pageViews = [];

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

  const newView = { id: Date.now(), path: req.body.path, timestamp: newtoISOString(), ip: ip };

  db.pageViews.push(newView);

  writeDB(db);

  res.status(201).json(newView);

});



app.get('/api/analytics', verifyToken, (req, res) => {

  const db = readDB();

  const pageViews = db.pageViews || [];

  const totalViews = pageViews.length;

  const viewsPerDay = pageViews.reduce((acc, view) => {

    const day = view.timestamp.split('T')[0];

    acc[day] = (acc[day] || 0) + 1;

    return acc;

  }, {});

  const topPages = Object.entries(pageViews.reduce((acc, view) => {

    acc[view.path] = (acc[view.path] || 0) + 1;

    return acc;

  }, {})).sort(([, a], [, b]) => b - a).slice(0, 10);

  const uniqueVisitors = new Set(pageViews.map(view => view.ip)).size;

  res.json({ totalViews, viewsPerDay, topPages, uniqueVisitors });

});



app.get('/api/analytics/ips', (req, res) => {

    const db = readDB();

    const pageViews = db.pageViews || [];

    const viewsByIp = pageViews.reduce((acc, view) => {

        if (view.ip) acc[view.ip] = (acc[view.ip] || 0) + 1;

        return acc;

    }, {});

        const sortedIps = Object.entries(viewsByIp).sort(([, a], [, b]) => b - a);

        res.json(sortedIps);

    });

    

    // --- PRODUCTION STATIC SERVING ---

    // This must be AFTER all API routes

    const distPath = path.join(__dirname, 'dist');

    if (fs.existsSync(distPath)) {

        // Serve static files from the 'dist' directory

        app.use(express.static(distPath)); 

    

        // Fallback for client-side routing, using the robust middleware pattern

        app.use((req, res, next) => {

            if (req.method === 'GET' && !res.headersSent) {

                 res.sendFile(path.join(distPath, 'index.html'));

            } else {

                 next(); 

            }

        });

    }

    

    

    // --- SERVER START ---

    app.listen(port, () => {

      initializeUser();

      console.log(`Backend server listening at http://localhost:${port}`);

    });

