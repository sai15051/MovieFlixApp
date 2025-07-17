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
  "https://movie-flix-app-lac.vercel.app",
  "http://localhost:5173",
  // Match ALL Vercel deployment patterns
  /^https:\/\/movie-flix(-[\w-]+)?-sumanths-projects-952cfa2b\.vercel\.app$/,
  /^https:\/\/movie-flix(-[\w-]+)?\.vercel\.app$/
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      // Check against string matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Check regex patterns
      for (const pattern of allowedOrigins.filter(p => p instanceof RegExp)) {
        if (pattern.test(origin)) {
          return callback(null, true);
        }
      }
      
      callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ADD OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  })
);

// Add explicit OPTIONS handler
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
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
