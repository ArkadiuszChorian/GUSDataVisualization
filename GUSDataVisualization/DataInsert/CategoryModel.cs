using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoRepository;

namespace DataInsert
{
    public class CategoryModel : IEntity<string>
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string ParentCategory { get; set; }
        public string Category { get; set; }

        public CategoryModel(string parentCategory, string category)
        {
            ParentCategory = parentCategory;
            Category = category;
        }  
    }
}
