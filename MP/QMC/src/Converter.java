import java.util.LinkedHashSet;
import java.util.Set;

// This module is responsible for the conversion from the complement minterm values (decimal) to the QMA appropriate values (binary).

public class Converter {

    // Inner class responsible for holding conversion results.
    public static class ConversionResults{
        Set<String> binaryNumArray; // Stores the binary representation of the complement minterms.
        Set<Integer> complementsArray; // Stores the decimal representation of the complement minterms.

        public ConversionResults(Set<String> binaryNumArray, Set<Integer> complementsArray){
            this.binaryNumArray = binaryNumArray;
            this.complementsArray = complementsArray;
        }
    }

    public void variableConvert(){
        // To fill up
    }

    // Method that converts input minterms into their compliments.
    public ConversionResults mintermConvert(Set<Integer> input) {
        Set<String> binaryNumArray = new LinkedHashSet<>(); // Stores the binary representations

        // Finds the largest minterm to determine necessary bit width
        int largestMinterm = getLargestDecimal(input); // get the largest minterm value in the input array
        StringBuilder largestMintermBinary = convertMintermToBinary(largestMinterm); // get the binary equivalent of the largest decimal
        int n = largestMintermBinary.length(); // take the length of the largest binary number we can create (IMPORTANT FOR # OF VARIABLES)
        double largestPossibleMinterm = Math.pow(2,n) - 1; // get the largest possible value a minterm can take

        Set<Integer> complementsArray = getComplements(input, (int)largestPossibleMinterm); // take the complement of the input array given the largest minterm possible

        for (int current : complementsArray) {
            StringBuilder sb = convertMintermToBinary(current); // convert each minterm to binary equivalent

            if (sb.length() < n){
                while (sb.length() != n){
                    sb.insert(0,0);
                }
            }
            binaryNumArray.add(sb.toString()); // store in binary number array
        }

        return new ConversionResults(binaryNumArray, complementsArray);

    }

    // Uses remainder division to convert from decimal to its binary form
    public StringBuilder convertMintermToBinary(int num){
        StringBuilder sb = new StringBuilder();

        do{
            int remainder = num % 2;
            sb.insert(0,remainder);
            num /= 2;
        }while (num != 0);

        return sb;
    }

    // Iterates and compares values up until it reaches the larges value.
    public Integer getLargestDecimal(Set<Integer> input){
        int largest = 0;
        for (int current : input) {
            if (current > largest) {
                largest = current;
            }
        }
        return largest;
    }

    // Finds all values from 0 to maximum value that are not in the set.
    // If number is not in the input set, it gets added to the complement set.
    public Set<Integer> getComplements (Set<Integer> input, int largestPossibleMinterm){
        Set<Integer> complements = new LinkedHashSet<>();

        for (int i = 0; i < largestPossibleMinterm+1; i++){
            if (!input.contains(i)){
                complements.add(i);
            }
        }

        return complements;
    }

}
