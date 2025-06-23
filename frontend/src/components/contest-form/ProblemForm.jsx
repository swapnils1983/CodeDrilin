import { useFieldArray, useWatch } from 'react-hook-form';
import FormSection from './FormSection';
import { inputClass, textareaClass, selectClass, errorTextClass } from './formStyles';
import TestCasesSection from './TestCasesSection';
import CodeSection from './CodeSection';
import TagsSection from './TagsSection';

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

const ProblemForm = ({ nestIndex, control, register, errors, setValue, getValues, watch }) => {
    const { fields: visibleTestCasesFields, append: appendVisibleTestCase, remove: removeVisibleTestCase } = useFieldArray({
        control,
        name: `problems.${nestIndex}.visibleTestCases`
    });

    const { fields: hiddenTestCasesFields, append: appendHiddenTestCase, remove: removeHiddenTestCase } = useFieldArray({
        control,
        name: `problems.${nestIndex}.hiddenTestCases`
    });

    const { fields: startCodeFields, append: appendStartCode, remove: removeStartCode } = useFieldArray({
        control,
        name: `problems.${nestIndex}.startCode`
    });

    const { fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution } = useFieldArray({
        control,
        name: `problems.${nestIndex}.referenceSolution`
    });

    const problemTitle = useWatch({ control, name: `problems.${nestIndex}.title` });
    const problemErrors = errors.problems?.[nestIndex];

    const handleRemoveProblem = () => {
        const currentProblems = getValues("problems");
        if (currentProblems.length > 1) {
            const newProblems = currentProblems.filter((_, i) => i !== nestIndex);
            setValue("problems", newProblems, { shouldValidate: true });
        }
    };

    return (
        <div className="card bg-gray-800 border border-gray-700 mb-6">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-lg">
                        Problem {nestIndex + 1}: {problemTitle || "(Untitled)"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleRemoveProblem}
                        className="btn btn-sm btn-error"
                    >
                        Remove Problem
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-300">Title</span>
                        </label>
                        <input
                            type="text"
                            {...register(`problems.${nestIndex}.title`)}
                            className={inputClass(problemErrors?.title)}
                            placeholder="Problem title"
                        />
                        {problemErrors?.title && <span className={errorTextClass}>{problemErrors.title.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-300">Description</span>
                        </label>
                        <textarea
                            {...register(`problems.${nestIndex}.description`)}
                            className={textareaClass(problemErrors?.description)}
                            placeholder="Detailed problem description"
                        />
                        {problemErrors?.description && <span className={errorTextClass}>{problemErrors.description.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-300">Difficulty</span>
                        </label>
                        <select
                            {...register(`problems.${nestIndex}.difficulty`)}
                            className={selectClass(problemErrors?.difficulty)}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        {problemErrors?.difficulty && <span className={errorTextClass}>{problemErrors.difficulty.message}</span>}
                    </div>

                    <TagsSection
                        nestIndex={nestIndex}
                        register={register}
                        errors={problemErrors}
                        setValue={setValue}
                        getValues={getValues}
                        watch={watch}
                    />

                    <TestCasesSection
                        title="Visible Test Cases"
                        fields={visibleTestCasesFields}
                        register={register}
                        errors={problemErrors?.visibleTestCases}
                        onAdd={() => appendVisibleTestCase({ input: "", output: "", explanation: "" })}
                        onRemove={removeVisibleTestCase}
                        nestIndex={`problems.${nestIndex}`}
                        fieldName="visibleTestCases"
                        showExplanation={true}
                    />

                    <TestCasesSection
                        title="Hidden Test Cases"
                        fields={hiddenTestCasesFields}
                        register={register}
                        errors={problemErrors?.hiddenTestCases}
                        onAdd={() => appendHiddenTestCase({ input: "", output: "" })}
                        onRemove={removeHiddenTestCase}
                        nestIndex={`problems.${nestIndex}`}
                        fieldName="hiddenTestCases"
                        showExplanation={false}
                    />

                    <CodeSection
                        title="Starter Code"
                        fields={startCodeFields}
                        register={register}
                        errors={problemErrors?.startCode}
                        onAdd={() => appendStartCode({ language: "javascript", initialCode: "" })}
                        onRemove={removeStartCode}
                        nestIndex={`problems.${nestIndex}`}
                        fieldName="startCode"
                        codeFieldName="initialCode"
                        languageFieldName="language"
                    />

                    <CodeSection
                        title="Reference Solution"
                        fields={referenceSolutionFields}
                        register={register}
                        errors={problemErrors?.referenceSolution}
                        onAdd={() => appendReferenceSolution({ language: "javascript", completeCode: "" })}
                        onRemove={removeReferenceSolution}
                        nestIndex={`problems.${nestIndex}`}
                        fieldName="referenceSolution"
                        codeFieldName="completeCode"
                        languageFieldName="language"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemForm;