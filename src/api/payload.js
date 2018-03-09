import { Router } from 'express';
import EventTracker from '../models/EventTracker';

export default function (config) {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const { zen, org } = req.body;
      const type = req.get('X-GitHub-Event');

      if (!zen) {
        const trackers = await EventTracker.getTrackers(org.id, type);
        trackers.forEach(tracker => console.log(tracker));
      }
      res.sendStatus(202);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
