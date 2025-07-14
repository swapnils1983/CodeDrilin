import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import { useForm, useFieldArray } from 'react-hook-form';

function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axiosInstance.get('/problem/getAllProblem');
                setProblems(res.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const handleEdit = (problem) => {
        setSelectedProblem(problem);
    };

    const handleBackToList = () => {
        setSelectedProblem(null);
        // Refresh the list
        const fetchProblems = async () => {
            const res = await axiosInstance.get('/problem/getAllProblem');
            setProblems(res.data);
        };
        fetchProblems();
    };

    if (selectedProblem) {
        return <EditProblem problem={selectedProblem} onBack={handleBackToList} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Problems
                    </h1>
                    <div className="badge badge-info gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                        Admin Mode
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                        Problem List
                    </h2>

                    {loading ? (
                        <div className="text-center text-gray-400 py-12">Loading problems...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full bg-gray-800 border border-gray-700">
                                <thead className="bg-gray-700 text-gray-300">
                                    <tr>
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Tags</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.map(problem => (
                                        <tr key={problem._id} className="hover:bg-gray-750">
                                            <td className="font-medium text-white">{problem.title}</td>
                                            <td>
                                                <span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' :
                                                    problem.difficulty === 'medium' ? 'badge-warning' :
                                                        'badge-error'
                                                    }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.tags?.map(tag => (
                                                        <span key={tag} className="badge badge-neutral">{tag}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(problem)}
                                                    className="btn btn-xs btn-primary text-white"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {problems.length === 0 && (
                                <div className="text-center text-gray-400 py-12">
                                    No problems available to edit.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditProblem({ problem, onBack }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [problemData, setProblemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const res = await axiosInstance.get(`/problem/problemById/${problem._id}`);
                setProblemData(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching problem:', error);
                setLoading(false);
            }
        };

        fetchProblemData();
    }, [problem._id]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        getValues,
        watch,
        trigger,
        reset,
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            difficulty: 'medium',
            tags: [],
            visibleTestCases: [],
            hiddenTestCases: [],
            startCode: [],
            referenceSolution: []
        },
    });

    useEffect(() => {
        if (problemData) {
            reset({
                title: problemData.title,
                description: problemData.description,
                difficulty: problemData.difficulty,
                tags: problemData.tags || [],
                visibleTestCases: problemData.testCases?.visible || [],
                hiddenTestCases: problemData.testCases?.hidden || [],
                startCode: problemData.codeSnippets?.start || [],
                referenceSolution: problemData.codeSnippets?.solution || []
            });
        }
    }, [problemData, reset]);

    const { fields: visibleTestCasesFields, append: appendVisibleTestCase, remove: removeVisibleTestCase } = useFieldArray({ control, name: "visibleTestCases" });
    const { fields: hiddenTestCasesFields, append: appendHiddenTestCase, remove: removeHiddenTestCase } = useFieldArray({ control, name: "hiddenTestCases" });
    const { fields: startCodeFields, append: appendStartCode, remove: removeStartCode } = useFieldArray({ control, name: "startCode" });
    const { fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution } = useFieldArray({ control, name: "referenceSolution" });

    const [currentTag, setCurrentTag] = useState("");
    const watchedTags = watch("tags");

    const handleNextStep = async () => {
        const fieldsToValidate = steps[currentStep].fields;
        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
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

    const onSubmit = async (data) => {
        try {
            await axiosInstance.put(`/problem/update/${problem._id}`, data);
            onBack();
        } catch (error) {
            console.error('Error updating problem:', error);
            alert('Failed to update problem');
        }
    };

    const inputClass = (hasError) => `input input-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const textareaClass = (hasError) => `textarea textarea-bordered bg-gray-700 border-gray-600 w-full h-24 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const selectClass = (hasError) => `select select-bordered bg-gray-700 border-gray-600 w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent ${hasError ? 'border-red-500' : ''}`;
    const errorTextClass = "label-text-alt text-red-500 mt-1";

    const steps = [
        { id: 'step1', name: 'Basic Info', fields: ['title', 'description', 'difficulty', 'tags'] },
        { id: 'step2', name: 'Test Cases', fields: ['visibleTestCases', 'hiddenTestCases'] },
        { id: 'step3', name: 'Code Snippets', fields: ['startCode', 'referenceSolution'] },
    ];

    const testCaseSections = [
        { name: "Visible Test Cases", fields: visibleTestCasesFields, append: appendVisibleTestCase, remove: removeVisibleTestCase, error: errors.visibleTestCases, defaultItem: { input: "", output: "", explanation: "" }, itemFields: ["input", "output", "explanation"], arrayName: "visibleTestCases" },
        { name: "Hidden Test Cases", fields: hiddenTestCasesFields, append: appendHiddenTestCase, remove: removeHiddenTestCase, error: errors.hiddenTestCases, defaultItem: { input: "", output: "" }, itemFields: ["input", "output"], arrayName: "hiddenTestCases" }
    ];

    const codeSections = [
        { name: "Start Code Snippets", fields: startCodeFields, append: appendStartCode, remove: removeStartCode, error: errors.startCode, defaultItem: { language: "javascript", initialCode: "" }, codeField: "initialCode", arrayName: "startCode" },
        { name: "Reference Solutions", fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution, error: errors.referenceSolution, defaultItem: { language: "javascript", completeCode: "" }, codeField: "completeCode", arrayName: "referenceSolution" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!problemData) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load problem data</p>
                    <button onClick={onBack} className="btn btn-primary">
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 flex justify-between items-center">
                        <button onClick={onBack} className="btn btn-sm btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to List
                        </button>
                        <h1 className="text-xl font-mono font-bold text-blue-400 flex items-center">
                            <span className="mr-2">{'</>'}</span> Edit Problem: {problemData.title}
                        </h1>
                        <div className="badge badge-info gap-2">
                            Admin Mode
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
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

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Step 1: Basic Information & Tags */}
                            <div className={currentStep === 0 ? 'block' : 'hidden'}>
                                <div className="py-4">
                                    <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="form-control">
                                            <label htmlFor="title" className="label"><span className="label-text text-gray-300">Title</span></label>
                                            <input type="text" id="title" {...register("title", { required: true })} className={inputClass(errors.title)} />
                                            {errors.title && <span className={errorTextClass}>Title is required</span>}
                                        </div>
                                        <div className="form-control">
                                            <label htmlFor="description" className="label"><span className="label-text text-gray-300">Description</span></label>
                                            <textarea id="description" {...register("description", { required: true })} className={textareaClass(errors.description)} />
                                            {errors.description && <span className={errorTextClass}>Description is required</span>}
                                        </div>
                                        <div className="form-control">
                                            <label htmlFor="difficulty" className="label"><span className="label-text text-gray-300">Difficulty</span></label>
                                            <select id="difficulty" {...register("difficulty", { required: true })} className={selectClass(errors.difficulty)}>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                            {errors.difficulty && <span className={errorTextClass}>Difficulty is required</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-4">
                                    <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                                        Tags
                                    </h3>
                                    <div className="space-y-4">
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
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Test Cases */}
                            <div className={currentStep === 1 ? 'block' : 'hidden'}>
                                {testCaseSections.map(section => (
                                    <div key={section.name} className="py-4">
                                        <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                                            {section.name}
                                        </h3>
                                        <div className="space-y-4">
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
                                                                {...register(`${section.arrayName}.${index}.${itemField}`, { required: true })}
                                                                className={textareaClass(section.error?.[index]?.[itemField])}
                                                            />
                                                            {section.error?.[index]?.[itemField] && (
                                                                <span className={errorTextClass}>{itemField} is required</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => section.append(section.defaultItem)}
                                                className="btn btn-sm btn-outline btn-info"
                                            >
                                                Add {section.name.slice(0, -1)}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Step 3: Code Snippets */}
                            <div className={currentStep === 2 ? 'block' : 'hidden'}>
                                {codeSections.map(section => (
                                    <div key={section.name} className="py-4">
                                        <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                                            {section.name}
                                        </h3>
                                        <div className="space-y-4">
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
                                                            {...register(`${section.arrayName}.${index}.language`, { required: true })}
                                                            className={selectClass(section.error?.[index]?.language)}
                                                        >
                                                            {LANGUAGE_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        {section.error?.[index]?.language && (
                                                            <span className={errorTextClass}>Language is required</span>
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
                                                            {...register(`${section.arrayName}.${index}.${section.codeField}`, { required: true })}
                                                            className={`${textareaClass(section.error?.[index]?.[section.codeField])} h-40 font-mono text-sm`}
                                                        />
                                                        {section.error?.[index]?.[section.codeField] && (
                                                            <span className={errorTextClass}>Code is required</span>
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
                                        </div>
                                    </div>
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
                                        >
                                            Next Step
                                        </button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <button
                                            type="submit"
                                            className="btn btn-success bg-blue-600 hover:bg-blue-700 border-none text-white text-lg"
                                        >
                                            Update Problem
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
}

const LANGUAGE_OPTIONS = [
    { value: "c++", label: "C++" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" }
];

export default ProblemList;