import React from 'react';

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

export default Step4PrimeImplicantChart;