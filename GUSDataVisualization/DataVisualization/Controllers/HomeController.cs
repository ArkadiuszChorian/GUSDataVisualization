using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DataVisualization.Models;
using Microsoft.AspNetCore.Mvc;

namespace DataVisualization.Controllers
{
    public class HomeController : Controller
    {
        public HomeController(DAL dal)
        {
            DAL = dal;
        }
        public DAL DAL { get; set; }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetData([FromBody]RequestModel rm)
        {
            var projection = DAL.Dane.AsQueryable();

            if (!string.IsNullOrEmpty(rm.Kategoria1))
            {
                projection = projection.Where(d => d.Kategoria1 == rm.Kategoria1);
            }
            if (!string.IsNullOrEmpty(rm.Kategoria2))
            {
                projection = projection.Where(d => d.Kategoria2 == rm.Kategoria2);
            }
            if (!string.IsNullOrEmpty(rm.Kategoria3))
            {
                projection = projection.Where(d => d.Kategoria3 == rm.Kategoria3);
            }
            if (!string.IsNullOrEmpty(rm.RokOd))
            {
                projection = projection.Where(d => d.Rok.CompareTo(rm.RokOd) >= 0);
            }
            if (!string.IsNullOrEmpty(rm.RokDo))
            {
                projection = projection.Where(d => d.Rok.CompareTo(rm.RokDo) <= 0);
            }
            if (!string.IsNullOrEmpty(rm.Etykieta1))
            {
                projection = projection.Where(d => d.Etykieta1.Contains(rm.Etykieta1));
            }
            if (!string.IsNullOrEmpty(rm.Etykieta2))
            {
                projection = projection.Where(d => d.Etykieta2.Contains(rm.Etykieta2));
            }
            if (!string.IsNullOrEmpty(rm.Kod))
            {
                projection = projection.Where(d => d.Kod == rm.Kod);
            }
            if (!string.IsNullOrEmpty(rm.WartoscOd))
            {
                projection = projection.Where(d => d.Wartosc.CompareTo(rm.WartoscOd) >= 0);
            }
            if (!string.IsNullOrEmpty(rm.WartoscDo))
            {
                projection = projection.Where(d => d.Wartosc.CompareTo(rm.WartoscDo) <= 0);
            }
            var c = projection.GroupBy(x => x.Etykieta1).ToList();

            return Json(projection.ToList());
        }

        [HttpPost]
        public IActionResult GetCategories([FromBody] RequestModel rm)
        {
            var categories = DAL.Kategorie.AsQueryable();

            if (string.IsNullOrEmpty(rm?.Kategoria1))
            {
                categories = categories.Where(category => string.IsNullOrEmpty(category.ParentCategory));
            }
            else if(string.IsNullOrEmpty(rm.Kategoria2))
            {
                categories = categories.Where(category => category.ParentCategory == rm.Kategoria1);
            }
            else
            {
                categories = categories.Where(category => category.ParentCategory == rm.Kategoria2);
            }

            return Json(categories);
        }
    }
}
