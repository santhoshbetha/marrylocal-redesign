export function FormWrapper({ children, title }) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
