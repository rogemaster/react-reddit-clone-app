import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import authRouters from './routes/auth';
import subRouters from './routes/subs';

const app = express();
const origin = 'http://localhost:3000';

app.use(cors({
  origin,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

dotenv.config();

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRouters);
app.use('/api/subs', subRouters);

let port = 3000;
app.listen(port, async () => {
  console.log(`Server run at http://localhost:${port}`);

  AppDataSource.initialize().then(async () => {
    console.log("Inserting a new user into the database...")
  }).catch(error => console.log(error))

});