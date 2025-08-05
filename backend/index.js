require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const mainRouter = require('./routes/index.routes');
const express = require('express');
const path = require('path');
const fs = require('fs');
const Category = require('./models/category.model');
const initSocket = require('./utils/socket');

const { errorHandler } = require('./middlewares/error.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const { corsConfig } = require('./middlewares/cors.middleware');
const { notFound } = require('./middlewares/notFound.middleware');
const { rateLimiter } = require('./middlewares/rateLimit.middleware');

const requiredEnvVars = ['PORT', 'FRONTEND_URL', 'MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

app.use(loggerMiddleware);
app.use(corsConfig);
app.use(express.json());
app.use(rateLimiter);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use(
  '/uploads',
  express.static(uploadsDir, {
    setHeaders: (res) => {
      res.set('X-Content-Type-Options', 'nosniff');
    },
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', websocket: 'supported' });
});

app.get('/ws-test', (req, res) => {
  res.setHeader('Connection', 'Upgrade');
  res.setHeader('Upgrade', 'websocket');
  res.status(426).end('Upgrade Required');
});

app.use('/api/v1', mainRouter);
app.use(notFound);
app.use(errorHandler);

const io = initSocket(server);
app.set('io', io);

const seedCategories = async () => {
  try {
    const predefinedCategories = [
      { name: 'Electronics', description: 'Devices and gadgets', isPredefined: true },
      { name: 'Clothing', description: 'Apparel and accessories', isPredefined: true },
      { name: 'Books', description: 'Textbooks and novels', isPredefined: true },
      { name: 'Personal Items', description: 'Wallets, keys, etc.', isPredefined: true },
      { name: 'Stationery', description: 'Pens, notebooks, etc.', isPredefined: true },
    ];

    const existingCategories = await Category.find({ name: { $in: predefinedCategories.map((c) => c.name) } });
    const existingNames = existingCategories.map((c) => c.name);

    const categoriesToInsert = predefinedCategories.filter((c) => !existingNames.includes(c.name));
    if (categoriesToInsert.length > 0) {
      await Category.insertMany(categoriesToInsert);
      console.log('Categories seeded successfully');
    } else {
      console.log('No new categories to seed');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const startServer = async () => {
  try {
    await connectDB();
    await seedCategories();
    server.on('error', (err) => {
      console.error('Server error:', err.message);
    });
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();