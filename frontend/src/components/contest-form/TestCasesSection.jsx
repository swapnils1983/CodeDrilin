import FormSection from './FormSection';
import { textareaClass, errorTextClass } from './formStyles';

const TestCasesSection = ({
    title,
    fields,
    register,
    errors,
    onAdd,
    onRemove,
    nestIndex,
    fieldName,
    showExplanation = false
}) => {
    return (
        <FormSection title={title}>
            {fields.map((field, index) => (
                <div key={field.id} className="card bg-gray-700 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Test Case {index + 1}</h4>
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="btn btn-xs btn-error"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="label">
                                <span className="label-text text-gray-300">Input</span>
                            </label>
                            <textarea
                                {...register(`${nestIndex}.${fieldName}.${index}.input`)}
                                className={textareaClass(errors?.[index]?.input)}
                                placeholder="Test case input"
                            />
                            {errors?.[index]?.input && (
                                <span className={errorTextClass}>{errors[index].input.message}</span>
                            )}
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text text-gray-300">Output</span>
                            </label>
                            <textarea
                                {...register(`${nestIndex}.${fieldName}.${index}.output`)}
                                className={textareaClass(errors?.[index]?.output)}
                                placeholder="Expected output"
                            />
                            {errors?.[index]?.output && (
                                <span className={errorTextClass}>{errors[index].output.message}</span>
                            )}
                        </div>
                        {showExplanation && (
                            <div>
                                <label className="label">
                                    <span className="label-text text-gray-300">Explanation</span>
                                </label>
                                <textarea
                                    {...register(`${nestIndex}.${fieldName}.${index}.explanation`)}
                                    className={textareaClass(errors?.[index]?.explanation)}
                                    placeholder="Explanation of the test case"
                                />
                                {errors?.[index]?.explanation && (
                                    <span className={errorTextClass}>{errors[index].explanation.message}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="btn btn-primary"
            >
                Add {title}
            </button>
            {errors && typeof errors.message === 'string' && (
                <span className={errorTextClass}>{errors.message}</span>
            )}
        </FormSection>
    );
};

export default TestCasesSection;