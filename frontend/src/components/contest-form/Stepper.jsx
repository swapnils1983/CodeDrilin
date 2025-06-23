const Stepper = ({ steps, currentStep }) => (
    <ul className="steps w-full mb-10">
        {steps.map((step, index) => (
            <li key={step.id} className={`step ${index <= currentStep ? 'step-primary' : ''}`}>
                <span className="text-sm sm:text-base">{step.name}</span>
            </li>
        ))}
    </ul>
);

export default Stepper;