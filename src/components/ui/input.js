export function Input({ className = "", ...rest }) {
  return <input className={`border rounded px-2 py-1 w-full ${className}`} {...rest} />;
}
