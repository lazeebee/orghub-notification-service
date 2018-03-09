import { Router } from 'express';
import EventTracker from '../models/EventTracker';
import { createHook, removeHook } from '../lib/webhook';

export default function (config) {
  const router = Router();

  router.get('/:username/:organization', async (req, res) => {
    const { username, organization } = req.params;
    const tracker = await EventTracker.getByUsernameAndOrganization(username, organization);
    if (tracker) {
      res.json(tracker);
    } else {
      res.sendStatus(404);
    }
  });

  router.post('/:username/:organization', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const { username, organization } = req.params;
      const trackers = await EventTracker.createOrUpdate({ username, organization });
      if (!trackers) {
        await createHook(organization, token, config);
      }
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:username/:organization', async (req, res, next) => {
    try {
      const data = Object.assign({}, req.params, req.body);
      await EventTracker.createOrUpdate(data);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:username', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const { username } = req.params;
      const trackers = await EventTracker.removeByUsername(username);
      trackers.forEach(async tracker => removeHook(tracker.organization, token, config));
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:username/:organization', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const { username, organization } = req.params;
      const trackers = await EventTracker.removeByUsernameAndOrganization(username, organization);
      if (!trackers) {
        await removeHook(organization, token, config);
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
