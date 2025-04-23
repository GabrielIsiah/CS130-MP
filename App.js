import React, { useState } from 'react';
import './App.css';
import { QMService } from './components/QuineMcCluskey/QMService';

// Import components
import InputForm from './components/Steps/InputForm';
import Step1Complements from './components/Steps/Step1Complements';
import Step2Grouping from './components/Steps/Step2Grouping';
import Step3Comparison from './components/Steps/Step3Comparison';
import Step4PrimeImplicantChart from './components/Steps/Step4PrimeImplicantChart';
import Step5FinalExpression from './components/Steps/Step5FinalExpression';
import StepNavigation from './components/Navigation';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputMinterms, setInputMinterms] = useState('');
  const [inputVariables, setInputVariables] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Process minterms
    const minterms = inputMinterms.trim()
      .split(',')
      .map(Number)
      .filter(num => !isNaN(num));
      
    if (minterms.length === 0) {
      setError('Please enter valid minterms');
      return;
    }
    
    // Process variables
    const variables = inputVariables.trim().split('').filter(char => /[A-Za-z]/.test(char));
    
    // Validate variables
    if (variables.length === 0) {
      setError('Please enter at least one variable');
      return;
    }
    
    if (variables.length > 10) {
      setError('Maximum 10 variables allowed');
      return;
    }
    
    // Check for duplicate variables
    const uniqueVars = new Set(variables);
    if (uniqueVars.size !== variables.length) {
      setError('Duplicate variables are not allowed');
      return;
    }
    
    // Find the largest minterm to ensure it fits with the number of variables
    const largestMinterm = Math.max(...minterms);
    const maxAllowedMinterm = Math.pow(2, variables.length) - 1;
    
    if (largestMinterm > maxAllowedMinterm) {
      setError(`The largest minterm (${largestMinterm}) exceeds the maximum allowed (${maxAllowedMinterm}) for ${variables.length} variables`);
      return;
    }
    
    // Run the QMA algorithm with custom variables
    const qmaResult = QMService.runQMA(minterms, variables);
    setResult(qmaResult);
    setCurrentStep(1);
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const resetApp = () => {
    setCurrentStep(0);
    setResult(null);
    setInputMinterms('');
    setInputVariables('');
    setError('');
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Quine-McCluskey Algorithm</h1>
        <p>A step-by-step visual representation of the QMA process</p>
      </header>
      
      <main className="app-content">
        {currentStep === 0 ? (
          <InputForm 
            inputMinterms={inputMinterms} 
            setInputMinterms={setInputMinterms}
            inputVariables={inputVariables}
            setInputVariables={setInputVariables}
            handleSubmit={handleSubmit}
            error={error}
          />
        ) : (
          <>
            <StepNavigation 
              currentStep={currentStep}
              totalSteps={5}
              prevStep={prevStep}
              nextStep={nextStep}
              resetApp={resetApp}
            />
            <div className="step-content">
              {currentStep === 1 && <Step1Complements result={result} />}
              {currentStep === 2 && <Step2Grouping result={result} />}
              {currentStep === 3 && <Step3Comparison result={result} />}
              {currentStep === 4 && <Step4PrimeImplicantChart result={result} />}
              {currentStep === 5 && <Step5FinalExpression result={result} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;