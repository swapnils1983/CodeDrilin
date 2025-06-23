import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { contestSchema } from '../../schemas/contestSchema';
import Stepper from './Stepper';
import ContestInfoStep from './ContestInfoStep';
import ProblemsStep from './ProblemsStep';
import { z } from 'zod';

const DEFAULT_PROBLEM_VALUES = {
    title: "",
    description: "",
    difficulty: "medium",
    tags: [],
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    startCode: [{ language: "javascript", initialCode: "" }],
    referenceSolution: [{ language: "javascript", completeCode: "" }],
};

const testCaseSchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().min(1, "Explanation is required"),
});

const hiddenTestCaseSchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
});

const codeSchema = z.object({
    language: z.string().min(1, "Language is required"),
    initialCode: z.string().min(1, "Initial code is required"),
});

const solutionSchema = z.object({
    language: z.string().min(1, "Language is required"),
    completeCode: z.string().min(1, "Complete code is required"),
});
const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(['easy', 'medium', 'hard'], { required_error: "Difficulty is required" }),
    tags: z.array(z.string().min(1, "Tag cannot be empty")).min(1, "At least one tag is required"),
    visibleTestCases: z.array(testCaseSchema).min(1, "At least one visible test case is required"),
    hiddenTestCases: z.array(hiddenTestCaseSchema).min(1, "At least one hidden test case is required"),
    startCode: z.array(codeSchema).min(1, "At least one start code snippet is required"),
    referenceSolution: z.array(solutionSchema).min(1, "At least one reference solution is required"),
});
const contestSchema = z.object({
    title: z.string().min(1, "Contest title is required"),
    description: z.string().optional(),
    startTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Start date is required and must be valid" }),
    durationValue: z.coerce.number().positive({ message: "Duration must be a positive number" }),
    durationUnit: z.enum(['minutes', 'hours', 'days'], { required_error: "Please select a unit" }),
    problems: z.array(problemSchema).min(1, "At least one problem is required for the contest"),
});

const ContestForm = ({ onSubmit, steps, currentStep, setCurrentStep }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        watch,
        trigger,
    } = useForm({
        resolver: zodResolver(contestSchema),
        defaultValues: {
            title: "",
            description: "",
            startTime: "",
            durationValue: 120,
            durationUnit: 'minutes',
            problems: [JSON.parse(JSON.stringify(DEFAULT_PROBLEM_VALUES))],
        },
        mode: 'onTouched'
    });

    const handleNextStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;
        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Contest Details */}
            <div className={currentStep === 0 ? 'block' : 'hidden'}>
                <ContestInfoStep register={register} errors={errors} />
            </div>

            {/* Step 2: Add Problems */}
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <ProblemsStep
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    getValues={getValues}
                    watch={watch}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-700">
                <div>
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="btn btn-ghost"
                        >
                            Previous
                        </button>
                    )}
                </div>
                <div>
                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="btn btn-primary"
                        >
                            Next: Add Problems
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Contest'}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default ContestForm;