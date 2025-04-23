import React from 'react';

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

export default InputForm;
