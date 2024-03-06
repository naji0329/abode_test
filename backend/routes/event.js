const express = require('express');
const router = express.Router();

const Event = require('../model/event');
const auth = require('../middleware/auth');
const { scheduleEvent, removeEvent } = require('../utils/scheduler');

// Create Event
router.post('/create', auth, async (req, res) => {
  try {
    let event = new Event({
      name: req.body.name,
      description: req.body.description,
      datetime: req.body.datetime,
      invitees: req.body.invitees,
      user: req.user.userID
    });

    event = await event.save();

    if(!event) {
      return res.status(404).json({ success: false, message: 'Event cannot be created' });
    }

    scheduleEvent(event);
    res.status(200).json({ success: true, message: 'Event created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
});

// Update Event
router.post('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if(!event) {
      return res.status(404).json({ success: false, message: "Event not found"});
    }

    event = await Event.updateOne({ _id: req.params.id }, req.body);
    if(!event) {
      return res.status(401).json({ success: false, message: "Error occured"});
    }

    scheduleEvent(event);
    res.status(200).json({ success: true, message: "Event updated"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
})

// Delete Event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if(!event) {
      return res.status(404).json({ success: false, message: "Event not found"});
    }

    if(event.user.toString() !== req.user.userID) {
      return res.status(401).json({ success: false, message: "Not authorized to remove this event"});
    }

    removeEvent(event);

    const dat = await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Event removed"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
})

// List Events
router.get('/', auth, async (req, res) => {
  try {
    let events = await Event.find({ user: req.user.userID });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
});

module.exports = router;