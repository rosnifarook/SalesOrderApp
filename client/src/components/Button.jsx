const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
