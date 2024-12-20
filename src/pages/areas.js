import React, { useEffect, useState } from 'react';

const Areas = ({ result }) => {
    const [areaInfo, setAreaInfo] = useState({ county: '', state: '', classOne: '', classTwo: '', timeZone: '' });
    
    useEffect(() => {
        // Update area information when the result is available
        if (result) {
            setAreaInfo({
                county: result.features[0]?.properties?.name || null,
                state: result.features[0]?.properties?.state || null,
                classOne: result.features[1]?.properties?.name || null,
                classTwo: result.features[2]?.properties?.name || null,
                timeZone: result.features[0]?.properties?.timeZone?.[0] || null,
            });
        }
    }, [result]);

    return (
        <div className="area-container">
            <ol className="area-list main-element">
                <strong className="main-element">
                    <li className="main-element">{`${areaInfo.state}, ${areaInfo.county}`}</li>
                    <li className="main-element">{areaInfo.timeZone} Time Zone</li>
                    <li className="main-element">Area Class: {areaInfo.classOne}</li>
                    <li className="main-element">Area Class: {areaInfo.classTwo}</li>
                </strong>
            </ol>
            <p className="main-element">If there is no specific classification, the classes will be marked as the county name by default</p>
        </div>
    );
};

export default Areas;