using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace DataInsert
{
    class Program
    {
        //public static string RootDir = AppDomain.CurrentDomain.BaseDirectory.Remove(AppDomain.CurrentDomain.BaseDirectory.IndexOf("bin/Debug"));
        //public static string RootDir = AppDomain.CurrentDomain.BaseDirectory.Replace("bin\\Debug", string.Empty) + "Dane\\";
        public static string BaseDir = AppDomain.CurrentDomain.BaseDirectory.Replace("bin\\Debug", string.Empty) + "Dane\\";
        static void Main(string[] args)
        {
            var DAL = new DAL();

            //Kod;etykieta;rok;wartosc;jednostka

            //Kod;etykieta;rok;wartosc;jednostka;plec
            // Ludnosc wedlugo wieku i plci
            // Bezrobocie wedlug wieku i plci
            //Kod;etykieta;rok;wartosc;jednostka;rodzaj egzaminu
            // Szkolnictwo > egzamin gimnazjalny
            //Kod;etykieta;rok;wartosc;jednostka;typ szkoly
            // szkolnictwo > szkoly > wyzsze
            var categories = new List<Tuple<string, string, string>>
            {             
                new Tuple<string, string, string>("Ceny", "Kultura", string.Empty),
                new Tuple<string, string, string>("Ceny", "Mieszkanie", string.Empty),
                new Tuple<string, string, string>("Ceny", "Transport", string.Empty),
                new Tuple<string, string, string>("Ceny", "Zdrowie", string.Empty),
                new Tuple<string, string, string>("Ceny", "Zywnosc", string.Empty),

                new Tuple<string, string, string>("Dochody", "Do dyspozycji na mieszkanca", string.Empty),
                new Tuple<string, string, string>("Dochody", "PKB na mieszkanca", string.Empty),
                new Tuple<string, string, string>("Dochody", "Przecietne wynagrodzenie", string.Empty),

                new Tuple<string, string, string>("Kultura", "Liczba imprez", string.Empty),
                new Tuple<string, string, string>("Kultura", "Liczba teatrow i sluchaczy", string.Empty),

                new Tuple<string, string, string>("Ludnosc", "Gestosc zaludnienia", string.Empty),
                new Tuple<string, string, string>("Ludnosc", "Gospodarstwa domowe", "Dochod na osobe"),
                new Tuple<string, string, string>("Ludnosc", "Gospodarstwa domowe", "Wydatki na osobe"),
                new Tuple<string, string, string>("Ludnosc", "Ludnosc w miastach", string.Empty),
                new Tuple<string, string, string>("Ludnosc", "Ludnosc wg wieku i plci", string.Empty),

                new Tuple<string, string, string>("Mieszkania", string.Empty, string.Empty),

                new Tuple<string, string, string>("Ochrona zdrowia", "Apteki", string.Empty),
                new Tuple<string, string, string>("Ochrona zdrowia", "Lekarze", string.Empty),
                new Tuple<string, string, string>("Ochrona zdrowia", "Szpitale", string.Empty),
                new Tuple<string, string, string>("Ochrona zdrowia", "Zachorowania", string.Empty),

                new Tuple<string, string, string>("Praca", "Bezrobocie wg wieku i plci", string.Empty),
                new Tuple<string, string, string>("Praca", "Bezrobocie wg wyksztalcenia", string.Empty),
                new Tuple<string, string, string>("Praca", "Miejsca pracy", string.Empty),

                new Tuple<string, string, string>("Przestepstwa", string.Empty, string.Empty),

                new Tuple<string, string, string>("Szkolnictwo", "Egzamin gimnazjalny", string.Empty),
                new Tuple<string, string, string>("Szkolnictwo", "Egzamin maturalny", string.Empty),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Gimnazja"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Licea"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Podstawowki"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Policealne"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Przedszkola"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Wyzsze"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Zasadnicze zawodowe"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Zawodowe i artystyczne"),
                new Tuple<string, string, string>("Szkolnictwo", "Szkoly", "Zlobki"),

                new Tuple<string, string, string>("Transport", "Drogi", "Ekspresowe i autostrady"),
                new Tuple<string, string, string>("Transport", "Drogi", "Twarde ulepszone"),
                new Tuple<string, string, string>("Transport", "Komunikacja miejska", string.Empty),
                new Tuple<string, string, string>("Transport", "Sciezki rowerowe", string.Empty)
            };           

            //foreach (var category in categories)
            //{
            //    if (!DAL.Kategorie.Exists(category2 => category2.Category == category.Item1))
            //    {
            //        DAL.Kategorie.Add(new CategoryModel(string.Empty, category.Item1));
            //    }
            //    if (!string.IsNullOrEmpty(category.Item2) && !DAL.Kategorie.Exists(category2 => category2.Category == category.Item2))
            //    {
            //        DAL.Kategorie.Add(new CategoryModel(category.Item1, category.Item2));
            //    }
            //    if (!string.IsNullOrEmpty(category.Item3) && !DAL.Kategorie.Exists(category2 => category2.Category == category.Item3))
            //    {
            //        DAL.Kategorie.Add(new CategoryModel(category.Item2, category.Item3));
            //    }
            //}           

            foreach (var category in categories)
            {
                DAL.Kategorie.Add(new CategoryModel(category.Item1, category.Item2, category.Item3));
            }

            //using (var sr = new StreamReader(RootDir + "Dane/Ceny/Kultura/dane.csv", Encoding.UTF8))
            foreach (var category in categories)
            {
                Console.WriteLine("START: " + category.Item1 + "/" + category.Item2 + "/" + category.Item3);

                var categoryPath = category.Item1 
                    + (string.IsNullOrEmpty(category.Item2) ? "" : "/" + category.Item2) 
                    + (string.IsNullOrEmpty(category.Item3) ? "" : "/" + category.Item3);

                using (var sr = new StreamReader(BaseDir + categoryPath + "/dane.csv", Encoding.UTF8))
                {
                    var line = sr.ReadLine();
                    string[] splitted;

                    while (!sr.EndOfStream)
                    {
                        line = sr.ReadLine();
                        splitted = line.Split(';');

                        var newData = new StandardModel
                        {
                            Kod = splitted[0],
                            Etykieta1 = splitted[1],
                            Rok = splitted[2],
                            Wartosc = splitted[3],
                            Jednostka = splitted[4],
                            Etykieta2 = splitted.Length == 6 ? splitted[5] : string.Empty,
                            Kategoria1 = category.Item1,
                            Kategoria2 = category.Item2,
                            Kategoria3 = category.Item3
                        };

                        DAL.Dane.Add(newData);
                    }
                }

                Console.WriteLine("END: " + category.Item1 + "/" + category.Item2 + "/" + category.Item3);
                Console.WriteLine("------------------------------------------------------");
            }          
        }
    }
}
