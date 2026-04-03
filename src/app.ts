import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { API_PREFIX } from './utils/constants';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { formatResponse } from './utils/apiResponse';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(globalRateLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json(formatResponse(true, 'Service healthy', { timestamp: new Date().toISOString() }, null));
});

app.use(API_PREFIX, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
