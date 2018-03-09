import RateLimit from 'express-rate-limit';
import path from 'path';
import env from 'dotenv';

env.load();

export default {
  port: process.env.PORT || 5000,
  prefix: process.env.PREFIX || '/api',
  dbAddress: process.env.DBADRESS,
  bodyParser: { limit: '100kb' },
  cors: { exposedHeaders: ['Link'] },
  logDirectory: path.join(__dirname, '/../../logs'),
  rateLimit: new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    delayMs: 0,
  }),
  eventTypes: ['issue_comment', 'issues', 'pull_request', 'pull_request_review',
    'pull_request_review_comment', 'push'],
  payloadUrl: process.env.PAYLOAD_URL,
};
