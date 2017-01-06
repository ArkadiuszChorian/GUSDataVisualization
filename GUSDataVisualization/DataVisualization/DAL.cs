using System;
using System.Configuration;
using DataVisualization.Models;
using Microsoft.Extensions.Configuration;
using MongoRepository;

namespace DataVisualization
{
    public class DAL
    {
        //private static readonly Lazy<DAL> Lazy = new Lazy<DAL>(() => new DAL());
        //public static DAL Instance => Lazy.Value;
        public IConfiguration Configuration { get; set; }

        //private DAL()
        public DAL(IConfiguration configuration)
        {
            Configuration = configuration;
            //var connectionString = ConfigurationManager.ConnectionStrings["MongoServerSettings"].ConnectionString;
            var connectionString = Configuration.GetConnectionString("MongoServerSettings");

            Dane = new MongoRepository<StandardModel, string>(connectionString, "Dane");
        }

        public MongoRepository<StandardModel, string> Dane { get; set; }
    }
}
