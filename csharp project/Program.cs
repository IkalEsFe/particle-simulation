using System.Security.Cryptography;

class ParticleSimulation
{
    public static int columns;
    public static int rows;
    public static bool[,] grid = new bool[1,1];
    public static int currentPosX;
    public static int currentPosY;
    public static int spawnHeight;
    public static int upChance;
    public static int downChance;
    public static int rightChance;
    public static int leftChance;
    public static int randomValue;
    public static int particleAmount;

    public static bool particleCreated;

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
        Console.WriteLine("Presiona [Enter] para continuar.");
        Console.ReadLine();
        Console.Clear();


        Console.WriteLine("Escribe a que altura quieres que salgan las partículas: ");
        spawnHeight = Convert.ToInt32(Console.ReadLine());
        Console.Clear();

        Console.WriteLine("Escribe la cantidad de partículas que quieres simular: ");
        particleAmount = Convert.ToInt32(Console.ReadLine());
        Console.Clear();

        Console.WriteLine("A continuación decidiras las probabilidades de movimiento de la partícula.");
        Console.WriteLine("Asegurate de que la suma de las probabilidades no exceda 100, eligiras entre arriba, abajo, derecha e izquierda.");
        Console.WriteLine("Presiona [Enter] para continuar.");
        Console.ReadLine();
        Console.Clear();

        ChooseChances();

        for(int i = 0; i < particleAmount; i++)
        {
            Loop();
            Console.WriteLine("Presiona [Enter] para continuar.");
            Console.ReadLine();
            // Thread.Sleep(1000/2);
        }
    }

    public static void ChooseChances()
    {
        Console.WriteLine("Escribe la probabilidad de que la particula se mueva hacia arriba: ");
        upChance = Convert.ToInt32(Console.ReadLine());

        Console.WriteLine("Escribe la probabilidad de que la particula se mueva hacia abajo: ");
        downChance = Convert.ToInt32(Console.ReadLine());

        Console.WriteLine("Escribe la probabilidad de que la particula se mueva hacia la derecha: ");
        rightChance = Convert.ToInt32(Console.ReadLine());
        
        Console.WriteLine("Escribe la probabilidad de que la particula se mueva hacia la izquierda: ");
        leftChance = Convert.ToInt32(Console.ReadLine());

        if(upChance + downChance + rightChance + leftChance != 100)
        {
            Console.Clear();
            Console.WriteLine("La suma de los valores no da 100, porfavor repitelos:");
            ChooseChances();
        }
        else
        {
            downChance = upChance+downChance;
            rightChance = downChance+rightChance;
            leftChance = rightChance+leftChance;
        }
    }

    public static void ShowGrid()
    {
        for (int i = 0; i < rows; i++)
        {
            for (int o = 0; o < columns; o++)
            {
                if (grid[i,o])
                {
                    Console.Write("[O] ");
                }
                else
                {
                    Console.Write("[ ] ");
                }
            }
            Console.WriteLine("");
        }
    }

    public static void Loop()
    {
        Console.Clear();
        if(!particleCreated)
        {
            particleCreated = true;
            currentPosX = rnd.Next(0, columns);
            currentPosY = rows-spawnHeight;
            grid[currentPosY,currentPosX] = true;
            ShowGrid();
            return;
        }
        randomValue = rnd.Next(0, 100);
        if (randomValue < upChance)
        {
            Console.WriteLine("Arriba!");
            MoveUpwards();
        }
        else if (randomValue < downChance)
        {
            Console.WriteLine("Abajo!");
            MoveDownwards();
        }
        else if (randomValue < rightChance)
        {
            Console.WriteLine("Derecha!");
            MoveRight();
        }
        else if (randomValue <= leftChance)
        {
            Console.WriteLine("Izquierda!");
            MoveLeft();
        }
        grid[currentPosY,currentPosX] = true;
        ShowGrid();
    }

    public static void MoveUpwards()
    {
        if(rows-(currentPosY-1) > rows-1)
        {
            particleCreated = false;
            grid[currentPosY,currentPosX] = false;
        }
        else if (grid[currentPosY-1,currentPosX])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosY--;
        }
    }

    public static void MoveDownwards()
    {
        if(rows-(currentPosY+1) < 0)
        {
            particleCreated = false;
        }
        else if (grid[currentPosY+1,currentPosX])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosY++;
        }
    }

    public static void MoveLeft()
    {
        if(currentPosX-1 < 0)
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX = columns;
        }
        else if (grid[currentPosY,currentPosX-1])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX--;
        }
    }

    public static void MoveRight()
    {
        if(currentPosX+1 > columns-1)
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX = 0;
        }
        else if (grid[currentPosY,currentPosX+1])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX++;
        }
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