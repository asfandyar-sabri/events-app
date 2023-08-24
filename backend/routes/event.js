const express = require('express');
const Event = require('../models/Event'); // Assuming you have a model for events
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

// Route to create a new event
router.post('/create', async (req, res) => {
    try {
        const { title, date, time, location, description, priority, members } = req.body;
    
        // Create a new event using the Event model
        const newEvent = new Event({
            title,
            date,
            time: req.body.date,
            location,
            description,
            priority,
            members,
        });
  
      // Save the event to the database
        const savedEvent = await newEvent.save();
    
        res.status(201).json(savedEvent);
    } catch (error) {
        console.log("Error is: ", error)
        res.status(500).json({ message: 'An error occurred while creating the event.' });
    }
});

// Route to fetch all events
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching events.' });
    }
});


router.get('/upcoming', async (req, res) => {
    try {
        const currentTime = new Date();
        const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60 * 1000);
        // console.log("Current time is: ", currentTime);
        // console.log("Ten minutes later: ", tenMinutesLater);

        const upcomingEvents = await Event.find({
            time: {
                $gte: currentTime,
                $lte: tenMinutesLater,
            },
        });

        // console.log("Upcoming events are: ", upcomingEvents);

        res.status(200).json(upcomingEvents);
    } catch (error) {
        console.error('Error fetching upcoming events:', error); // Log the actual error object
        res.status(500).json({ message: 'An error occurred while fetching upcoming event.' });
    }
});

// Route to fetch a specific event by ID
router.get('/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the event.' });
    }
});




// Route to update an event by ID
router.put('/:eventId', async (req, res) => {
    try {
        const { title, date, time, location, description, priority, members } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            {
                title,
                date,
                time,
                location,
                description,
                priority,
                members,
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the event.' });
    }
});

// Route to delete an event by ID
router.delete('/:eventId', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the event.' });
    }
});


module.exports = router;