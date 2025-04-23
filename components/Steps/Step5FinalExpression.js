import React from 'react';

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

export default Step5FinalExpression;