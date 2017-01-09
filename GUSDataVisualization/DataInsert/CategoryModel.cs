using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoRepository;

namespace DataInsert
{
    public class CategoryModel : IEntity<string>
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string Kategoria1 { get; set; }
        public string Kategoria2 { get; set; }
        public string Kategoria3 { get; set; }

        public CategoryModel(string kategoria1, string kategoria2, string kategoria3)
        {
            Kategoria1 = kategoria1;
            Kategoria2 = kategoria2;
            Kategoria3 = kategoria3;
        }  
    }
}
