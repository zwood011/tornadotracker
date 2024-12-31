const Header = ({ handleSubmit, handleZipCode, zipCode }) => {
    const handleChange = (e) => {
        const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
        handleZipCode(sanitizedValue);
    };

    return (
        <header className="page-header">
            <div className="header-titles">
                <h1 className="main-element">Tracker Baseline</h1>
                <p className="main-element">Enter a ZIP code to fetch area information and tornado alerts</p>
            </div>

            <form onSubmit={handleSubmit} className="main-element form-container">
                <div className="form-items">
                    <label className="form-label">Zip Code: </label>
                    <input
                        type="tel"
                        className="form-input"
                        value={zipCode}
                        onChange={handleChange}
                        required />
                </div>
                <button type="submit" className="btn btn-primary form-button">Search</button>
            </form>
        </header>
    );
};

export default Header;