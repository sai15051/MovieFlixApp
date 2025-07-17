import express from 'express';
import router from "./routes/router.js";
import { DBConnection } from './database/db.js';
import dotenv from 'dotenv';
import cors from "cors";

const app = express();


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  // Movie Flix App URLs
  "https://movie-flix-app-lac.vercel.app",
  "https://movie-flix-app-git-main-sumanths-projects-952cfa2b.vercel.app",
  "https://movie-flix-app-sumanths-projects-952cfa2b.vercel.app",
  /^https:\/\/movie-flix-app-.*-sumanths-projects-952cfa2b\.vercel\.app$/,
  
  // Online Judge URLs (if sharing same backend)
  "https://online-judge-fj7y.vercel.app",
  "https://online-judge-fj7y-git-main-sumanths-projects-952cfa2b.vercel.app",
  
  // Local development
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowedOrigins
      if (allowedOrigins.some(allowedOrigin => {
        return typeof allowedOrigin === 'string' 
          ? origin === allowedOrigin
          : allowedOrigin.test(origin);
      })) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  })
);


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
