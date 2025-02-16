import { useEffect, useState } from 'react';

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
                    <li className="main-element">{areaInfo.timeZone} Time</li>
                    {areaInfo.classOne !== areaInfo.classTwo && (
                        <>
                            <li className="main-element">Class One: {areaInfo.classOne}</li>
                            <li className="main-element">Class Two: {areaInfo.classTwo}</li>
                        </>
                    )}
                </strong>
            </ol>
        </div>
    );
};

export default Areas;