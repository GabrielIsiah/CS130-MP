import java.util.LinkedHashSet;
import java.util.Set;

public class Converter {

    public static class ConversionResults{
        Set<String> binaryNumArray;
        Set<Integer> complementsArray;

        public ConversionResults(Set<String> binaryNumArray, Set<Integer> complementsArray){
            this.binaryNumArray = binaryNumArray;
            this.complementsArray = complementsArray;
        }
    }

    public void variableConvert(){
        // to fill up
    }

    public ConversionResults mintermConvert(Set<Integer> input) {
        Set<String> binaryNumArray = new LinkedHashSet<>();

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

    public StringBuilder convertMintermToBinary(int num){
        StringBuilder sb = new StringBuilder();

        do{
            int remainder = num % 2;
            sb.insert(0,remainder);
            num /= 2;
        }while (num != 0);

        return sb;
    }

    public Integer getLargestDecimal(Set<Integer> input){
        int largest = 0;
        for (int current : input) {
            if (current > largest) {
                largest = current;
            }
        }
        return largest;
    }

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
