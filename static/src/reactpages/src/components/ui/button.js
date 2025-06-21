export const Button = ({ children, className = "", ...props }) => (
  <button className={`rounded px-4 py-2 font-bold ${className}`} {...props}>
    {children}
  </button>
);
