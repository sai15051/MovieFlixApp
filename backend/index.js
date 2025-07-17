import express from 'express';
import router from "./routes/router.js";
import { DBConnection } from './database/db.js';
import dotenv from 'dotenv';
import cors from "cors";

const app = express();


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



;const vercelPatterns = [
  /^https:\/\/movie-flix(-[\w-]+)?-sumanths-projects-952cfa2b\.vercel\.app$/,
  /^https:\/\/movie-flix(-[\w-]+)?\.vercel\.app$/,
  /^https:\/\/online-judge(-[\w-]+)?\.vercel\.app$/,
    /\.vercel\.app$/, 
  "https://movie-flix-app.vercel.app" 
];

// 2. CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check against allowed patterns
    if (
      process.env.NODE_ENV === 'development' && 
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }

    // Match Vercel deployment patterns
    if (vercelPatterns.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }

    // Production domain check
    if (origin === 'https://movie-flix-app.vercel.app') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// 3. Middleware Setup
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// 4. Security Headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});




app.use("/", router);
schedule.scheduleJob('0 0 * * *', async () => {
  console.log('Running daily cache cleanup...');
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await Movie.deleteMany({ lastUpdated: { $lt: cutoff } });
    console.log(`Deleted ${result.deletedCount} stale cache entries`);
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
});


DBConnection();


const PORT =8001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
