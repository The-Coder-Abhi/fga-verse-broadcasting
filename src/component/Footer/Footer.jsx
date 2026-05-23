import React from 'react'
import './Footer.css'
import logo from '../../img/logo.svg';

const Footer = () => {
    // Get today's date
    const today = new Date();
    // Format date as "dd mmm yyyy"
    const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return (
    <div className='footer-wrapper'>
    <a href="https://www.youtube.com/@fgamumbai1984/live" target="_blank" rel="noreferrer">
        <img src={logo} alt="FGA logo" />
    </a>
        <h4 className='footer-date'>{formattedDate}</h4>
    </div>
    )
}

export default Footer
