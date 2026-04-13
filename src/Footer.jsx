import React from 'react'
import './App.css'

const Footer = () => {
    // Get today's date
    const today = new Date();
    // Format date as "dd mmm yyyy"
    const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short", // short month name (e.g., Jan, Feb, Mar)
        year: "numeric",
    });
    return (
    <div className='footer-wrapper'>
        <img src="./logo.svg" alt="FGA logo" />
        <h4 className='footer-date'>{formattedDate}</h4>
    </div>
    )
}

export default Footer
