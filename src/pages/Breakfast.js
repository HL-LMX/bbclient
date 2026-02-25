// File: src/pages/Breakfast.js
import React from 'react';
import './Breakfast.css';

/**
 * Feedback Component: Displays a title and embeds a Microsoft Form centered on the page.
 */
export const Breakfast = () => {
	return (
		<div className="container">
		<div className="row justify-content-center">
			<h3 className="breakfast-title">Breakfast</h3>
		</div>

		<div className="row justify-content-center">
			<div className="col-md-8 instructions">
				<p>
					INSTRUCTIONS
				</p>
				<p>
					1. Complete the survey.
				</p>
				<p>
					2. The cafeteria team will message you via Teams as "Eduardo Vera" (the chef) when your food is ready for pickup.
				</p>
				<p>
					3. Orders generated via site will be paid on pick up.
				</p>
			</div>
			<div className="col-md-8 instructions">
				<p>
					REMEMBER
				</p>
				<p>
					- One dish or drink per submission
				</p>
				<p>
					- Breakfast service ends at 11am.
				</p>
				
			</div>
			<div className="col-md-8 form-container">
			<iframe
				src="https://forms.office.com/Pages/ResponsePage.aspx?id=oVHjnJutPkC_Oxo-05ACl2qpkTy0ixVCgH8NMdW-GBhUODJCU1JESUtMMEZQQ0Q4TkdVNjMxUjg2Sy4u&embed=true"
				title="Breakfast Ordering Form"
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
