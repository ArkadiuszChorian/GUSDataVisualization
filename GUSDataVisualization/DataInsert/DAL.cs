using MongoRepository;

namespace DataInsert
{
    public class DAL
    {
        private const string ConnectionString = "mongodb://gus:gus@ds135798.mlab.com:35798/gusdatavisualization";
        public MongoRepository<StandardModel, string> Dane { get; set; } = new MongoRepository<StandardModel, string>(ConnectionString, "Dane");
        public MongoRepository<CategoryModel, string> Kategorie { get; set; } = new MongoRepository<CategoryModel, string>(ConnectionString, "Kategorie");
    }
}
