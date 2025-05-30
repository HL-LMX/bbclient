import React from 'react';
import './Booking.css';

const Booking = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            padding: '2rem',
        }}>
            <div>
                <h1 style={{
                    fontSize: '3rem',
                    color: '#333',
                    marginBottom: '1rem',
                }}>
                    Good news!
                </h1>
                <p style={{ fontSize: '1.5rem', color: '#555'}}>
                    We've upgraded and migrated to a new location.
                </p>
                <p style={{ fontSize: '1.5rem', color: '#555', margin: '0 0 3rem'}}>
                    Please visit the new page at the following link:
                </p>
                <a href="http://194.9.161.245/bookingbite/booking" style={{ fontSize: '1.6rem', color: '#007bff', textDecoration: 'none' }}>
                    http://194.9.161.245/bookingbite/booking
                </a>
            </div>
        </div>
    );
};

export default Booking;
