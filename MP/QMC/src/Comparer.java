import java.util.*;

public class Comparer {
    public void compareMinterms(Map<Integer, List<StringBuilder>> binaryGrouping, Map<Integer, List<Integer>> mintermGrouping) {
        Map<Integer, List<StringBuilder>> newGrouping = new HashMap<>();
        List<Integer> sortedKeys = new ArrayList<>(binaryGrouping.keySet());
        Collections.sort(sortedKeys);
        Map<String, Set<Integer>> implicantToMinterms = new HashMap<>();
        Set<String> uniquePrimeImplicants = new HashSet<>();
        boolean changesMade = true;
        int iteration = 1;

        // map of binary minterm → decimal minterm
        for (Map.Entry<Integer, List<Integer>> entry : mintermGrouping.entrySet()) {
            for (Integer minterm : entry.getValue()) {
                String binary = String.format("%4s", Integer.toBinaryString(minterm)).replace(' ', '0');
                implicantToMinterms.put(binary, new HashSet<>(Set.of(minterm)));
            }
        }

        while (changesMade && sortedKeys.size() > 1) {
            System.out.println("\n========================");
            System.out.println("Iteration " + iteration + " Start");
            System.out.println("========================");

            changesMade = false;
            newGrouping.clear();
            Set<StringBuilder> usedThisRound = new HashSet<>();

            System.out.println("\nCurrent Binary Grouping:");
            for (int key : sortedKeys) {
                System.out.println("Group " + key + " → " + binaryGrouping.get(key));
            }

            // Compare adjacent groups
            for (int i = 0; i < sortedKeys.size() - 1; i++) {
                int currentKey = sortedKeys.get(i);
                int nextKey = sortedKeys.get(i + 1);

                List<StringBuilder> currentGroup = binaryGrouping.get(currentKey);
                List<StringBuilder> nextGroup = binaryGrouping.get(nextKey);

                System.out.printf("\nComparing Group %d and Group %d\n", currentKey, nextKey);

                for (StringBuilder current : currentGroup) {
                    boolean merged = false;

                    for (StringBuilder toCompare : nextGroup) {
                        StringBuilder newMinterm = new StringBuilder(current.toString());
                        int difference = 0, index = 0;

                        for (int j = 0; j < current.length(); j++) {
                            if (current.charAt(j) != toCompare.charAt(j)) {
                                difference++;
                                index = j;
                            }
                        }

                        if (difference == 1) {
                            merged = true;
                            changesMade = true;
                            newMinterm.setCharAt(index, '_');
                            System.out.printf("Merged: %s + %s → %s\n", current, toCompare, newMinterm);

                            newGrouping.computeIfAbsent(currentKey, k -> new ArrayList<>()).add(newMinterm);
                            usedThisRound.add(current);
                            usedThisRound.add(toCompare);

                            String newKey = newMinterm.toString();
                            Set<Integer> combined = new HashSet<>();
                            combined.addAll(implicantToMinterms.getOrDefault(current.toString(), Set.of()));
                            combined.addAll(implicantToMinterms.getOrDefault(toCompare.toString(), Set.of()));
                            implicantToMinterms.put(newKey, combined);
                        }
                    }

                    if (!merged) {
                        System.out.println("Not Merged: " + current);
                    }
                }
            }

            // Handle terms that were not used
            System.out.println("\nPrime Implicants from unused terms:");
            for (Map.Entry<Integer, List<StringBuilder>> entry : binaryGrouping.entrySet()) {
                for (StringBuilder term : entry.getValue()) {
                    if (!usedThisRound.contains(term)) {
                        System.out.println("Adding: " + term);
                        uniquePrimeImplicants.add(term.toString());
                    }
                }
            }

            // Update for next round
            binaryGrouping.clear();
            binaryGrouping.putAll(newGrouping);
            sortedKeys = new ArrayList<>(binaryGrouping.keySet());
            Collections.sort(sortedKeys);

            System.out.println("\nUpdated Binary Grouping for Next Iteration:");
            for (int key : sortedKeys) {
                System.out.println("Group " + key + " → " + binaryGrouping.get(key));
            }

            if (!changesMade) {
                System.out.println("No more merges possible. Exiting loop.");
            }

            iteration++;
        }

        // Final merged terms
        System.out.println("\nFinal Step — Remaining merged terms (if any):");
        for (Map.Entry<Integer, List<StringBuilder>> entry : binaryGrouping.entrySet()) {
            for (StringBuilder term : entry.getValue()) {
                if (term.toString().contains("_")) {
                    System.out.println("Adding merged implicant: " + term);
                    uniquePrimeImplicants.add(term.toString());
                }
            }
        }

        // Final result
        System.out.println("\nFinal Prime Implicants and Their Coverage:");
        for (String pi : uniquePrimeImplicants) {
            Set<Integer> minterms = implicantToMinterms.getOrDefault(pi, Set.of());
            System.out.println(pi + " → " + minterms);

        }
    }
}
