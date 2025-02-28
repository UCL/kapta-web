import React from 'react';
import './styles/App.css';

export default function TempMobileApp() {
    return (
        <div className="temp-mobile-app">
            {/* <h2>The mobile version of this site is currently under development.</h2> */}
            <p>The mobile version of this site is currently under development. Please visit on a computer to explore the Kapta platform.</p>

            <h2>Now you can start creating WhatsApp Maps with Kapta Assistant.</h2>

            <a href="https://wa.me/447473522912?text=Hi%20Kapta%20Assistant%2C%20please%20guide%20me%20through%20the%20process%20of%20creating%20WhatsApp%20Maps" target="_blank">
                <button className="temp-mobile-app-button">Start</button>
            </a>

            <a href="https://youtu.be/1XQMf5Gl4fo" target="_blank">
                <button className="temp-mobile-app-button white-background">Watch video</button>
            </a>
        </div>
    );
}
