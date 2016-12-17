using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoRepository;

namespace GUSDataVisualization.Models
{
    public class StandardModel : IEntity<string>
    {
        public string Id { get; set; }
        public string Kod { get; set; }
        public string Etykieta { get; set; }
        public string Rok { get; set; }
        public string Wartosc { get; set; }
        public string Jednostka { get; set; }
        public string Kategoria { get; set; }
    }
}