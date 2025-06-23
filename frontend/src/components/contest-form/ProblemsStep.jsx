import { useFieldArray } from 'react-hook-form';
import ProblemForm from './ProblemForm';
import FormSection from './FormSection';

const ProblemsStep = ({ control, register, errors, setValue, getValues, watch }) => {
    const { fields: problemFields, append: appendProblem } = useFieldArray({
        control,
        name: "problems"
    });

    return (
        <div>
            <FormSection title="Contest Problems">
                <div className="space-y-6">
                    {problemFields.map((field, index) => (
                        <ProblemForm
                            key={field.id}
                            nestIndex={index}
                            control={control}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            getValues={getValues}
                            watch={watch}
                        />
                    ))}
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => appendProblem(JSON.parse(JSON.stringify(DEFAULT_PROBLEM_VALUES)))}
                        className="btn btn-primary w-full"
                    >
                        Add Another Problem
                    </button>
                    {errors.problems && typeof errors.problems.message === 'string' && (
                        <div className="text-error text-center mt-4">{errors.problems.message}</div>
                    )}
                </div>
            </FormSection>
        </div>
    );
};

export default ProblemsStep;