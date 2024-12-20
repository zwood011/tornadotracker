import React from 'react';

const Header = ({ handleSubmit, handleZipCodeChange, zipCode }) => {

    const handleChange = (e) => {
        handleZipCodeChange(e.target.value);
    };

    return (
        <header className="page-header">
            <div className="header-titles">
                <h1 className="main-element">Tracker Baseline</h1>
                <p className="main-element">Enter a ZIP code to fetch area information and tornado alerts</p>
            </div>

            <form onSubmit={handleSubmit} className="main-element form-container">
                <div className="form-items">
                    <label>Zip Code: </label>
                    <input
                        type="text"
                        value={zipCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Fetch Area Info</button>
            </form>
        </header>
    );
};

export default Header;