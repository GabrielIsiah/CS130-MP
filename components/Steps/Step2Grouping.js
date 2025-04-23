import React from 'react';

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

export default Step2Grouping;