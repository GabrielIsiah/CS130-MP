import java.util.*;

public class PrimeImplicantTable {
    public Set<String> findMinimalCover(Set<String> primeImplicants,
                                        Map<String, Set<Integer>> coverage,
                                        Set<Integer> originalMinterms) {
        // Print the chart for visualization
        printChart(primeImplicants, coverage, originalMinterms);

        // 1. Identify essential prime implicants
        Set<String> essentialPIs = findEssentialPrimeImplicants(primeImplicants, coverage, originalMinterms);
        System.out.println("\nEssential Prime Implicants:");
        for (String pi : essentialPIs) {
            System.out.println(pi + " → " + coverage.get(pi));
        }

        // 2. Find the minterms already covered by essential PIs
        Set<Integer> coveredMinterms = findCoveredMinterms(essentialPIs, coverage);
        System.out.println("\nMinterms covered by essential PIs: " + coveredMinterms);

        // 3. If all minterms are covered, we're done
        if (coveredMinterms.containsAll(originalMinterms)) {
            System.out.println("All minterms covered by essential prime implicants.");
            return essentialPIs;
        }

        // 4. Otherwise, find additional PIs to cover remaining minterms
        Set<Integer> remainingMinterms = new HashSet<>(originalMinterms);
        remainingMinterms.removeAll(coveredMinterms);
        System.out.println("\nRemaining minterms to cover: " + remainingMinterms);

        Set<String> additionalPIs = findAdditionalCoverage(primeImplicants,
                essentialPIs,
                coverage,
                originalMinterms,
                coveredMinterms);

        System.out.println("\nAdditional Prime Implicants selected:");
        for (String pi : additionalPIs) {
            System.out.println(pi + " → " + coverage.get(pi));
        }

        // 5. Combine and return the complete solution
        Set<String> solution = new HashSet<>(essentialPIs);
        solution.addAll(additionalPIs);
        return solution;
    }

    private void printChart(Set<String> primeImplicants,
                            Map<String, Set<Integer>> coverage,
                            Set<Integer> originalMinterms) {
        System.out.println("\n========= PRIME IMPLICANT CHART =========");

        // Sort minterms for display
        List<Integer> sortedMinterms = new ArrayList<>(originalMinterms);
        Collections.sort(sortedMinterms);

        // Print header
        System.out.print("Prime Implicant | ");
        for (Integer minterm : sortedMinterms) {
            System.out.print(String.format("%2d | ", minterm));
        }
        System.out.println();

        // Print separator
        System.out.print("---------------|");
        for (int i = 0; i < sortedMinterms.size(); i++) {
            System.out.print("---|");
        }
        System.out.println();

        // Print rows
        for (String pi : primeImplicants) {
            System.out.print(String.format("%-15s| ", pi));

            for (Integer minterm : sortedMinterms) {
                if (coverage.get(pi).contains(minterm)) {
                    System.out.print(" X | ");
                } else {
                    System.out.print("   | ");
                }
            }
            System.out.println();
        }

        System.out.println("========================================");
    }

    private Set<String> findEssentialPrimeImplicants(Set<String> primeImplicants,
                                                     Map<String, Set<Integer>> coverage,
                                                     Set<Integer> originalMinterms) {
        Set<String> essentialPIs = new HashSet<>();

        // For each minterm, check if it's covered by only one prime implicant
        for (Integer minterm : originalMinterms) {
            Set<String> coveringPIs = new HashSet<>();

            // Find all PIs that cover this minterm
            for (String pi : primeImplicants) {
                if (coverage.get(pi).contains(minterm)) {
                    coveringPIs.add(pi);
                }
            }

            // If only one PI covers this minterm, it's essential
            if (coveringPIs.size() == 1) {
                essentialPIs.add(coveringPIs.iterator().next());
            }
        }

        return essentialPIs;
    }

    private Set<Integer> findCoveredMinterms(Set<String> selectedPIs,
                                             Map<String, Set<Integer>> coverage) {
        Set<Integer> coveredMinterms = new HashSet<>();

        for (String pi : selectedPIs) {
            coveredMinterms.addAll(coverage.get(pi));
        }

        return coveredMinterms;
    }

    private Set<String> findAdditionalCoverage(Set<String> allPIs,
                                               Set<String> essentialPIs,
                                               Map<String, Set<Integer>> coverage,
                                               Set<Integer> originalMinterms,
                                               Set<Integer> coveredMinterms) {
        Set<String> additionalPIs = new HashSet<>();
        Set<Integer> remainingMinterms = new HashSet<>(originalMinterms);
        remainingMinterms.removeAll(coveredMinterms);

        // Create a set of candidate PIs (all PIs minus essential ones)
        Set<String> candidatePIs = new HashSet<>(allPIs);
        candidatePIs.removeAll(essentialPIs);

        // Simple greedy algorithm: repeatedly choose the PI that covers the most uncovered minterms
        while (!remainingMinterms.isEmpty() && !candidatePIs.isEmpty()) {
            String bestPI = null;
            int maxCoverage = 0;

            for (String pi : candidatePIs) {
                Set<Integer> piCoverage = new HashSet<>(coverage.get(pi));
                piCoverage.retainAll(remainingMinterms); // Keep only uncovered minterms

                if (piCoverage.size() > maxCoverage) {
                    maxCoverage = piCoverage.size();
                    bestPI = pi;
                }
            }

            if (bestPI == null) {
                // No PI covers any remaining minterms (shouldn't happen)
                System.out.println("Warning: Could not find coverage for all minterms!");
                break;
            }

            // Add the best PI to our solution
            additionalPIs.add(bestPI);
            candidatePIs.remove(bestPI);

            // Update remaining minterms
            remainingMinterms.removeAll(coverage.get(bestPI));
        }

        return additionalPIs;
    }

    public String convertToExpression(Set<String> minimalCover, int variables) {
        if (minimalCover.isEmpty()) {
            return "0"; // Empty cover = constant 0
        }

        List<String> terms = new ArrayList<>();
        char[] varNames = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'}; // Support up to 8 variables

        for (String implicant : minimalCover) {
            StringBuilder term = new StringBuilder();

            for (int i = 0; i < implicant.length(); i++) {
                char c = implicant.charAt(i);
                if (c == '0') {
                    term.append(varNames[i]).append("'");
                } else if (c == '1') {
                    term.append(varNames[i]);
                }
                // Skip if c == '_', variable is not included in this term
            }

            if (term.length() == 0) {
                terms.add("1"); // All variables eliminated = constant 1
            } else {
                terms.add(term.toString());
            }
        }

        // Join terms with + operator
        return String.join(" + ", terms);
    }
}