using E_Tutoring_Greame.Models;

using E_Tutoring_Greame.Services;
using Microsoft.AspNetCore.Mvc;

namespace E_Tutoring_Greame.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult SignUp()
        {
            return View();
        }

        

        /*public IActionResult CreateUser(LoginModel userModel)
        {
            Security_Services securityService = new Security_Services();

            if (securityService.UniqueUser(userModel))
            {
                return View("Profile", userModel);
            }
            else
            {
                return PartialView("UsernameTaken", userModel);
            }
        }*/
    }
}
