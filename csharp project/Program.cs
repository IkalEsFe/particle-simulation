using System.Security.Cryptography;

class ParticleSimulation
{
    public static int columns;
    public static int rows;
    public static bool[,] grid = new bool[1,1];

    public static int spawnHeight;

    public static ConsoleSpinner spinner = new ConsoleSpinner();

    public static Random rnd = new Random();

    static void Main()
    {
        Console.Clear();
        Console.Write("Escribe el número de columnas: ");
        columns = Convert.ToInt32(Console.ReadLine());
        Console.Write("Escribe el número de filas: ");
        rows = Convert.ToInt32(Console.ReadLine());
        Console.Clear();
        spinner.Delay = 300;
        for (int i = 0; i < rnd.Next(5, 15); i++)
        {
            spinner.Turn($"Creando parrila con {columns} columnas y {rows} filas", 4);
        }
        Console.Clear();
        Console.Write("Aquí está tu parrilla:");
        Console.WriteLine("");
        grid = new bool[columns,rows];
        for (int i = 0; i < rows; i++)
        {
            for (int o = 0; o < columns; o++)
            {
                Console.Write("[] ");
            }
            Console.WriteLine("");
        }
        Console.WriteLine("Presiona cualquier tecla para continuar.");
        Console.ReadKey(true);
        Console.Clear();
        Console.WriteLine("Escribe a que altura quieres que salgan las partículas: ");
        spawnHeight = Console.Read();
    }

}

public class ConsoleSpinner
    {
        static string[,] sequence = null;

        public int Delay { get; set; } = 200;

        int totalSequences = 0;
        int counter;

        public ConsoleSpinner()
        {
            counter = 0;
            sequence = new string[,] {
                { "/", "-", "\\", "|" },
                { ".", "o", "0", "o" },
                { "+", "x","+","x" },
                { "V", "<", "^", ">" },
                { ".   ", "..  ", "... ", "...." },
                { "=>   ", "==>  ", "===> ", "====>" },
               // ADD YOUR OWN CREATIVE SEQUENCE HERE IF YOU LIKE
            };

            totalSequences = sequence.GetLength(0);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sequenceCode"> 0 | 1 | 2 |3 | 4 | 5 </param>
        public void Turn(string displayMsg = "", int sequenceCode = 0)
        {
            counter++;
            
            Thread.Sleep(Delay);

            sequenceCode = sequenceCode > totalSequences - 1 ? 0 : sequenceCode;

            int counterValue = counter % 4;

            string fullMessage = displayMsg + sequence[sequenceCode, counterValue];
            int msglength = fullMessage.Length;

            Console.Write(fullMessage);

            Console.SetCursorPosition(Console.CursorLeft - msglength, Console.CursorTop);
        }
    }