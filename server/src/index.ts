import 'dotenv/config';

import express from 'express';
import cors, {
  type CorsOptions,
} from 'cors';

import { connectDatabase } from './config/db.js';
import adminRouter from './routes/admin.js';
import { authRouter } from './routes/authRoutes.js';
import orderRoutes from './routes/orders.js';

const app = express();

const port = Number(
  process.env.PORT ?? 5000,
);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://mfz-pk.com',
  'https://www.mfz-pk.com',
  process.env.CLIENT_URL
    ?.trim()
    .replace(/\/$/, ''),
].filter(
  (origin): origin is string =>
    Boolean(origin),
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Health checks, Postman and server-to-server
    // requests may not include an Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }

    const cleanOrigin =
      origin.replace(/\/$/, '');

    if (
      allowedOrigins.includes(cleanOrigin)
    ) {
      callback(null, true);
      return;
    }

    console.error(
      'Blocked CORS origin:',
      cleanOrigin,
    );

    callback(
      new Error(
        `Origin ${cleanOrigin} is not allowed by CORS.`,
      ),
    );
  },

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  credentials: true,
  optionsSuccessStatus: 204,
};

// CORS must be registered before all API routes.
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get(
  '/api/health',
  (_request, response) => {
    response.status(200).json({
      success: true,
      message: 'MFZ API is running.',
    });
  },
);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRoutes);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(
      port,
      '0.0.0.0',
      () => {
        console.log(
          `MFZ server running on port ${port}`,
        );
      },
    );
  } catch (error) {
    console.error(
      'Server startup failed:',
      error,
    );

    process.exit(1);
  }
}

void startServer();