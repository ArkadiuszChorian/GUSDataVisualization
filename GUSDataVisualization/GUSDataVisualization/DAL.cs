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
            var connectionString = ConfigurationManager.ConnectionStrings["MongoServerSettings"].ConnectionString;

            Dane = new MongoRepository<StandardModel, string>(connectionString, "Dane");
        }

        public MongoRepository<StandardModel, string> Dane { get; set; }
    }
}
