using System;
using System.Configuration;
using GUSDataVisualization.Models;
using MongoRepository;

namespace GUSDataVisualization
{
    public class DAL
    {
        private static readonly Lazy<DAL> Lazy = new Lazy<DAL>(() => new DAL());
        public static DAL Instance => Lazy.Value;

        private DAL()
        {
            Ceny = new MongoRepository<StandardModel, string>(_cs, "Ceny");
            Dochody = new MongoRepository<StandardModel, string>(_cs, "Dochody");
            Kultura = new MongoRepository<StandardModel, string>(_cs, "Kultura");
            Ludnosc = new MongoRepository<StandardModel, string>(_cs, "Ludnosc");
            Mieszkania = new MongoRepository<StandardModel, string>(_cs, "Mieszkania");
            OchronaZdrowia = new MongoRepository<StandardModel, string>(_cs, "OchronaZdrowia");
            Praca = new MongoRepository<StandardModel, string>(_cs, "Praca");
            Przestepstwa = new MongoRepository<StandardModel, string>(_cs, "Przestepstwa");
            Szkolnictwo = new MongoRepository<StandardModel, string>(_cs, "Szkolnictwo");
            Transport = new MongoRepository<StandardModel, string>(_cs, "Transport");
        }
        private static string _cs = ConfigurationManager.ConnectionStrings["MongoServerSettings"].ConnectionString;

        public MongoRepository<StandardModel, string> Ceny { get; set; }
        public MongoRepository<StandardModel, string> Dochody { get; set; }
        public MongoRepository<StandardModel, string> Kultura { get; set; }
        public MongoRepository<StandardModel, string> Ludnosc { get; set; }
        public MongoRepository<StandardModel, string> Mieszkania { get; set; }
        public MongoRepository<StandardModel, string> OchronaZdrowia { get; set; }
        public MongoRepository<StandardModel, string> Praca { get; set; }
        public MongoRepository<StandardModel, string> Przestepstwa { get; set; }
        public MongoRepository<StandardModel, string> Szkolnictwo { get; set; }
        public MongoRepository<StandardModel, string> Transport { get; set; }
    }
}
