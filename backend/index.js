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
  "http://localhost:5173",
  "https://movie-flix-app-lac.vercel.app",
  "https://movie-flix-app-git-master-sumanths-projects-952cfa2b.vercel.app",
  "https://movie-flix-mawsibj2d-sumanths-projects-952cfa2b.vercel.app", // preview
  "https://online-judge-pi-lemon.vercel.app",
  "https://online-judge-fj7y.vercel.app",

];


app.use(
    cors({
        origin: allowedOrigins, 
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200,
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
