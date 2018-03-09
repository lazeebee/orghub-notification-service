import { Router } from 'express';
import notifications from './notifications';
import payload from './payload';

export default function (config) {
  const api = Router();

  // API routes
  api.use('/notifications', notifications(config));
  api.use('/notifications/payload', payload(config));

  // Expose something at root
  api.get('/', (req, res) => res.json({ message: 'Yay, Notification service is up and running' }));

  return api;
}
