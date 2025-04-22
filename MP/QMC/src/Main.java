import java.util.*;

public class Main {
    public static void main(String[] args) {
        Converter converter = new Converter();
        Organizer organizer = new Organizer();
        Comparer comparer = new Comparer();
        PrimeImplicantTable piChart = new PrimeImplicantTable();

        // Create a scanner for user input
        Scanner scanner = new Scanner(System.in);
        Set<Integer> minterms = new HashSet<>();

        // Prompt user for input
        System.out.println("Enter minterms separated by spaces (e.g. 0 1 2 3 7 8 9 11 15): ");
        String input = scanner.nextLine().trim();

        // Parse input string into integers
        if (!input.isEmpty()) {
            String[] mintermStrings = input.split("\\s+");
            for (String mintermStr : mintermStrings) {
                try {
                    int minterm = Integer.parseInt(mintermStr);
                    minterms.add(minterm);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid input: " + mintermStr + " is not a valid number. Skipping...");
                }
            }
        }

        // Check if we have any valid minterms
        if (minterms.isEmpty()) {
            System.out.println("No valid minterms provided. Exiting...");
            scanner.close();
            return;
        }

        System.out.println("Processing minterms: " + minterms);

        // Perform the steps from the original code
        Converter.ConversionResults convertResult = converter.mintermConvert(minterms);
        System.out.println("\nComplement of the given minterms + binary equivalent");
        Iterator<Integer> complementIterator = convertResult.complementsArray.iterator();
        Iterator<String> binaryIterator = convertResult.binaryNumArray.iterator();
        while (complementIterator.hasNext() && binaryIterator.hasNext()){
            System.out.println(complementIterator.next() + " " + binaryIterator.next());
        }

        Organizer.organizerResults organizeResult = organizer.groupMinterms(
                convertResult.binaryNumArray,
                convertResult.complementsArray
        );

        Map<String, Set<Integer>> implicantToMinterms = comparer.compareMinterms(
                organizeResult.binaryGrouping,
                organizeResult.mintermGrouping
        );

        // Get the set of prime implicants
        Set<String> primeImplicants = implicantToMinterms.keySet();

        // Find the minimal cover using the new PrimeImplicateChart class
        Set<String> minimalCover = piChart.findMinimalCover(
                primeImplicants,
                implicantToMinterms,
                new HashSet<>(convertResult.complementsArray)
        );

        // Determine the number of variables (bits) from the prime implicants
        int variables = primeImplicants.iterator().next().length();

        // Convert to boolean expression
        String expression = piChart.convertToExpression(minimalCover, variables);

        System.out.println("\n========= FINAL RESULT =========");
        System.out.println("Minimal expression: " + expression);
        System.out.println("===============================");

        // Close the scanner
        scanner.close();
    }
}