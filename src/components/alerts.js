import { useEffect, useState } from 'react';

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
                <div className="alerts-container m-3">
                    <div className="alerts-titles">
                        <h2 className="p-1">Tornado Alerts</h2>
                    </div>

                    <div className="alerts-info">
                        <ul className="alerts-list">
                            {tornadoAlerts.map((alert, index) => (
                                <li className="p-3 m-3 border" key={index}>
                                    <h3>{alert.headline}</h3>
                                    <p>{alert.description}</p>
                                    <p>Severity: {alert.severity}</p>
                                    <p>Status: {alert.status}</p>
                                    <p>Certainty: {alert.certainty}</p>
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