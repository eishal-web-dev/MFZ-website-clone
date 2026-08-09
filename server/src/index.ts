import 'dotenv/config';

import path from 'node:path';
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

let databaseReady = false;

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
  success: true,
  message: 'MFZ API is running.',
  database: databaseReady
    ? 'connected'
    : 'disconnected',
});

app.get('/health', (_request, response) => {
  response.status(200).json(healthPayload());
});

app.get('/api/health', (_request, response) => {
  response.status(200).json(healthPayload());
});

app.use('/api', (request, response, next) => {
  if (request.path === '/health') {
    next();
    return;
  }

  if (!databaseReady) {
    response.status(503).json({
      success: false,
      message:
        'MFZ account service cannot connect to MongoDB. Check MONGODB_URI in Railway.',
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

async function connectMongo(): Promise<void> {
  try {
    await connectDatabase();
    databaseReady = true;
  } catch (error) {
    databaseReady = false;
    console.error(
      'MongoDB connection failed. Website will stay online, but account/order APIs are unavailable until MongoDB is configured:',
      error,
    );
  }
}

startHttpServer();
void connectMongo();
