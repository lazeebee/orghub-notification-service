import Twilio from 'twilio';
import Expo from 'expo-server-sdk';
import { twilioAccountSid, twilioAuthToken, twilioFromNumber as from } from '../config';

const expo = new Expo();
const twilio = Twilio(twilioAccountSid, twilioAuthToken);

export function buildActionMessage(type, action) {
  if (type === 'issue_comment') {
    return 'commented on an issue';
  } else if (type === 'issues') {
    return `${action} an issue`;
  } else if (type === 'pull_request') {
    return `${action} a pull request`;
  } else if (type === 'pull_request_review') {
    return `${action} a pull request review`;
  } else if (type === 'pull_request_review_comment') {
    return 'commented on a pull request review';
  }
  return 'created a commit';
}

export function buildMessageBody(payload, type) {
  const { sender, repository, action } = payload;
  const actionMessage = buildActionMessage(type, action);
  return `${sender.login} ${actionMessage} in ${repository.full_name}`;
}

export async function sendPush(subscribers, body, sound = 'default') {
  await subscribers
    .map(to => ({ to, body, sound }))
    .forEach(async (message) => {
      if (Expo.isExpoPushToken(message.to)) {
        try {
          await expo.sendPushNotificationsAsync(message);
        } catch (err) {
          console.log(err);
        }
      }
    });
}

export async function sendSms(subscribers, body) {
  await subscribers.forEach(to => twilio.messages.create({ body, to, from }));
}

export async function processPayload(payload, type, trackers) {
  const pushSubscribers = [];
  const smsSubscribers = [];
  trackers.forEach((tracker) => {
    if (tracker.pushToken) {
      pushSubscribers.push(tracker.pushToken);
    }
    if (tracker.phoneNumber) {
      smsSubscribers.push(tracker.phoneNumber);
    }
  });
  const body = buildMessageBody(payload, type);
  await sendPush(pushSubscribers, body);
  await sendSms(smsSubscribers, body);
}
