import 'dotenv/config';

import path from 'node:path';
import express from 'express';
import cors, {
  type CorsOptions,
} from 'cors';
import mongoose from 'mongoose';

import { connectDatabase } from './config/db.js';
import adminRouter from './routes/admin.js';
import { authRouter } from './routes/authRoutes.js';
import orderRoutes from './routes/orders.js';

const app = express();

const port = Number(
  process.env.PORT ?? 5000,
);

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:4173',
  'https://renewed-mindfulness-production-b090.up.railway.app',
  'https://mfz-pk.com',
  'https://www.mfz-pk.com',
]);

const configuredClientUrl =
  process.env.CLIENT_URL
    ?.trim()
    .replace(/\/+$/, '');

if (configuredClientUrl) {
  allowedOrigins.add(
    configuredClientUrl,
  );
}

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) {
    return true;
  }

  return /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin);
}

function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const cleanOrigin =
      origin
        .trim()
        .replace(/\/+$/, '');

    if (isAllowedOrigin(cleanOrigin)) {
      callback(null, true);
      return;
    }

    console.error(
      'CORS rejected origin:',
      cleanOrigin,
    );

    callback(null, false);
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
    'Accept',
  ],

  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const healthPayload = () => ({
  success: isDatabaseReady(),
  message: isDatabaseReady()
    ? 'MFZ API is running.'
    : 'MFZ API is waiting for MongoDB.',
  database: isDatabaseReady()
    ? 'connected'
    : 'disconnected',
});

app.get('/health', (_request, response) => {
  response
    .status(isDatabaseReady() ? 200 : 503)
    .json(healthPayload());
});

app.get('/api/health', (_request, response) => {
  response
    .status(isDatabaseReady() ? 200 : 503)
    .json(healthPayload());
});

app.use('/api', (request, response, next) => {
  if (request.path === '/health') {
    next();
    return;
  }

  if (!isDatabaseReady()) {
    response.status(503).json({
      success: false,
      message:
        'MFZ account service is reconnecting. Please try again in a moment.',
    });
    return;
  }

  next();
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(process.cwd(), 'dist');

  app.use(
    express.static(frontendDist, {
      index: false,
      maxAge: '1h',
    }),
  );

  app.use((request, response, next) => {
    if (
      request.method === 'GET' &&
      !request.path.startsWith('/api/')
    ) {
      response.sendFile(
        path.join(frontendDist, 'index.html'),
      );
      return;
    }

    next();
  });
}

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

function startHttpServer(): void {
  app.listen(
    port,
    '0.0.0.0',
    () => {
      console.log(
        `MFZ server running on port ${port}`,
      );
    },
  );
}

async function startApplication(): Promise<void> {
  try {
    // Do not expose the Railway service until MongoDB is actually ready.
    // Railway's /api/health check will now only pass after this connection
    // succeeds, preventing mobile users from reaching auth during startup.
    await connectDatabase();

    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected. API requests will temporarily return 503.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully.');
    });

    startHttpServer();
  } catch (error) {
    console.error(
      'MFZ startup failed because MongoDB could not connect:',
      error,
    );

    process.exit(1);
  }
}

void startApplication();