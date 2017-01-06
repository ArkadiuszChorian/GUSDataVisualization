using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoRepository;

namespace DataVisualization.Models
{
    public class StandardModel : IEntity<string>
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string Kod { get; set; }
        public string Etykieta1 { get; set; }
        public string Etykieta2 { get; set; }
        public string Rok { get; set; }
        public string Wartosc { get; set; }
        public string Jednostka { get; set; }
        public string Kategoria1 { get; set; }
        public string Kategoria2 { get; set; }
        public string Kategoria3 { get; set; }
    }
}