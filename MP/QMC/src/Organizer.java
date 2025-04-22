import java.util.*;

public class Organizer {

    public static class organizerResults {
        Map<Integer, List<StringBuilder>> binaryGrouping;
        Map<Integer, List<Integer>> mintermGrouping;
        public organizerResults (Map<Integer, List<StringBuilder>> binaryGrouping, Map<Integer, List<Integer>> mintermGrouping){
            this.binaryGrouping = binaryGrouping;
            this.mintermGrouping = mintermGrouping;
        }
    }

    public organizerResults groupMinterms(Set<String> binaryArray, Set<Integer> complementArray){
        Map<Integer, List<StringBuilder>> binaryGrouping = new HashMap<>();
        Map<Integer, List<Integer>> mintermGrouping = new HashMap<>();

        for (String minterm : binaryArray){
            StringBuilder sb = new StringBuilder(minterm);
            int ones = countOnes(minterm);

            if(!binaryGrouping.containsKey(ones)){
                binaryGrouping.put(ones, new ArrayList<>());
            }
            binaryGrouping.get(ones).add(sb);

        }

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
