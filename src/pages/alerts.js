import React, { useEffect, useState } from 'react';

const Alerts = ({ result }) => {
    const [tornadoAlerts, setTornadoAlerts] = useState([]);

    useEffect(() => {
        // Update tornado alerts when the tornado result is available
        if (result) {
            if (result.alerts?.length > 0) {
                setTornadoAlerts(result.alerts.map(alert => ({
                    certainty: alert?.properties?.certainty || null,
                    headline: alert?.properties?.headline || null,
                    description: alert?.properties?.description || null,
                    severity: alert?.properties?.severity || null,
                    status: alert?.properties?.status || null,
                })));
            } else {
                setTornadoAlerts(null); // No alerts available
            }
        }
    }, [result]);

    return (
        <>
            {tornadoAlerts && (
                <div className="alerts-container">
                    <div className="alerts-titles">
                        <h2 className="main-element">Tornado Alerts</h2>
                        <p className="main-element">Most recent updates start at the top</p>
                    </div>

                    <div className="alerts-info main-element">
                        <ul className="alerts-list">
                            {tornadoAlerts.map((alert, index) => (
                                <li key={index}>
                                    <h3 className="main-element">{alert.headline}</h3>
                                    <p className="main-element">{alert.description}</p>
                                    <p className="main-element">Severity: {alert.severity}</p>
                                    <p className="main-element">Status: {alert.status}</p>
                                    <p className="main-element">Certainty: {alert.certainty}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Alerts;