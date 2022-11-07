using E_Tutoring_Greame.Models;
using E_Tutoring_Greame.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace E_Tutoring_Greame.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult NextPage(LoginModel user)
        {
            if(user != null)
            {
                return View("Worksheet", user);
            }
            else
            {
                return PartialView("InvalidCredentials", user);
            }
        }

        public IActionResult ProcessLogin(LoginModel userModel)
        {
            Security_Services securityService = new Security_Services();

            if (securityService.IsValid(userModel))
            {
                return View("Worksheet", userModel);
            }
            else
            {
                return PartialView("InvalidCredentials", userModel);
            }

        }
    }
}