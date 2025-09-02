// File: src/pages/Feedback.js
import React from 'react';
import './Feedback.css';

/**
 * Feedback Component: Displays a title and embeds a Microsoft Form centered on the page.
 */
export const Feedback = () => {
	return (
		<div className="container">
		<div className="row justify-content-center">
			<h3 className="feedback-title">Feedback</h3>
		</div>

		<div className="row justify-content-center">
			<div className="col-md-8 form-container">
			<iframe
				src="https://forms.office.com/Pages/ResponsePage.aspx?id=oVHjnJutPkC_Oxo-05ACl-XtH2Bud4pDrSRaXwOWGsJURUpRWUNKWDlNMTlKTllMSEJLSjg1TjdDUyQlQCN0PWcu&embed=true"
				title="Feedback Form"
				width="100%"
				height="900px"
			>
				Loading…
			</iframe>
			</div>
		</div>
		</div>
	);
};
