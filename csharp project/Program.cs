using System;

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
    public static int createdParticles;

    public static bool particleCreated;

    public static ConsoleSpinner spinner = new ConsoleSpinner();

    public static Random rnd = new Random();

    public static DateTime time = DateTime.Now;
    public static string filePath = $"simulations/simulation-{time.Day}.{time.Month}.{time.Year}-{time.Hour}.{time.Minute}.{time.Second}.{time.Millisecond}";
    public static StreamWriter rw = File.CreateText(filePath);
    public static int frame = 0;

    static void Main()
    {
        rw.AutoFlush = true;
        Console.Clear();
        Console.Write("Escribe el número de columnas: ");
        columns = Convert.ToInt32(Console.ReadLine());
        Console.Write("Escribe el número de filas: ");
        rows = Convert.ToInt32(Console.ReadLine());
        Console.Clear();
        grid = new bool[columns,rows];
        spinner.Delay = 300;
        for (int i = 0; i < rnd.Next(5, 15); i++)
        {
            spinner.Turn($"Creando parrila con {columns} columnas y {rows} filas", 4);
        }
        Console.Clear();
        Console.Write("Aquí está tu parrilla:");
        Console.WriteLine("");
        for (int i = 0; i < rows; i++)
        {
            for (int o = 0; o < columns; o++)
            {
                Console.Write("[ ] ");
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

        while(createdParticles <= particleAmount)
        {
            Loop();
            // Console.WriteLine($"La posición es: {currentPosX}, {currentPosY}");
            // Console.WriteLine("Presiona [Enter] para continuar.");
            // Console.ReadLine();
            Thread.Sleep(1000/100);
            // Console.WriteLine("Escribiendo archivo...");
        }
        Console.WriteLine($"El archivo contiene {frame} frames.");
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

    public static async Task WriteFileAsyinc()
    {
        await rw.WriteLineAsync($"frame {frame}");
        for (int i = 0; i < rows; i++)
        {
            for (int o = 0; o < columns; o++)
            {
                if (grid[i,o])
                {
                    await rw.WriteAsync($"({i},{o})");
                }
            }
        }
        await rw.WriteLineAsync("");
        frame++;
    }
    public static void WriteFile()
    {
        rw.WriteLine($"frame {frame}");
        for (int i = 0; i < rows; i++)
        {
            for (int o = 0; o < columns; o++)
            {
                if (grid[i,o])
                {
                    rw.Write($"({i},{o})");
                }
            }
        }
        rw.WriteLine("");
        frame++;
    }

    public static void Loop()
    {
        Console.Clear();
        if(!particleCreated)
        {
            createdParticles++;
            if(createdParticles > particleAmount)
            {
                ShowGrid();
                WriteFile();
                return;
            }
            particleCreated = true;
            currentPosX = rnd.Next(0, columns);
            currentPosY = rows-spawnHeight;
            grid[currentPosY,currentPosX] = true;
            ShowGrid();
            WriteFile();
            return;
        }
        randomValue = rnd.Next(0, 100);
        if (randomValue < upChance)
        {
            MoveUpwards();
        }
        else if (randomValue < downChance)
        {
            MoveDownwards();
        }
        else if (randomValue < rightChance)
        {
            MoveRight();
        }
        else if (randomValue <= leftChance)
        {
            MoveLeft();
        }
        ShowGrid();
        WriteFile();
    }

    public static void MoveUpwards()
    {
        if(rows-currentPosY > rows-1)
        {
            grid[currentPosY,currentPosX] = false;
            particleCreated = false;
        }
        else if (grid[currentPosY-1,currentPosX])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosY--;
            grid[currentPosY,currentPosX] = true;
        }
    }

    public static void MoveDownwards()
    {
        if(rows-(currentPosY+2) < 0)
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
            grid[currentPosY,currentPosX] = true;
        }
    }

    public static void MoveLeft()
    {
        if(currentPosX-1 < 0)
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX = columns-1;
        }
        else if (grid[currentPosY,currentPosX-1])
        {
            particleCreated = false;
        }
        else
        {
            grid[currentPosY,currentPosX] = false;
            currentPosX--;
            grid[currentPosY,currentPosX] = true;
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
        grid[currentPosY,currentPosX] = true;
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