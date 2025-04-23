import React from 'react';

function StepNavigation({ currentStep, totalSteps, prevStep, nextStep, resetApp }) {
  return (
    <div className="step-navigation">
      <button 
        onClick={prevStep} 
        disabled={currentStep <= 1}
        className="nav-button"
      >
        Previous Step
      </button>
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
      </div>
      {currentStep < totalSteps ? (
        <button 
          onClick={nextStep} 
          className="nav-button"
        >
          Next Step
        </button>
      ) : (
        <button 
          onClick={resetApp} 
          className="nav-button restart"
        >
          Restart
        </button>
      )}
    </div>
  );
}

export default StepNavigation;