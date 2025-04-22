import java.util.*;

// This module is responsible for grouping the minterms based on their number of 1's.
// Maintains the decimal and binary values then stores them into separate maps.

public class Organizer {

    // Hold organizer results
    public static class organizerResults {
        Map<Integer, List<StringBuilder>> binaryGrouping; // Groups by number of 1's (binary).
        Map<Integer, List<Integer>> mintermGrouping; // Groups by number of 1's (decimal)
        public organizerResults (Map<Integer, List<StringBuilder>> binaryGrouping, Map<Integer, List<Integer>> mintermGrouping){
            this.binaryGrouping = binaryGrouping;
            this.mintermGrouping = mintermGrouping;
        }
    }

    // Groups binary representation of the minterms by its number of 1's.
    public organizerResults groupMinterms(Set<String> binaryArray, Set<Integer> complementArray){
        Map<Integer, List<StringBuilder>> binaryGrouping = new HashMap<>();
        Map<Integer, List<Integer>> mintermGrouping = new HashMap<>();

        // Iterates through then determines number of 1's for grouping.
        for (String minterm : binaryArray){
            StringBuilder sb = new StringBuilder(minterm);
            int ones = countOnes(minterm);

            if(!binaryGrouping.containsKey(ones)){
                binaryGrouping.put(ones, new ArrayList<>());
            }
            binaryGrouping.get(ones).add(sb);

        }

        // Groups decimal values by number of 1's in their binary representation.
        for (Integer num : complementArray){
            StringBuilder minterm = convertToBinary(num);
            int ones = countOnes(minterm.toString());

            if(!mintermGrouping.containsKey(ones)){
                mintermGrouping.put(ones, new ArrayList<>());
            }
            mintermGrouping.get(ones).add(num);
        }

        return new organizerResults(binaryGrouping, mintermGrouping);
    }

    // Counts the number of 1's.
    public Integer countOnes(String minterm){
        int ones = 0;
        for (int i = 0; i < minterm.length(); i++){
            if (minterm.charAt(i) == '1'){
                ones++;
            }
        }
        return ones;
    }

    public StringBuilder convertToBinary(Integer num){
        StringBuilder sb = new StringBuilder();

        do{
            int remainder = num % 2;
            sb.insert(0,remainder);
            num /= 2;
        } while (num != 0);

        return sb;
    }

}
