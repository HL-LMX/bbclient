// File: src/pages/Home.js
// Landing page for Booking Bite Mx. Uses Home.css for all styling.

import React from 'react';
import './Home.css';

/**
 * Home Component: Landing page for Booking Bite Mx.
 * Provides introductory information and upcoming features.
 */
export const Home = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                {/* Version title */}
                <h3 className="card-title home-title">Version 1.2</h3>

                <div className="col-md-10 card bg-light">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="b-3">
                                <div className="card-body m-3 text-center">
                                    <p className="card-text home-card-text">
                                        On this site, you can:
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="home-list-item">
                                            1. Check the menu
                                        </li>
                                        <li className="home-list-item">
                                            2. Book your visit
                                        </li>
                                        <li className="home-list-item">
                                            3. Rate the food!
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 home-svg-wrapper">
                            {/* Main SVG illustration */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="svg-icon"
                                width="200"
                                height="200"
                            >
                                <g>
                                    <path
                                        className="svg-orange"
                                        d="M32.681,220.596v201.532c0,4.513,3.658,8.17,8.17,8.17s8.17-3.657,8.17-8.17V220.596H32.681z"
                                    />
                                    <circle
                                        className="svg-orange"
                                        cx="264.17"
                                        cy="256"
                                        r="166.128"
                                    />
                                </g>
                                <g>
                                    <circle
                                        className="svg-lightorange"
                                        cx="264.17"
                                        cy="256"
                                        r="122.553"
                                    />
                                    <path
                                        className="svg-orange"
                                        d="M73.532,81.702c-4.512,0-8.17,3.657-8.17,8.17v68.085h-16.34V89.872c0-4.513-3.658-8.17-8.17-8.17
                                           s-8.17,3.657-8.17,8.17v68.085H16.34V89.872c0-4.513-3.658-8.17-8.17-8.17S0,85.359,0,89.872v98.043
                                           c0,22.526,18.325,40.851,40.851,40.851s40.851-18.325,40.851-40.851V89.872C81.702,85.359,78.044,81.702,73.532,81.702z"
                                    />
                                </g>
                                <path
                                    className="svg-orange"
                                    d="M495.66,231.489v190.638c0,4.513,3.657,8.17,8.17,8.17s8.17-3.657,8.17-8.17V231.489H495.66z"
                                />
                                <path
                                    className="svg-orange"
                                    d="M512,280.511h-49.021V122.553c0-22.526,18.325-40.851,40.851-40.851H512V280.511z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prompt to get started */}
            <div className="row justify-content-center home-prompt">
                <div className="col-md-10">
                    <h4 className="home-prompt-text">
                        Ready to get started? Click on the “Menu Calendar” button in the menu at the top left corner.
                    </h4>
                </div>
            </div>

            {/* Additional features section */}
            <div className="row justify-content-center home-features-section">
                <div className="col-md-10">
                    <div className="card bg-light mb-3 home-features-card">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <p className="card-text home-features-heading">
                                Stay tuned! Additional features may include:
                            </p>
                            <div className="row justify-content-between align-items-stretch">

                                {/* Remote breakfast ordering */}
                                <div className="col home-feature-col">
                                    <div className="card h-100 home-feature-inner-card">
                                        <div className="card-body text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="56"
                                                height="56"
                                                fill="#97076C"
                                                className="bi bi-cart2 m-3 home-feature-icon"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                            </svg>
                                            <p className="card-text home-feature-text">
                                                Remote Breakfast Ordering
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chef suggestions */}
                                <div className="col home-feature-col">
                                    <div className="card h-100 home-feature-inner-card">
                                        <div className="card-body text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="#B51D0C" class="bi bi-pencil-square m-3" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"></path></svg>
                                            <p className="card-text home-feature-text">
                                                Suggestions for the Chef 
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
