import mongoose from 'mongoose';
import { eventTypes } from '../config';

const eventTrackerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  organization: { type: String, required: true },
  pushToken: String,
  phoneNumber: String,
  events: [{
    type: String,
    enum: eventTypes,
    default: eventTypes,
  }],
});

async function getByUsernameAndOrganization(username, organization) {
  return this.findOne({ username, organization });
}

async function getTrackers({ organization, events }) {
  return this.find({ organization, events });
}

async function countTrackers(organization) {
  return this.count({ organization });
}

async function createOrUpdate(data) {
  this.update({
    username: data.username,
    organization: data.organization,
  }, data, { upsert: true, setDefaultsOnInsert: true });
  return this.countTrackers(data.organization);
}

async function removeByUsernameAndOrganization(username, organization) {
  this.remove({ username, organization });
  return this.countTrackers(organization);
}

async function removeByUsername(username) {
  const trackers = this.find({ username });
  this.remove({ username });
  return trackers.filter(tracker => this.countTrackers(tracker.organization) === 0);
}

eventTrackerSchema.statics.getByUsernameAndOrganization = getByUsernameAndOrganization;
eventTrackerSchema.statics.getTrackers = getTrackers;
eventTrackerSchema.statics.countTrackers = countTrackers;
eventTrackerSchema.statics.createOrUpdate = createOrUpdate;
eventTrackerSchema.statics.removeByUsernameAndOrganization = removeByUsernameAndOrganization;
eventTrackerSchema.statics.removeByUsername = removeByUsername;
const EventTracker = mongoose.model('EventTracker', eventTrackerSchema);
export default EventTracker;
