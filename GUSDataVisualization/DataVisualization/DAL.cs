﻿using DataVisualization.Models;
using MongoRepository;

namespace DataVisualization
{
    public class DAL
    {
        private const string ConnectionString = "mongodb://gus:gus@ds135798.mlab.com:35798/gusdatavisualization";
        public MongoRepository<StandardModel, string> Dane { get; set; } = new MongoRepository<StandardModel, string>(ConnectionString, "Dane");
    }
}
