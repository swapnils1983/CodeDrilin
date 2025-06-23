import FormSection from './FormSection';
import { inputClass, textareaClass, selectClass, errorTextClass } from './formStyles';

const ContestInfoStep = ({ register, errors }) => {
    return (
        <div>
            <FormSection title="Contest Information">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Contest Title</span>
                    </label>
                    <input
                        type="text"
                        {...register("title")}
                        className={inputClass(errors.title)}
                        placeholder="e.g., Weekly Coding Challenge #1"
                    />
                    {errors.title && <span className={errorTextClass}>{errors.title.message}</span>}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-300">Description</span>
                    </label>
                    <textarea
                        {...register("description")}
                        className={textareaClass(errors.description)}
                        placeholder="Describe the contest rules, theme, and any special instructions..."
                        rows={4}
                    />
                    {errors.description && <span className={errorTextClass}>{errors.description.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-300">Start Time</span>
                        </label>
                        <input
                            type="datetime-local"
                            {...register("startTime")}
                            className={inputClass(errors.startTime)}
                        />
                        {errors.startTime && <span className={errorTextClass}>{errors.startTime.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-300">Contest Length</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                {...register("durationValue")}
                                className={inputClass(errors.durationValue)}
                                placeholder="e.g., 120"
                            />
                            <select
                                {...register("durationUnit")}
                                className={selectClass(errors.durationUnit)}
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        {errors.durationValue && <span className={errorTextClass}>{errors.durationValue.message}</span>}
                        {errors.durationUnit && !errors.durationValue && <span className={errorTextClass}>{errors.durationUnit.message}</span>}
                    </div>
                </div>
            </FormSection>
        </div>
    );
};

export default ContestInfoStep;