import { Router } from 'express';

export default function (config) {
  const api = Router();

  // API routes
  // api.use('/someroute', someroute({ config, db }));

  // Expose something at root
  api.get('/', (req, res) => res.json({ message: 'Yay, Notification service is up and running' }));

  return api;
}
