import React, { useState } from 'react';
import './App.css';

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
    const qmaResult = runQMA(minterms, variables);
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
  
  // Navigation buttons component
  const StepNavigation = () => (
    <div className="step-navigation">
      <button 
        onClick={prevStep} 
        disabled={currentStep <= 1}
        className="nav-button"
      >
        Previous Step
      </button>
      <div className="step-indicator">
        Step {currentStep} of {result ? 5 : 1}
      </div>
      {currentStep < 5 && result ? (
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
            <StepNavigation />
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

// Component for the initial input form
function InputForm({ inputMinterms, setInputMinterms, inputVariables, setInputVariables, handleSubmit, error }) {
  return (
    <div className="input-form">
      <h2>Enter Minterms and Variables</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="minterms">Minterms (comma separated)</label>
          <input
            id="minterms"
            type="text"
            value={inputMinterms}
            onChange={(e) => setInputMinterms(e.target.value)}
            placeholder="0,1,2,3,7,8,9,11,15"
            className="minterm-input"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="variables">Variables (maximum 10)</label>
          <input
            id="variables"
            type="text"
            value={inputVariables}
            onChange={(e) => setInputVariables(e.target.value)}
            placeholder="e.g. GAB"
            className="variable-input"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-button">Process Minterms</button>
      </form>
    </div>
  );
}

// Step 1: Complements and Binary Conversion
function Step1Complements({ result }) {
  return (
    <div className="step-container">
      <h2>Step 1: Complements & Binary Conversion</h2>
      <div className="step-explanation">
        <p>This step identifies the complements of the input minterms and converts them to binary format.</p>
        <p>Original minterms: {result.inputMinterms.join(', ')}</p>
        <p>Variables used: {result.variables.join(', ')}</p>
      </div>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Decimal (Complement)</th>
              <th>Binary</th>
            </tr>
          </thead>
          <tbody>
            {result.complements.map((comp, index) => (
              <tr key={index}>
                <td>{comp}</td>
                <td>{result.binaryNumbers[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Step 2: Grouping by Number of 1's
function Step2Grouping({ result }) {
  return (
    <div className="step-container">
      <h2>Step 2: Grouping by Number of 1's</h2>
      <div className="step-explanation">
        <p>In this step, binary representations are grouped based on the number of 1's they contain.</p>
      </div>
      
      <div className="groups-container">
        {Object.keys(result.binaryGroups).map(groupKey => (
          <div key={groupKey} className="group-card">
            <h3>Group {groupKey} (with {groupKey} 1's)</h3>
            <ul>
              {result.binaryGroups[groupKey].map((binary, idx) => (
                <li key={idx}>
                  <span className="binary">{binary}</span> 
                  <span className="decimal">= {result.mintermGroups[groupKey][idx]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 3: Comparison and Prime Implicant Generation
function Step3Comparison({ result }) {
  return (
    <div className="step-container">
      <h2>Step 3: Merging Process</h2>
      <div className="step-explanation">
        <p>This step shows the process of comparing and merging terms to find prime implicants.</p>
      </div>
      
      <div className="iterations-container">
        {result.iterations.map((iteration, iterIndex) => (
          <div key={iterIndex} className="iteration-block">
            <h3>Iteration {iterIndex + 1}</h3>
            
            <div className="merges-container">
              {iteration.merges.map((merge, mergeIndex) => (
                <div key={mergeIndex} className="merge-item">
                  <span className="merge-from">{merge.from.join(' + ')}</span>
                  <span className="merge-arrow">→</span>
                  <span className="merge-to">{merge.to}</span>
                </div>
              ))}
              
              {iteration.unmatchedTerms.length > 0 && (
                <div className="unmatched-terms">
                  <h4>Unmatched Terms (Prime Implicants)</h4>
                  <ul>
                    {iteration.unmatchedTerms.map((term, termIndex) => (
                      <li key={termIndex}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="prime-implicants-result">
        <h3>Final Prime Implicants</h3>
        <ul className="pi-list">
          {result.primeImplicants.map((pi, index) => (
            <li key={index}>
              <span className="pi-term">{pi}</span>
              <span className="pi-coverage">Covers: {result.piCoverage[pi].join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Step 4: Prime Implicant Chart
function Step4PrimeImplicantChart({ result }) {
  return (
    <div className="step-container">
      <h2>Step 4: Prime Implicant Chart</h2>
      <div className="step-explanation">
        <p>The prime implicate chart shows which maxterms (where function is 0) are covered by each prime implicate.</p>
        <p>Essential prime implicates are those that uniquely cover at least one maxterm.</p>
      </div>
      
      <div className="pi-chart">
        <table>
          <thead>
            <tr>
              <th>Prime Implicant</th>
              {result.complements.map(minterm => (
                <th key={minterm}>{minterm}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.primeImplicants.map((pi, piIndex) => (
              <tr key={piIndex} className={result.essentialPIs.includes(pi) ? 'essential-pi' : ''}>
                <td className="pi-cell">{pi} {result.essentialPIs.includes(pi) ? '(Essential)' : ''}</td>
                {result.complements.map(minterm => (
                  <td key={minterm} className={result.piCoverage[pi].includes(minterm) ? 'covered' : ''}>
                    {result.piCoverage[pi].includes(minterm) ? 'X' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="selection-explanation">
        <h3>Essential Prime Implicants</h3>
        <ul>
          {result.essentialPIs.map((pi, index) => (
            <li key={index}>{pi} - Covers: {result.piCoverage[pi].join(', ')}</li>
          ))}
        </ul>
        
        {result.additionalPIs.length > 0 && (
          <>
            <h3>Additional Prime Implicants Selected</h3>
            <ul>
              {result.additionalPIs.map((pi, index) => (
                <li key={index}>{pi} - Covers: {result.piCoverage[pi].join(', ')}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// Step 5: Final Boolean Expression
function Step5FinalExpression({ result }) {
  return (
    <div className="step-container">
      <h2>Step 5: Final Boolean Expression (Product of Sums)</h2>
      <div className="step-explanation">
        <p>The minimal boolean expression in Product-of-Sums form derived from the prime implicates.</p>
        <p>Each sum term covers the maxterms where the function is 0.</p>
      </div>
      
      <div className="final-expression">
        <h3>Minimal POS Expression</h3>
        <div className="expression-box">
          {result.expression}
        </div>
        
        <div className="term-breakdown">
          <h4>Term Breakdown</h4>
          <ul>
            {result.termBreakdown.map((term, index) => (
              <li key={index}>
                <span className="pi-term">{result.minimalCover[index]}</span> →{' '}
                <span className="boolean-term">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// QMA algorithm implementation
function runQMA(inputMinterms, customVariables) {
  // Step 1: Find complements and convert to binary
  const result = {
    inputMinterms: [...inputMinterms],
    variables: [...customVariables],
    iterations: []
  };
  
  // Find the largest minterm to determine bit width
  const largestMinterm = Math.max(...inputMinterms);
  let n = Math.max(largestMinterm.toString(2).length, customVariables.length);
  
  // Get all possible minterms up to 2^n - 1
  const maxPossibleMinterm = Math.pow(2, n) - 1;
  
  // Find complements
  let complements = [];
  for (let i = 0; i <= maxPossibleMinterm; i++) {
    if (!inputMinterms.includes(i)) {
      complements.push(i);
    }
  }
  result.complements = complements;
  
  // Convert to binary with proper padding
  let binaryNumbers = complements.map(num => {
    let binary = num.toString(2);
    while (binary.length < n) {
      binary = '0' + binary;
    }
    return binary;
  });
  result.binaryNumbers = binaryNumbers;
  
  // Step 2: Group by number of 1's
  let binaryGroups = {};
  let mintermGroups = {};
  
  complements.forEach((minterm, index) => {
    const binary = binaryNumbers[index];
    const ones = binary.split('').filter(bit => bit === '1').length;
    
    if (!binaryGroups[ones]) {
      binaryGroups[ones] = [];
      mintermGroups[ones] = [];
    }
    
    binaryGroups[ones].push(binary);
    mintermGroups[ones].push(minterm);
  });
  
  result.binaryGroups = binaryGroups;
  result.mintermGroups = mintermGroups;
  
  // Step 3: Compare and find prime implicants
  let primeImplicants = new Set();
  let currentGroups = {...binaryGroups};
  let implicantToMinterms = {};
  
  // Initialize implicantToMinterms with individual minterms
  complements.forEach((minterm, index) => {
    implicantToMinterms[binaryNumbers[index]] = [minterm];
  });
  
  // Comparison process
  let iteration = 0;
  let changesMade = true;
  
  while (changesMade && Object.keys(currentGroups).length > 1) {
    changesMade = false;
    const newGroups = {};
    const usedTerms = new Set();
    const currentIteration = { merges: [], unmatchedTerms: [] };
    
    // Get sorted group keys
    const groupKeys = Object.keys(currentGroups).map(Number).sort((a, b) => a - b);
    
    // Compare adjacent groups
    for (let i = 0; i < groupKeys.length - 1; i++) {
      const currentKey = groupKeys[i];
      const nextKey = groupKeys[i + 1];
      
      if (nextKey - currentKey !== 1) continue;
      
      const currentGroup = currentGroups[currentKey];
      const nextGroup = currentGroups[nextKey];
      
      for (const current of currentGroup) {
        let merged = false;
        
        for (const next of nextGroup) {
          // Compare the two terms
          let differenceIndex = -1;
          let differenceCount = 0;
          
          for (let j = 0; j < current.length; j++) {
            if (current[j] !== next[j]) {
              differenceCount++;
              differenceIndex = j;
            }
            if (differenceCount > 1) break;
          }
          
          // If they differ by exactly one bit, merge them
          if (differenceCount === 1) {
            let mergedTerm = current.split('');
            mergedTerm[differenceIndex] = '_';
            mergedTerm = mergedTerm.join('');
            
            // Add to new groups
            if (!newGroups[currentKey]) {
              newGroups[currentKey] = [];
            }
            
            if (!newGroups[currentKey].includes(mergedTerm)) {
              newGroups[currentKey].push(mergedTerm);
              
              // Track minterms covered by this implicant
              implicantToMinterms[mergedTerm] = [
                ...new Set([
                  ...(implicantToMinterms[current] || []),
                  ...(implicantToMinterms[next] || [])
                ])
              ];
              
              // Record the merge
              currentIteration.merges.push({
                from: [current, next],
                to: mergedTerm
              });
            }
            
            merged = true;
            usedTerms.add(current);
            usedTerms.add(next);
            changesMade = true;
          }
        }
        
        // If this term didn't merge with any in the next group, it's a potential prime implicant
        if (!merged && !usedTerms.has(current)) {
          currentIteration.unmatchedTerms.push(current);
        }
      }
    }
    
    // Check remaining terms in the last group
    const lastGroupIndex = groupKeys.length - 1;
    const lastGroup = currentGroups[groupKeys[lastGroupIndex]];
    
    for (const term of lastGroup) {
      if (!usedTerms.has(term)) {
        currentIteration.unmatchedTerms.push(term);
      }
    }
    
    // Add prime implicants from this iteration
    currentIteration.unmatchedTerms.forEach(term => primeImplicants.add(term));
    
    // Add any merged terms that didn't get used in the next iteration
    if (!changesMade && Object.keys(newGroups).length > 0) {
      for (const group of Object.values(newGroups)) {
        for (const term of group) {
          primeImplicants.add(term);
        }
      }
    }
    
    // Prepare for next iteration
    currentGroups = newGroups;
    result.iterations.push(currentIteration);
    iteration++;
  }
  
  // Add any remaining merged terms as prime implicants
  for (const group of Object.values(currentGroups)) {
    for (const term of group) {
      primeImplicants.add(term);
    }
  }
  
  result.primeImplicants = Array.from(primeImplicants);
  result.piCoverage = {};
  
  // Make sure coverage data is accurate
  for (const pi of result.primeImplicants) {
    result.piCoverage[pi] = implicantToMinterms[pi] || [];
  }
  
  // Step 4: Prime Implicant Chart and Minimal Cover
  // Find essential prime implicants
  const essentialPIs = [];
  
  for (const minterm of complements) {
    const coveringPIs = result.primeImplicants.filter(pi => 
      result.piCoverage[pi].includes(minterm)
    );
    
    if (coveringPIs.length === 1) {
      essentialPIs.push(coveringPIs[0]);
    }
  }
  
  result.essentialPIs = Array.from(new Set(essentialPIs));
  
  // Find covered minterms
  let coveredMinterms = new Set();
  for (const pi of result.essentialPIs) {
    result.piCoverage[pi].forEach(m => coveredMinterms.add(m));
  }
  
  // Find additional PIs for remaining minterms
  const additionalPIs = [];
  let remainingMinterms = complements.filter(m => !coveredMinterms.has(m));
  
  // Candidate PIs (excluding essential ones)
  const candidatePIs = result.primeImplicants.filter(pi => !result.essentialPIs.includes(pi));
  
  while (remainingMinterms.length > 0 && candidatePIs.length > 0) {
    let bestPI = null;
    let maxCoverage = 0;
    
    for (const pi of candidatePIs) {
      const coverage = result.piCoverage[pi].filter(m => remainingMinterms.includes(m));
      
      if (coverage.length > maxCoverage) {
        maxCoverage = coverage.length;
        bestPI = pi;
      }
    }
    
    if (!bestPI) break;
    
    additionalPIs.push(bestPI);
    const index = candidatePIs.indexOf(bestPI);
    candidatePIs.splice(index, 1);
    
    // Update remaining minterms
    remainingMinterms = remainingMinterms.filter(m => !result.piCoverage[bestPI].includes(m));
  }
  
  result.additionalPIs = additionalPIs;
  result.minimalCover = [...result.essentialPIs, ...additionalPIs];
  
  // Step 5: Convert to Boolean expression (POS version) with custom variables
  const varNames = customVariables; // Use the custom variables
  const termBreakdown = [];

  for (const implicant of result.minimalCover) {
    let termParts = [];
    
    for (let i = 0; i < implicant.length && i < varNames.length; i++) {
      const bit = implicant[i];
      if (bit === '0') {
        termParts.push(varNames[i]);  // Uncomplemented in POS
      } else if (bit === '1') {
        termParts.push(varNames[i] + "'");  // Complemented in POS
      }
      // '_' is ignored as it represents a missing variable
    }
    
    // For POS, each implicant becomes a sum term
    termBreakdown.push(termParts.join(' + ') || '0');  // Empty term means 0 (always false)
  }

  result.termBreakdown = termBreakdown;
  // Join with product (AND) operators for POS
  result.expression = termBreakdown.length > 1 
    ? '(' + termBreakdown.join(')(') + ')' 
    : termBreakdown[0] || '1';  // Empty product means 1 (always true)
  
  return result;
}

export default App;