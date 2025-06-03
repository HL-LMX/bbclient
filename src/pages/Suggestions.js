// File: src/pages/Suggestions.js
import React from 'react';
import './Suggestions.css';

/**
 * Suggestions Component: Displays a title and embeds a Microsoft Form centered on the page.
 */
export const Suggestions = () => {
	return (
		<div className="container">
		<div className="row justify-content-center">
			<h3 className="suggestions-title">Suggestions</h3>
		</div>

		<div className="row justify-content-center">
			<div className="col-md-8 form-container">
			<iframe
				src="https://forms.office.com/Pages/ResponsePage.aspx?id=oVHjnJutPkC_Oxo-05ACl-XtH2Bud4pDrSRaXwOWGsJURUpRWUNKWDlNMTlKTllMSEJLSjg1TjdDUyQlQCN0PWcu&embed=true"
				title="Suggestions Form"
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
