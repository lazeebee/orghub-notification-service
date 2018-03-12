import { Router } from 'express';
import notifications from './notifications';
import payload from './payload';
import unregister from './unregister';

export default function (config) {
  const api = Router();

  // API routes
  api.use('/notifications', notifications(config));
  api.use('/payload', payload(config));
  api.use('/unregister', unregister(config));

  // Expose something at root
  api.get('/', (req, res) => res.json({ message: 'Yay, Notification service is up and running' }));

  return api;
}
