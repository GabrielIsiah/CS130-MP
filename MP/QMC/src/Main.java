import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Converter converter = new Converter();
        Organizer organizer = new Organizer();
        Pairer pairer = new Pairer();

        int[] minterms = {0,1,3,7,8,9,11,15};
        StringBuilder[] result = converter.convertMintermsToBinary(minterms);
        for (int i = 0; i < result.length; i++){
            System.out.println(minterms[i] + " = " + result[i]);
        }

        Map<Integer, List<StringBuilder>> mintermGroups = organizer.groupMinterms(result);
        System.out.println(mintermGroups);
        pairer.pairMinterms(mintermGroups);

    }
}