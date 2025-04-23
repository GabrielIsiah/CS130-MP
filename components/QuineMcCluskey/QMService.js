import { Converter } from './Converter';
import { Organizer } from './Organizer';
import { Comparer } from './Comparer';
import { PrimeImplicantTable } from './PrimeImplicantTable';

export class QMService {
  static runQMA(inputMinterms, variables) {
    // Step 1: Convert minterms to binary and find complements
    const { complements, binaryNumbers } = Converter.mintermConvert(inputMinterms, variables);
    
    // Step 2: Group minterms by number of 1's
    const { binaryGroups, mintermGroups } = Organizer.groupMinterms(binaryNumbers, complements);
    
    // Step 3: Compare groups and find prime implicants
    const { primeImplicants, piCoverage, iterations } = Comparer.compareMinterms(binaryGroups, mintermGroups);
    
    // Step 4: Find minimal cover using prime implicant chart
    const { essentialPIs, additionalPIs, minimalCover } = PrimeImplicantTable.findMinimalCover(
      primeImplicants, 
      piCoverage, 
      complements
    );
    
    // Step 5: Convert to boolean expression
    const { expression, termBreakdown } = PrimeImplicantTable.convertToExpression(minimalCover, piCoverage, variables);
    
    return {
      inputMinterms,
      variables,
      complements,
      binaryNumbers,
      binaryGroups,
      mintermGroups,
      primeImplicants,
      piCoverage,
      iterations,
      essentialPIs,
      additionalPIs,
      minimalCover,
      expression,
      termBreakdown
    };
  }
}