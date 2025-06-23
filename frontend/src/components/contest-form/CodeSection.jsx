import FormSection from './FormSection';
import { inputClass, textareaClass, selectClass, errorTextClass } from './formStyles';

const LANGUAGE_OPTIONS = [
    { value: "c++", label: "C++" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" }
];

const CodeSection = ({
    title,
    fields,
    register,
    errors,
    onAdd,
    onRemove,
    nestIndex,
    fieldName,
    codeFieldName,
    languageFieldName
}) => {
    return (
        <FormSection title={title}>
            {fields.map((field, index) => (
                <div key={field.id} className="card bg-gray-700 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{title} {index + 1}</h4>
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
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Language</span>
                            </label>
                            <select
                                {...register(`${nestIndex}.${fieldName}.${index}.${languageFieldName}`)}
                                className={selectClass(errors?.[index]?.[languageFieldName])}
                            >
                                {LANGUAGE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors?.[index]?.[languageFieldName] && (
                                <span className={errorTextClass}>
                                    {errors[index][languageFieldName].message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Code</span>
                            </label>
                            <textarea
                                {...register(`${nestIndex}.${fieldName}.${index}.${codeFieldName}`)}
                                className={textareaClass(errors?.[index]?.[codeFieldName])}
                                placeholder={`Enter ${title.toLowerCase()} code`}
                                rows={8}
                            />
                            {errors?.[index]?.[codeFieldName] && (
                                <span className={errorTextClass}>
                                    {errors[index][codeFieldName].message}
                                </span>
                            )}
                        </div>
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

export default CodeSection;