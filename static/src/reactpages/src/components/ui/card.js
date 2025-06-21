export const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);
