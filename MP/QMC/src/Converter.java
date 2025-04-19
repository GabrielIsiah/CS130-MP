public class Converter {
    public StringBuilder[] convertMintermsToBinary(int[] input) {
        StringBuilder[] sbArray = new StringBuilder[input.length];

        for (int i = 0; i < input.length; i++){
            StringBuilder sb = new StringBuilder();
            int current = input[i];

            do{
                int remainder = current % 2;
                sb.insert(0, remainder);
                current /= 2;

            } while (current != 0); // do the above while current is not = 0

            sbArray[i] = sb;
        }

        for (StringBuilder current : sbArray) {
            while (current.length() < 6) {
                current.insert(0, 0);
            }
        }
        return sbArray;
    }

    public void convertVariablesToBinary(){

    }

}
