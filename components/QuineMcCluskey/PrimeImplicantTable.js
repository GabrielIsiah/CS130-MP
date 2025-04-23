export class PrimeImplicantTable {
  static findMinimalCover(primeImplicants, piCoverage, complements) {
    // Find essential prime implicants using a Set to avoid duplicates
    const essentialPIsSet = new Set();
    
    for (const minterm of complements) {
      const coveringPIs = primeImplicants.filter(pi => 
        piCoverage[pi].includes(minterm)
      );
      
      if (coveringPIs.length === 1) {
        essentialPIsSet.add(coveringPIs[0]);
      }
    }
    
    // Convert Set to Array
    const essentialPIs = Array.from(essentialPIsSet);

    // Find covered minterms
    let coveredMinterms = new Set();
    for (const pi of essentialPIs) {
      piCoverage[pi].forEach(m => coveredMinterms.add(m));
    }
    
    // Find additional PIs for remaining minterms
    const additionalPIs = [];
    let remainingMinterms = complements.filter(m => !coveredMinterms.has(m));
    
    // Candidate PIs (excluding essential ones)
    const candidatePIs = primeImplicants.filter(pi => !essentialPIs.includes(pi));
    
    while (remainingMinterms.length > 0 && candidatePIs.length > 0) {
      let bestPI = null;
      let maxCoverage = 0;
      
      for (const pi of candidatePIs) {
        // Create a separate copy of the array for filtering to avoid the ESLint warning
        const currentRemaining = [...remainingMinterms];
        const coverage = piCoverage[pi].filter(m => currentRemaining.includes(m));
        
        if (coverage.length > maxCoverage) {
          maxCoverage = coverage.length;
          bestPI = pi;
        }
      }
      
      if (!bestPI) break;
      
      additionalPIs.push(bestPI);
      const index = candidatePIs.indexOf(bestPI);
      candidatePIs.splice(index, 1);
      
      // Update remaining minterms - avoid using filter with a function capturing the loop variable
      const nextRemainingMinterms = [];
      const bestPICoverage = piCoverage[bestPI];
      for (const minterm of remainingMinterms) {
        if (!bestPICoverage.includes(minterm)) {
          nextRemainingMinterms.push(minterm);
        }
      }
      remainingMinterms = nextRemainingMinterms;
    }
    
    return {
      essentialPIs,
      additionalPIs,
      minimalCover: [...essentialPIs, ...additionalPIs]
    };
  }
  
  static convertToExpression(minimalCover, piCoverage, variables) {
    const termBreakdown = [];

    for (const implicant of minimalCover) {
      let termParts = [];
      
      for (let i = 0; i < implicant.length && i < variables.length; i++) {
        const bit = implicant[i];
        if (bit === '0') {
          termParts.push(variables[i]);  // Uncomplemented in POS
        } else if (bit === '1') {
          termParts.push(variables[i] + "'");  // Complemented in POS
        }
        // '_' is ignored as it represents a missing variable
      }
      
      // For POS, each implicant becomes a sum term
      termBreakdown.push(termParts.join(' + ') || '0');  // Empty term means 0 (always false)
    }

    // Join with product (AND) operators for POS
    const expression = termBreakdown.length > 1 
      ? '(' + termBreakdown.join(')(') + ')' 
      : termBreakdown[0] || '1';  // Empty product means 1 (always true)
    
    return {
      expression,
      termBreakdown
    };
  }
}