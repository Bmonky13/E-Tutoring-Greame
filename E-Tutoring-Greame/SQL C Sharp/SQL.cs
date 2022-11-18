using E_Tutoring_Greame.Models;

using Devart.Data.PostgreSql;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using FormEncode.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Windows;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;




namespace E_Tutoring_Greame.SQL_C_Sharp
{
    
    public class SQL
    {
        public void veiwSignUp()
        {

        }

        String connString = @"Host=db.bit.io,5432;Username=Bmonky13;Password=v2_3uK8C_jArJzeSymZ9haEmzqwgLusg;Database=Bmonky13.Classified";

            public bool FindUserByNameAndPassword(LoginModel user)
            {
                bool success = false;

                string sqlStatement = "SELECT * FROM logininfo WHERE username = @username AND password = @password";
                using (NpgsqlConnection conn = new NpgsqlConnection(connString))
                {
                    NpgsqlCommand cmd = new NpgsqlCommand(sqlStatement, conn);
                    cmd.Parameters.Add("@username", NpgsqlTypes.NpgsqlDbType.Varchar, 255).Value = user.Username;
                    cmd.Parameters.Add("@password", NpgsqlTypes.NpgsqlDbType.Varchar, 255).Value = user.Password;

                    try
                    {
                        conn.Open();
                        NpgsqlDataReader reader = cmd.ExecuteReader();

                        if (reader.HasRows)
                        {
                            success = true;
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
                return success;
            }

            /*using (var cmd = new NpgsqlCommand("select * from test", conn))
            {
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        user = reader.GetString(1);
                        Console.WriteLine(user);
                    }
                }
            }*/

        

            public bool CheckUniqueUser(LoginModel user)
            {
                bool success = false;

                string checkUsers = "SELECT * FROM logininfo";
                using (NpgsqlConnection conn = new NpgsqlConnection(connString))
                {
                    string username = "";
                    int noMatch = 0;
                    int counter = 0;

                    NpgsqlCommand cmd = new NpgsqlCommand(checkUsers, conn);

                    try
                    {
                        conn.Open();
                        NpgsqlDataReader reader = cmd.ExecuteReader();

                        while (reader.Read())
                        {
                            username = reader.GetString(1);
                            if (user.Username != username)
                            {
                                noMatch++;
                            }
                            counter++;
                        }
                        if (counter == noMatch)
                        {
                            success = true;
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
                return success;
            }
            
          

            public bool AddUserToDatabase(LoginModel user)
            {
                bool success = false;

                string sqlStatement = "INSERT INTO logininfo (userid, username, password) VALUES (@id, @username, @password)";
                using (NpgsqlConnection conn = new NpgsqlConnection(connString))
                {

                    if ((CheckUniqueUser(user)) && (user.PasswordCheck == user.Password))
                    {
                        NpgsqlCommand cmd = new NpgsqlCommand(sqlStatement, conn);
                        cmd.Parameters.Add("@username", NpgsqlTypes.NpgsqlDbType.Varchar, 255).Value = user.Username;
                        cmd.Parameters.Add("@password", NpgsqlTypes.NpgsqlDbType.Varchar, 255).Value = user.Password;
                        cmd.Parameters.Add("@id", NpgsqlTypes.NpgsqlDbType.Integer, 255).Value = getID() + 1;
                        
                        try
                        {
                            conn.Open();
                            NpgsqlDataReader reader = cmd.ExecuteReader();
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                        }
                        success = true;
                    }
                    else
                    {
                        Console.WriteLine("Passwords do not match.");
                    }
                }
                return success;
            }

            public int getID()
            {
                int ID = 0;
                using (NpgsqlConnection conn = new NpgsqlConnection(connString))
                {
                    string selectIDstring = "SELECT userid FROM logininfo ORDER BY userid Asc";
                    NpgsqlCommand command = new NpgsqlCommand(selectIDstring, conn);

                    try
                    {
                        conn.Open();
                        var getID = command.ExecuteReader();

                        while (getID.Read())
                        {
                            ID = getID.GetInt32(0);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
                return ID;
            }

            public bool CheckPasswords(LoginModel user)
            {
                if(user.Password == user.PasswordCheck)
                {
                    return true;
                }
                else
                {
                    return false;  
                }
            }

        }
}
