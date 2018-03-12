import mongoose from 'mongoose';
import config from '../config';

const eventTrackerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  organization: { type: String, required: true },
  pushToken: String,
  phoneNumber: String,
  events: {
    type: [{
      type: String,
      enum: config.eventTypes,
    }],
    default: config.eventTypes,
  },
});

async function getByUsernameAndOrganization(username, organization) {
  return this.findOne({ username, organization });
}

async function getTrackers(organization, events) {
  return this.find({ organization, events });
}

async function countTrackers(organization) {
  return this.count({ organization });
}

async function removeByUsernameAndOrganization(username, organization) {
  await this.remove({ username, organization });
  return this.countTrackers(organization);
}

eventTrackerSchema.statics.getByUsernameAndOrganization = getByUsernameAndOrganization;
eventTrackerSchema.statics.getTrackers = getTrackers;
eventTrackerSchema.statics.countTrackers = countTrackers;
eventTrackerSchema.statics.removeByUsernameAndOrganization = removeByUsernameAndOrganization;
const EventTracker = mongoose.model('EventTracker', eventTrackerSchema);
export default EventTracker;
