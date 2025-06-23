import FormSection from './FormSection';
import { inputClass, errorTextClass } from './formStyles';
import { useState } from 'react';

const TagsSection = ({ nestIndex, register, errors, setValue, getValues, watch }) => {
    const [currentTag, setCurrentTag] = useState("");
    const watchedTags = watch(`problems.${nestIndex}.tags`);

    const handleAddTag = () => {
        if (currentTag.trim() !== "") {
            const currentTags = getValues(`problems.${nestIndex}.tags`) || [];
            if (!currentTags.includes(currentTag.trim())) {
                setValue(`problems.${nestIndex}.tags`, [...currentTags, currentTag.trim()], { shouldValidate: true });
            }
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const currentTags = getValues(`problems.${nestIndex}.tags`) || [];
        setValue(`problems.${nestIndex}.tags`, currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
    };

    return (
        <FormSection title="Tags">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className={inputClass(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                        }
                    }}
                    placeholder="Add tag and press Enter"
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn btn-primary"
                >
                    Add Tag
                </button>
            </div>
            {watchedTags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {watchedTags.map((tag, i) => (
                        <div key={i} className="badge badge-lg badge-primary gap-2">
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {errors?.tags && (
                <span className={errorTextClass}>
                    {errors.tags.message || (errors.tags.root && errors.tags.root.message)}
                </span>
            )}
        </FormSection>
    );
};

export default TagsSection;