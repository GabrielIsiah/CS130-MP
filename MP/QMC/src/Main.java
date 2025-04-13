import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Converter converter = new Converter();

        int input = scanner.nextInt();
        System.out.println(converter.convertToBinary(input));
    }
}