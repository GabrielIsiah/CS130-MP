export class Organizer {
  static groupMinterms(binaryNumbers, complements) {
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
    
    return {
      binaryGroups,
      mintermGroups
    };
  }
}