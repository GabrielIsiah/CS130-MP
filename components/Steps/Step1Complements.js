import React from 'react';

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

export default Step1Complements;