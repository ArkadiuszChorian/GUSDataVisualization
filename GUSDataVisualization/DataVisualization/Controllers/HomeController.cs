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
        public IActionResult GetData(RequestModel rm)
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
                projection = projection.Where(d => int.Parse(d.Rok) >= int.Parse(rm.RokOd));
            }
            if (!string.IsNullOrEmpty(rm.RokDo))
            {
                projection = projection.Where(d => int.Parse(d.Rok) <= int.Parse(rm.RokDo));
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
                projection = projection.Where(d => int.Parse(d.Wartosc) >= int.Parse(rm.WartoscOd));
            }
            if (!string.IsNullOrEmpty(rm.WartoscDo))
            {
                projection = projection.Where(d => int.Parse(d.Wartosc) <= int.Parse(rm.WartoscDo));
            }

            return Json(projection.ToList());
        }
    }
}
