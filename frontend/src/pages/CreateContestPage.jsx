import { useState } from 'react';
import Stepper from '../components/contest-form/Stepper';
import ContestForm from '../components/contest-form/ContestForm';

const CreateContestPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        { id: 'step1', name: 'Contest Details', fields: ['title', 'description', 'startTime', 'durationValue', 'durationUnit'] },
        { id: 'step2', name: 'Add Problems', fields: ['problems'] },
    ];

    const onSubmit = async (data) => {
        // Calculate endTime from duration
        const { startTime, durationValue, durationUnit } = data;
        const startDate = new Date(startTime);

        if (isNaN(startDate.getTime())) {
            alert("Invalid start date provided.");
            return;
        }

        switch (durationUnit) {
            case 'minutes':
                startDate.setMinutes(startDate.getMinutes() + durationValue);
                break;
            case 'hours':
                startDate.setHours(startDate.getHours() + durationValue);
                break;
            case 'days':
                startDate.setDate(startDate.getDate() + durationValue);
                break;
            default:
                break;
        }

        const calculatedEndTime = startDate.toISOString();


        const finalData = {
            ...data,
            endTime: calculatedEndTime,
        };
        delete finalData.durationValue;
        delete finalData.durationUnit;

        console.log("Contest Data Submitted:", JSON.stringify(finalData, null, 2));
        alert("Contest created successfully! (Check console for data)");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Create New Contest</h1>
                    <p className="text-gray-400 mt-2">Fill in the details to create a new coding contest</p>
                </div>

                <div className="card bg-gray-800 shadow-xl">
                    <div className="card-body">
                        <Stepper steps={steps} currentStep={currentStep} />
                        <ContestForm
                            onSubmit={onSubmit}
                            steps={steps}
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateContestPage;