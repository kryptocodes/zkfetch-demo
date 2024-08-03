import React from 'react';
import LoadingSpinner from './Spinner';

interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label: string;
  disabled?: boolean;
  loadingText?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isLoading, label, disabled = false, loadingText }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 transition duration-300 flex items-center gap-2"
    disabled={disabled || isLoading}
  >
    {isLoading ? (
      <>
        <LoadingSpinner />
        <span>{loadingText}</span>
      </>
    ) : (
      <span
      className='text-sm md:text-lg'
      >{label}</span>
    )}
  </button>
);

export default ActionButton;
