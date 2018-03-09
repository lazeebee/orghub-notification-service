import { Router } from 'express';
import EventTracker from '../models/EventTracker';
import { createHook, removeHook } from '../lib/webhook';
import getUsernameByToken from '../lib/getUsernameByToken';

export default function (config) {
  const router = Router();

  router.get('/:organization', async (req, res) => {
    const token = req.get('Authorization');
    const { organization } = req.params;
    const username = getUsernameByToken(token);
    const tracker = await EventTracker.getByUsernameAndOrganization(username, organization);
    if (tracker) {
      res.json(tracker);
    } else {
      res.sendStatus(404);
    }
  });

  router.post('/:organization', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const { organization } = req.params;
      const username = getUsernameByToken(token);
      const trackers = await EventTracker.createOrUpdate({ username, organization });
      if (!trackers) {
        await createHook(organization, token, config);
      }
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:organization', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const username = getUsernameByToken(token);
      const data = Object.assign({ username }, req.params, req.body);
      await EventTracker.createOrUpdate(data);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:organization', async (req, res, next) => {
    try {
      const token = req.get('Authorization');
      const username = getUsernameByToken(token);
      const { organization } = req.params;
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
