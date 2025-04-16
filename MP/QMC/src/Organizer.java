import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Organizer {

    public Map<Integer, List<StringBuilder>> groupMinterms(StringBuilder[] minterms){
        Map<Integer,List<StringBuilder>> mintermGroups = new HashMap<>();

        for (StringBuilder minterm: minterms){
            int ones = 0; // a counter for the number of 1s a minterm has

            for (int j = 0; j < minterm.length(); j++){
                if(minterm.charAt(j) == '1'){
                    ones++;
                }
            }

            if (!mintermGroups.containsKey(ones)){
                mintermGroups.put(ones,new ArrayList<>());
            }
            mintermGroups.get(ones).add(minterm);
        }

        return mintermGroups;
    }
}
