const dayjs = require('dayjs');
const schedule = require('node-schedule');
const Event = require('../model/event');
const sgMail = require('@sendgrid/mail');
let dotenv = require('dotenv').config()
sgMail.setApiKey(dotenv.parsed.SENDGRID_API_KEY)

const schedules = {};

// Event handler for notifying invitees
const scheduleHander = async (event) => {
  try {
    console.log(`Event ${event._id} is notified to the invitees!`, event.invitees);
    await Event.updateOne({ _id: event._id }, { notified: true });
    schedules[event._id] = null;

    event.invitees.map(async invitee => {
      const msg = {
        to: invitee,
        from: dotenv.parsed.email, // Use the email address or domain you verified above
        subject: 'Notification for an upcoming event',
        text: `You have an upcoming event ${event.name} at ${event.datetime}`,
        html: `<strong>${event.description}</strong>`,
      };
      //ES8
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      }
    })
  } catch (err) {
    console.error(err);
  }
};

// Schedules or notifies according to time difference by event
const scheduleEvent = (event) => {
  try {
    const eventTime = dayjs(event.datetime);
    const curTime = dayjs();
    const minDiff = curTime.diff(eventTime, 'minute');
    console.log(`Event ${event._id} is ${-minDiff} minute(s) away from now`);

    if(minDiff < 0 && minDiff >= -30 && event.notified === false) {
      scheduleHander(event);
    } else if(minDiff < -30) {
      const eventDate = new Date(event.datetime);
      const scheduleTime = new Date(eventDate - 30 * 60000);
      console.log(`Event ${event._id} is scheduled to send notifications at ${scheduleTime}`);

      if(schedules[event._id]) schedule.cancelJob(schedules[event._id]);
      const job = schedule.scheduleJob(scheduleTime, () => scheduleHander(event));
      schedules[event._id] = job;
    }
  } catch (err) {
    console.error(err);
  }
}

console.log(new Date());

/**
 * Initializes Scheduler
 * Checks through all events
 */ 
const initScheduler = async () => {
  const events = await Event.find({});

  events.forEach(event => scheduleEvent(event));
};

// Remove Event
const removeEvent = async (event) => {
  try {
    schedule.cancelJob(schedules[event._id]);
    schedules[event._id] = null;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  initScheduler,
  removeEvent,
  scheduleEvent,
  scheduleHander
};