import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();


const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL!,
  credentials: true,
}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET!,
  maxAge: 24 * 60 * 60 * 1000,
  name: 'reclaim',
  httpOnly: process.env.NODE_ENV === 'development' ? false : true,
}));

// Error handler
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error(err);
  res.status(500).render('error');
});

// health check
app.get('/health', (_, res) => {
   res.status(200).json({ time: new Date().toISOString(), status: 'ok' });
});

app.use(routes);
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});