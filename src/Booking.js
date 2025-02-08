import React, { Component } from 'react';
import { variables as bookingVariables } from './Variables';
import Day from './components/Day';
import './Booking.css';

// Define the PopupMessage component
const PopupMessage = ({ message }) => {
    return (
        <div className="popup">
            <span className="popup-message">{message}</span>
        </div>
    );
};

// Function to calculate available dishes by day and type
const calculateAvailableDishesByDayAndType = (currentDate, availableDishes, daysOfWeek) => {
    const availableDishesByDayAndType = {};

    daysOfWeek.forEach(day => {
        availableDishesByDayAndType[day] = availableDishes.filter(dish => {
            const dishDate = new Date(dish.date + 'T00:00:00Z');
            const options = { weekday: 'long', timeZone: 'UTC' };
            const dayName = dishDate.toLocaleDateString('en-US', options);
            return dayName === day;
        }).reduce((acc, dish) => {
            const type = dish.dish.dish_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(dish);
            return acc;
        }, {});
    });

    return availableDishesByDayAndType;
};

export class Booking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            availableDishes: [],
            currentDate: new Date(),
            unsavedChanges: [],
            savedDays: [],
            changesSaved: false, // Track whether changes are saved
        };
        this.loadSavedDays();
    }

    componentDidMount() {
        // Set default view to two weeks ahead
        const dateToDisplay = new Date();
        dateToDisplay.setDate(dateToDisplay.getDate() + 0); //Number of days ahead to display for user
        this.setState({ currentDate: dateToDisplay }, () => {
            this.refreshAvailableDishes();
            this.loadSavedDays();
        });
    }

    refreshAvailableDishes() {
        // We are no longer using ISO week numbers. Instead, we’ll pass the actual date to the backend.
        const selectedDate = this.state.currentDate.toISOString().split('T')[0];

        // Note the endpoint changed to `booking/week?date=...`
        fetch(bookingVariables.API_URL + 'booking/week?date=' + selectedDate)
            .then(response => response.json())
            .then(data => {
                this.setState({ availableDishes: data.dishes });
            })
            .catch(error => console.error('Error:', error));
    }

    handleDateChange = (days) => {
        const newDate = new Date(this.state.currentDate);
        newDate.setDate(newDate.getDate() + days);
        this.setState({ currentDate: newDate }, this.refreshAvailableDishes);
    };

    handleSave = () => {
        const { unsavedChanges, savedDays } = this.state;
        // Convert selected dates to ISO string format
        const selectedDates = unsavedChanges.map(date => date.toISOString().split('T')[0]);

        // Find new dates to add to attendance and dates to remove from attendance
        const newDatesToAdd = selectedDates.filter(date => !savedDays.includes(date));
        const datesToRemove = savedDays.filter(date => !unsavedChanges.some(day => day.toISOString().split('T')[0] === date));

        // Check if there are any changes to save
        if (newDatesToAdd.length === 0 && datesToRemove.length === 0) {
            console.log("No changes to save.");
            return;
        }

        // Add new dates to attendance
        if (newDatesToAdd.length > 0) {
            this.addToAttendance(newDatesToAdd);
            this.setState({ changesSaved: true });
        }

        // Remove dates from attendance
        if (datesToRemove.length > 0) {
            this.removeFromAttendance(datesToRemove);
            this.setState({ changesSaved: true });
        }

        // Update savedDays with the new saved dates
        const newSavedDays = [...unsavedChanges.map(date => date.toISOString().split('T')[0])];
        this.setState({ savedDays: newSavedDays });

        // Save updated savedDays to local storage
        localStorage.setItem('savedDays', JSON.stringify(newSavedDays));

        // Hide the popup message after 3 seconds
        setTimeout(() => {
            this.setState({ changesSaved: false });
        }, 3000);
    };

    addToAttendance = (dates) => {
        fetch(bookingVariables.API_URL + 'booking/add-attendance/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dates),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add attendance');
                }
                return response.json();
            })
            .then(data => {
                console.log('Attendance added successfully:', data);
            })
            .catch(error => {
                console.error('Error adding attendance:', error);
            });
    };

    removeFromAttendance = (dates) => {
        fetch(bookingVariables.API_URL + 'booking/remove-attendance/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dates),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove attendance');
                }
                return response.json();
            })
            .then(data => {
                console.log('Attendance removed successfully:', data);
            })
            .catch(error => {
                console.error('Error removing attendance:', error);
            });
    };

    toggleDaySelection = (day) => {
        const { unsavedChanges } = this.state;
        const selectedDateString = new Date(day).toISOString().split('T')[0];
        const index = unsavedChanges.findIndex(selectedDay => selectedDay.toISOString().split('T')[0] === selectedDateString);
        if (index === -1) {
            this.setState(prevState => ({ unsavedChanges: [...prevState.unsavedChanges, new Date(day)] }));
        } else {
            this.setState(prevState => ({
                unsavedChanges: prevState.unsavedChanges.filter((_, idx) => idx !== index)
            }));
        }
    };

    // We no longer need getISOWeekNumber, so it’s removed.

    loadSavedDays() {
        const savedDays = JSON.parse(localStorage.getItem('savedDays')) || [];
        this.setState(prevState => ({
            savedDays,
            unsavedChanges: savedDays.map(date => new Date(date)),
        }));
    }

    render() {
        const { unsavedChanges, availableDishes, currentDate, changesSaved } = this.state;
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // Calculate Monday of the week for currentDate
        const firstDayOfWeek = new Date(currentDate);
        // getDay(): Sunday=0, Monday=1, ..., so we do minus getDay() + 1 for Monday
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);

        // Friday is 4 days from Monday
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + daysOfWeek.length - 1);

        const options = { day: '2-digit', month: 'short' };
        const weekRange = `${firstDayOfWeek.toLocaleDateString('en-GB', options)} - ${lastDayOfWeek.toLocaleDateString('en-GB', options)}`;

        const availableDishesByDayAndType = calculateAvailableDishesByDayAndType(
            currentDate,
            availableDishes,
            daysOfWeek
        );

        const popup = changesSaved ? <PopupMessage message="Changes saved" /> : null;

        return (
            <div>
                <h3 className="text-center" style={{ fontSize: '32px', margin: '1rem 0'}}>Visit Booking</h3>
                <div className="text-center mb-3" style={{padding:'1rem 0'}}>
                    <button onClick={() => this.handleDateChange(-7)} className="arrow-button">
                        &lt; Previous Week
                    </button>
                    <label style={{ margin: '0 10px', width: '200px', display: 'inline-block', fontSize: '1.5rem'}}>
                        {weekRange}
                    </label>
                    <button onClick={() => this.handleDateChange(7)} className="arrow-button">
                        Next Week &gt;
                    </button>
                </div>

                <div className="text-center mb-3">
                    {/* <button onClick={this.handleSave} className="save-button">Save Changes</button>
                    {popup} */}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '20px' }}>
                    {daysOfWeek.map((day, index) => {
                        const dayDate = new Date(firstDayOfWeek);
                        dayDate.setDate(dayDate.getDate() + index);

                        // For disabling "past" or "within next 7 days" logic, adapt as needed
                        const oneWeekFromNow = new Date();
                        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
                        const isPastDate = dayDate < oneWeekFromNow;

                        return (
                            <Day
                                key={index}
                                date={dayDate}
                                dayName={day}
                                availableDishesByType={availableDishesByDayAndType[day] || {}}
                                isSelected={unsavedChanges.some(selectedDay =>
                                    selectedDay.toISOString().split('T')[0] === dayDate.toISOString().split('T')[0]
                                )}
                                isPastDate={isPastDate}
                                onClick={this.toggleDaySelection}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Booking;
