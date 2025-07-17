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
  // Match ALL possible Vercel URL patterns
  /^https?:\/\/(movie-flix|online-judge)(-[a-z0-9]+)?(-sumanths-projects-952cfa2b)?\.vercel\.app$/,
  "https://movie-flix-app-lac.vercel.app", // Explicit production URL
  "http://localhost:5173" // Dev
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(pattern => 
      typeof pattern === 'string' 
        ? origin === pattern 
        : pattern.test(origin))
    ) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // Preflight cache
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Catch-all OPTIONS
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
