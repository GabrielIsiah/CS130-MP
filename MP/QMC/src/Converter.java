public class Converter {
    public StringBuilder convertToBinary(int input){
        StringBuilder sb = new StringBuilder();

        do{
            if (input % 2 != 0){
                input -= 1;
                input /= 2;
                sb.insert(0,1);
            } else {
                input /= 2;
                sb.insert(0,0);
            }
        } while (input != 0);
        
        return sb;
    }
}
