import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schemas
const testCaseSchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().optional(),
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

// Constants
const LANGUAGE_OPTIONS = [
    { value: "c++", label: "C++" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" }
];

// Reusable Components
const FormSection = ({ title, children }) => (
    <div className="py-4">
        <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Stepper = ({ steps, currentStep }) => (
    <div className="w-full mb-10">
        <ul className="steps steps-horizontal w-full">
            {steps.map((step, index) => (
                <li
                    key={step.id}
                    className={`step ${index <= currentStep ? 'step-primary' : ''} ${index === currentStep ? 'font-bold' : ''}`}
                    data-content={index < currentStep ? "✓" : index + 1}
                >
                    <span className="text-sm sm:text-base">{step.name}</span>
                </li>
            ))}
        </ul>
        <div className="text-center text-sm text-gray-400 mt-1">
            Step {currentStep + 1} of {steps.length}
        </div>
    </div>
);

const CreateProblemPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        { id: 'step1', name: 'Basic Info', fields: ['title', 'description', 'difficulty', 'tags'] },
        { id: 'step2', name: 'Test Cases', fields: ['visibleTestCases', 'hiddenTestCases'] },
        { id: 'step3', name: 'Code Snippets', fields: ['startCode', 'referenceSolution'] },
    ];

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        setValue,
        getValues,
        watch,
        trigger,
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "medium",
            tags: [],
            visibleTestCases: [{ input: "", output: "", explanation: "" }],
            hiddenTestCases: [{ input: "", output: "" }],
            startCode: [{ language: "javascript", initialCode: "" }],
            referenceSolution: [{ language: "javascript", completeCode: "" }],
        },
        mode: 'onChange',
    });

    const { fields: visibleTestCasesFields, append: appendVisibleTestCase, remove: removeVisibleTestCase } = useFieldArray({ control, name: "visibleTestCases" });
    const { fields: hiddenTestCasesFields, append: appendHiddenTestCase, remove: removeHiddenTestCase } = useFieldArray({ control, name: "hiddenTestCases" });
    const { fields: startCodeFields, append: appendStartCode, remove: removeStartCode } = useFieldArray({ control, name: "startCode" });
    const { fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution } = useFieldArray({ control, name: "referenceSolution" });

    const [currentTag, setCurrentTag] = useState("");
    const watchedTags = watch("tags");
    const hiddenTestCasesFileRef = useRef(null);

    const handleNextStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;
        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
            // Scroll to top on step change
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddTag = () => {
        if (currentTag.trim() !== "") {
            const currentTags = getValues("tags") || [];
            if (!currentTags.includes(currentTag.trim())) {
                setValue("tags", [...currentTags, currentTag.trim()], { shouldValidate: true });
            }
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const currentTags = getValues("tags") || [];
        setValue("tags", currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
    };

    const handleHiddenTestCasesFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (Array.isArray(json) && json.every(item => typeof item.input === 'string' && typeof item.output === 'string')) {
                    setValue("hiddenTestCases", json, { shouldValidate: true, shouldDirty: true });
                    alert(`${json.length} hidden test cases loaded successfully.`);
                } else {
                    alert("Invalid JSON format. Expected an array of objects with 'input' and 'output' properties.");
                }
            } catch (error) {
                alert("Error parsing JSON file: " + error.message);
            } finally {
                if (hiddenTestCasesFileRef.current) hiddenTestCasesFileRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const onSubmit = async (data) => {
        const isValid = await trigger();

        if (isValid) {
            console.log("Problem Data Submitted:", JSON.stringify(data, null, 2));
            alert("Problem created successfully! Check the console for the JSON output.");
        }
    };

    // Helper classes
    const inputClass = (hasError) => `input input-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const textareaClass = (hasError) => `textarea textarea-bordered bg-gray-700 border-gray-600 w-full h-24 focus:ring-2 focus:ring-green-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const selectClass = (hasError) => `select select-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const errorTextClass = "label-text-alt text-red-500 mt-1";

    // Data for dynamic sections
    const testCaseSections = [
        { name: "Visible Test Cases", fields: visibleTestCasesFields, append: appendVisibleTestCase, remove: removeVisibleTestCase, error: errors.visibleTestCases, defaultItem: { input: "", output: "", explanation: "" }, itemFields: ["input", "output", "explanation"], arrayName: "visibleTestCases" },
        { name: "Hidden Test Cases", fields: hiddenTestCasesFields, append: appendHiddenTestCase, remove: removeHiddenTestCase, error: errors.hiddenTestCases, defaultItem: { input: "", output: "" }, itemFields: ["input", "output"], arrayName: "hiddenTestCases", allowUpload: true }
    ];
    const codeSections = [
        { name: "Start Code Snippets", fields: startCodeFields, append: appendStartCode, remove: removeStartCode, error: errors.startCode, defaultItem: { language: "javascript", initialCode: "" }, codeField: "initialCode", arrayName: "startCode" },
        { name: "Reference Solutions", fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution, error: errors.referenceSolution, defaultItem: { language: "javascript", completeCode: "" }, codeField: "completeCode", arrayName: "referenceSolution" }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                        <h1 className="text-xl font-mono font-bold text-green-400 flex items-center">
                            <span className="mr-2">{'</>'}</span> Create New Problem
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8">
                        <Stepper steps={steps} currentStep={currentStep} />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Step 1: Basic Information & Tags */}
                            <div className={currentStep === 0 ? 'block' : 'hidden'}>
                                <FormSection title="Basic Information">
                                    <div className="form-control">
                                        <label htmlFor="title" className="label"><span className="label-text text-gray-300">Title</span></label>
                                        <input type="text" id="title" {...register("title")} className={inputClass(errors.title)} placeholder="e.g., Longest Substring" />
                                        {errors.title && <span className={errorTextClass}>{errors.title.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="description" className="label"><span className="label-text text-gray-300">Description</span></label>
                                        <textarea id="description" {...register("description")} className={textareaClass(errors.description)} placeholder="Problem description... Supports markdown." />
                                        {errors.description && <span className={errorTextClass}>{errors.description.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="difficulty" className="label"><span className="label-text text-gray-300">Difficulty</span></label>
                                        <select id="difficulty" {...register("difficulty")} className={selectClass(errors.difficulty)}>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        {errors.difficulty && <span className={errorTextClass}>{errors.difficulty.message}</span>}
                                    </div>
                                </FormSection>
                                <FormSection title="Tags">
                                    <div className="form-control">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={currentTag}
                                                onChange={(e) => setCurrentTag(e.target.value)}
                                                className={inputClass(false)}
                                                placeholder="e.g., Array, Sliding Window"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                            />
                                            <button type="button" onClick={handleAddTag} className="btn btn-outline btn-info">Add</button>
                                        </div>
                                    </div>
                                    {watchedTags?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {watchedTags.map((tag, i) => (
                                                <div key={i} className="badge badge-lg bg-gray-600 p-3">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="ml-2 text-red-400 text-xs hover:text-red-300"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.tags && <span className={errorTextClass}>{errors.tags.message || (errors.tags.root && errors.tags.root.message)}</span>}
                                </FormSection>
                            </div>

                            {/* Step 2: Test Cases */}
                            <div className={currentStep === 1 ? 'block' : 'hidden'}>
                                {testCaseSections.map(section => (
                                    <FormSection title={section.name} key={section.name}>
                                        {section.fields.map((field, index) => (
                                            <div key={field.id} className="p-4 border border-gray-700 rounded-md mb-4 space-y-3 bg-gray-750 shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-md font-medium text-gray-200">Test Case {index + 1}</h4>
                                                    {section.fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => section.remove(index)}
                                                            className="btn btn-xs btn-error btn-outline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                {section.itemFields.map(itemField => (
                                                    <div className="form-control" key={itemField}>
                                                        <label htmlFor={`${section.arrayName}.${index}.${itemField}`} className="label capitalize">
                                                            <span className="label-text text-gray-400">{itemField}</span>
                                                        </label>
                                                        <textarea
                                                            id={`${section.arrayName}.${index}.${itemField}`}
                                                            {...register(`${section.arrayName}.${index}.${itemField}`)}
                                                            className={textareaClass(section.error?.[index]?.[itemField])}
                                                            placeholder={`Enter ${itemField}`}
                                                        />
                                                        {section.error?.[index]?.[itemField] && (
                                                            <span className={errorTextClass}>{section.error[index][itemField].message}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <div className="flex gap-2 items-center flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => section.append(section.defaultItem)}
                                                className="btn btn-sm btn-outline btn-info"
                                            >
                                                Add {section.name.slice(0, -1)}
                                            </button>
                                            {section.allowUpload && (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept=".json"
                                                        ref={hiddenTestCasesFileRef}
                                                        onChange={handleHiddenTestCasesFileUpload}
                                                        style={{ display: 'none' }}
                                                        id="hiddenTestCasesUpload"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => hiddenTestCasesFileRef.current?.click()}
                                                        className="btn btn-sm btn-outline btn-accent"
                                                    >
                                                        Upload from JSON
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {section.error && typeof section.error.message === 'string' && (
                                            <span className={errorTextClass}>{section.error.message}</span>
                                        )}
                                    </FormSection>
                                ))}
                            </div>

                            {/* Step 3: Code Snippets */}
                            <div className={currentStep === 2 ? 'block' : 'hidden'}>
                                {codeSections.map(section => (
                                    <FormSection title={section.name} key={section.name}>
                                        {section.fields.map((field, index) => (
                                            <div key={field.id} className="p-4 border border-gray-700 rounded-md mb-4 space-y-3 bg-gray-750 shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-md font-medium text-gray-200">
                                                        {section.name.slice(0, -1)} {index + 1}
                                                    </h4>
                                                    {section.fields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => section.remove(index)}
                                                            className="btn btn-xs btn-error btn-outline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label htmlFor={`${section.arrayName}.${index}.language`} className="label">
                                                        <span className="label-text text-gray-400">Language</span>
                                                    </label>
                                                    <select
                                                        id={`${section.arrayName}.${index}.language`}
                                                        {...register(`${section.arrayName}.${index}.language`)}
                                                        className={selectClass(section.error?.[index]?.language)}
                                                    >
                                                        {LANGUAGE_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                    {section.error?.[index]?.language && (
                                                        <span className={errorTextClass}>{section.error[index].language.message}</span>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label htmlFor={`${section.arrayName}.${index}.${section.codeField}`} className="label capitalize">
                                                        <span className="label-text text-gray-400">
                                                            {section.codeField.replace("Code", " Code")}
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        id={`${section.arrayName}.${index}.${section.codeField}`}
                                                        {...register(`${section.arrayName}.${index}.${section.codeField}`)}
                                                        className={`${textareaClass(section.error?.[index]?.[section.codeField])} h-40 font-mono text-sm`}
                                                        placeholder={`Enter ${section.codeField.replace("Code", " code")}`}
                                                    />
                                                    {section.error?.[index]?.[section.codeField] && (
                                                        <span className={errorTextClass}>{section.error[index][section.codeField].message}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => section.append(section.defaultItem)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            Add {section.name.slice(0, -1)}
                                        </button>
                                        {section.error && typeof section.error.message === 'string' && (
                                            <span className={errorTextClass}>{section.error.message}</span>
                                        )}
                                    </FormSection>
                                ))}
                            </div>

                            {/* Stepper Navigation Buttons */}
                            <div className="mt-10 pt-6 border-t border-gray-700 flex justify-between items-center">
                                <div>
                                    {currentStep > 0 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="btn btn-outline btn-secondary"
                                        >
                                            Previous
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {currentStep < steps.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="btn btn-info"
                                        // disabled={!isValid}
                                        >
                                            Next Step
                                        </button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success bg-green-600 hover:bg-green-700 border-none text-white text-lg"
                                        >
                                            Create Problem
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProblemPage;