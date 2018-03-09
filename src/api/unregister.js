import { Router } from 'express';
import EventTracker from '../models/EventTracker';
import { removeHook } from '../lib/webhook';
import getUsernameByToken from '../lib/getUsernameByToken';

export default function (config) {
  const router = Router();

  router.delete('/', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const username = getUsernameByToken(token);
      const trackers = await EventTracker.removeByUsername(username);
      trackers.forEach(async tracker => removeHook(tracker.organization, token, config));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
