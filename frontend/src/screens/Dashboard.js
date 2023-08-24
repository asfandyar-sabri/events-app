import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [members, setMembers] = useState('');
    const [event, setEvent] = useState([]);
    // const [editing, setEditing] = useState(null);

    const handleCreateEvent = async () => {
        try {
            const dateTime = new Date(`${date}T${time}`);
            // Construct the request body
            const eventData = {
                title,
                date: dateTime,
                time,
                location,
                description,
                priority,
                members,
            };

            // Get the user's authentication token from local storage
            const authToken = localStorage.getItem('authToken');
            console.log("Auth token is: ", authToken);

            const response = await fetch('http://localhost:4000/event/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken,
                },
                body: JSON.stringify(eventData),
            });

            const data = await response.json();

            // Handle success or error response from the backend
            if (response.ok) {
                console.log('Event created successfully:', data);
                // Clear the form fields or perform any other action
            } else {
                console.error('Error creating event:', data.message);
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
        }
    };

    const getAllEvents = async () => {
        try {
            const response = await axios.get('http://localhost:4000/event/all', {
                headers: {
                    'x-auth-token': localStorage.getItem('authToken'),
                },
            });

            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchUpcomingEvents = async () => {
        try {
            const response = await fetch('http://localhost:4000/event/upcoming');
            const upcomingEvents = await response.json();
            console.log(upcomingEvents);
            // Process upcoming events and trigger notifications
        } catch (error) {
            console.error('Error fetching upcoming events:', error.message);
        }
    };

    // Call fetchUpcomingEvents initially and then at regular intervals
    fetchUpcomingEvents();
    setInterval(fetchUpcomingEvents, 60 * 1000); // Every minute


    const handleDelete = async (eventId) => {
        try {
            const token = localStorage.getItem('authToken');
        
            if (!token) {
                console.error('No authentication token found.');
                return;
            }
        
            await axios.delete(`http://localhost:4000/event/${eventId}`, {
                headers: {
                    'x-auth-token': token,
                },
            });
        
            // Update the events array to remove the deleted event
            const updatedEvents = event.filter(event => event._id !== eventId);
            setEvent(updatedEvents);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                const response = await fetch('http://localhost:4000/event/upcoming');
                const upcomingEventsData = await response.json();
                console.log(upcomingEventsData);
                setUpcomingEvents(upcomingEventsData);
            } catch (error) {
                console.error('Error fetching upcoming events:', error.message);
            }
        };

        // Fetch upcoming events initially
        fetchUpcomingEvents();

        // Fetch upcoming events at regular intervals
        const intervalId = setInterval(fetchUpcomingEvents, 60 * 1000); // Every minute

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <div>
            <h2>Dashboard Page</h2>
            <div>
                <h3>Create Event</h3>
                <form onSubmit={handleCreateEvent}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Members"
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        
                    </div>
                    {/* Add dropdown for members */}
                    {/* Add a submit button */}
                    <div>
                        <button type="submit">Create Event</button>
                    </div>
                </form>
               <hr />
            </div>    

            <div>
                <h2>Upcoming Events in 10 Minutes</h2>

                {upcomingEvents.length === 0 ? (
                    <p>No upcoming events in 10 minutes time span</p>
                ) : (
                <ul>
                    {upcomingEvents.map((event, index) => (
                        <li key={index}>
                            <h3>Title:{event.title}<br /></h3> 
                            <p>Date: {event.date}<br /></p>
                            <p>Time: {event.time}<br /></p>
                            <p>Location: {event.location}<br /></p>
                            <p>Description: {event.description}<br /></p>
                            <p>Priority: {event.priority}<br /></p>
                            <p>Members: {event.members.join(', ')}</p>
                        </li>
                    ))}
                </ul>
                )}
                <hr />
            </div>

            <div>
                <h2>Get All Events</h2>
                <button onClick={getAllEvents}>Get Events</button>
                <div>
                    <hr />
                    {event.map((eventItem) => (
                        <div key={eventItem._id}>
                            <div>
                                <h3>{eventItem.title}</h3>
                                <p>Date: {new Date(eventItem.date).toLocaleDateString()}</p>
                                <p>Time: {eventItem.time}</p>
                                <p>Location: {eventItem.location}</p>
                                <p>Description: {eventItem.description}</p>
                                <p>Priority: {eventItem.priority}</p>
                                <p>Members: {eventItem.members}</p>
                                <button onClick={() => handleDelete(eventItem._id)}>Delete Event</button>
                                <hr />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>  
    );
};

export default Dashboard;
