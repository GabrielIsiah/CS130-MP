export class Comparer {
  static compareMinterms(binaryGroups, mintermGroups) {
    let primeImplicants = new Set();
    let currentGroups = {...binaryGroups};
    let implicantToMinterms = {};
    let iterations = [];
    
    // Initialize implicantToMinterms with individual minterms
    Object.keys(mintermGroups).forEach(group => {
      mintermGroups[group].forEach((minterm, idx) => {
        implicantToMinterms[binaryGroups[group][idx]] = [minterm];
      });
    });
    
    // Comparison process
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
      iterations.push(currentIteration);
    }
    
    // Add any remaining merged terms as prime implicants
    for (const group of Object.values(currentGroups)) {
      for (const term of group) {
        primeImplicants.add(term);
      }
    }
    
    return {
      primeImplicants: Array.from(primeImplicants),
      piCoverage: implicantToMinterms,
      iterations
    };
  }
}
