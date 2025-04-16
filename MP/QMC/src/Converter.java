public class Converter {
    public StringBuilder[] convertMintermsToBinary(int[] input) {
        StringBuilder[] sbArray = new StringBuilder[input.length];

        for (int i = 0; i < sbArray.length; i++){
            StringBuilder sb = new StringBuilder();
            int current = input[i];

            do{
                if (current % 2 != 0){  // if there is a remainder from dividing current by 2
                    current = (current-1) / 2; // subtract 1 then divide current by 2
                    sb.insert(0,1); // insert 1 because it is current's remainder
                } else {
                    current /= 2; // else current is divisible by 2 so there is no remainder
                    sb.insert(0,0); // insert 0
                }
            } while (current != 0); // do the above while current is not = 0

            if (sb.length() < 6){
                int howShort = 6 - sb.length();
                for (int j = 0; j < howShort; j++){
                    sb.insert(0,0);
                }
            }
            sbArray[i] = sb;
        }
        return sbArray;
    }

    public void convertVariablesToBinary(){

    }

}
