using E_Tutoring_Greame.Models;
using E_Tutoring_Greame.SQL_C_Sharp;

namespace E_Tutoring_Greame.Services
{
    public class Security_Services
    {
        SQL SQL = new SQL();
        public bool IsValid(LoginModel user)
        {
            return SQL.FindUserByNameAndPassword(user);
        }

        public bool UniqueUser(LoginModel user)
        {
            return SQL.AddUserToDatabase(user);
        }

        public bool PasswordMatch(LoginModel user)
        {
            return SQL.CheckPasswords(user);
        }
    }
}
