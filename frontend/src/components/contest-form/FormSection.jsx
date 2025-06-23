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

export default FormSection;