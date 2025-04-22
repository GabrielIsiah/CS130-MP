import java.util.*;

public class Main {
    public static void main(String[] args) {
        Converter converter = new Converter();
        Organizer organizer = new Organizer();
        Comparer comparer = new Comparer();

        Set<Integer> minterms = new HashSet<>(Arrays.asList(0,1,2,3,7,8,9,11,15)); // example input from powerpoint
        Set<Integer> otherMinterms = new HashSet<>(Arrays.asList(2,4,5,6,10,12,13,14));

        // conversion
        Converter.ConversionResults convertResult = converter.mintermConvert(minterms);
        System.out.println(minterms);
        System.out.println("Complement of the given minterms + binary equivalent");
        Iterator<Integer> complementIterator = convertResult.complementsArray.iterator();
        Iterator<String> binaryIterator = convertResult.binaryNumArray.iterator();
        while (complementIterator.hasNext() && binaryIterator.hasNext()){
            System.out.println(complementIterator.next() + " " + binaryIterator.next());
        }

        // organization
        Organizer.organizerResults organizeResult = organizer.groupMinterms(convertResult.binaryNumArray, convertResult.complementsArray);
        System.out.println(organizeResult.binaryGrouping);
        System.out.println(organizeResult.mintermGrouping);

        // comparison
        comparer.compareMinterms(organizeResult.binaryGrouping, organizeResult.mintermGrouping);

    }
}