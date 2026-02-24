import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import app from './app.js';

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
};

start();
