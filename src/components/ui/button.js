export function Button({ children, className = "", variant, ...rest }) {
  const base = "px-3 py-2 rounded";
  const style =
    variant === "secondary"
      ? "bg-gray-300 text-black"
      : variant === "outline"
      ? "border border-gray-400"
      : "bg-green-600 text-white";
  return (
    <button className={`${base} ${style} ${className}`} {...rest}>
      {children}
    </button>
  );
}
