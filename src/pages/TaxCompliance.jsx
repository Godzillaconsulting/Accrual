import React from 'react';
import Strategy from '../components/Strategy';
import Compliance from '../components/Compliance';

const TaxCompliance = () => {
    return (
        <div className="pt-20"> {/* Add padding for sticky navbar */}
            <Strategy />
            <Compliance />
        </div>
    );
};

export default TaxCompliance;
