const Btn = ({ onClick, disabled, title, hoverColor, children, ariaLabel }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title={title}
    aria-label={ariaLabel}
    className={`p-2 rounded-lg transition-colors ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : `text-gray-500 cursor-pointer ${hoverColor}`
    }`}
  >
    {children}
  </button>
);
export default Btn;