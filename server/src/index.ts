import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin.js';
import { connectDatabase } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import orderRoutes from './routes/orders.js';
const app = express();

const port = Number(
  process.env.PORT ?? 5000,
);
app.use('/api/admin', adminRouter);
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ??
      'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'MFZ API is running.',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/orders', orderRoutes);
app.use((_request, response) => {
  response.status(404).json({
    message: 'Route not found.',
  });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(
        `MFZ server running at http://localhost:${port}`,
      );
    });
  } catch (error) {
    console.error(
      'Server startup failed:',
      error,
    );

    process.exit(1);
  }
}

void startServer();