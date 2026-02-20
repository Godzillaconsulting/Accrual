import React from 'react';
import Strategy from '../components/Strategy';
import Compliance from '../components/Compliance';
import ContactScheduler from '../components/ContactScheduler';

const TaxCompliance = () => {
    return (
        <div className="pt-20"> {/* Add padding for sticky navbar */}
            <Strategy />
            <Compliance />
            <ContactScheduler />
        </div>
    );
};

export default TaxCompliance;
