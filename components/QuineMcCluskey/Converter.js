export class Converter {
  static mintermConvert(inputMinterms, variables) {
    // Find the largest minterm to determine bit width
    const largestMinterm = Math.max(...inputMinterms);
    const n = Math.max(largestMinterm.toString(2).length, variables.length);
    
    // Get all possible minterms up to 2^n - 1
    const maxPossibleMinterm = Math.pow(2, n) - 1;
    
    // Find complements
    let complements = [];
    for (let i = 0; i <= maxPossibleMinterm; i++) {
      if (!inputMinterms.includes(i)) {
        complements.push(i);
      }
    }
    
    // Convert to binary with proper padding
    let binaryNumbers = complements.map(num => {
      let binary = num.toString(2);
      while (binary.length < n) {
        binary = '0' + binary;
      }
      return binary;
    });
    
    return {
      complements,
      binaryNumbers,
      n
    };
  }
}