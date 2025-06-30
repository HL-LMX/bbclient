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
                <h3 className="card-title home-title">Version 1.3</h3>

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
                                            1. Order Breakfast
                                        </li>
                                        <li className="home-list-item">
                                            2. Check the lunch menu
                                        </li>
                                        <li className="home-list-item">
                                            3. Book your visit to lunch
                                        </li>
                                        <li className="home-list-item">
                                            4. Rate the food
                                        </li>
                                        <li className="home-list-item">
                                            5.Provide Feedback
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
                        Ready to get started? Click on the “Lunch” button in the top left corner.
                    </h4>
                </div>
            </div>

            
        </div>
    );
};
