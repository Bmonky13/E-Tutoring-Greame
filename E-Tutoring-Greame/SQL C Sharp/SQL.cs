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

namespace E_Tutoring_Greame.SQL_C_Sharp
{
    public class SQL
    {

        private void btnprimary_Click(String Username, String Password, object sender, EventArgs e)
        { 
            string connectionString;
            NpgsqlConnection cnn;
            connectionString = @"Host=db.bit.io,5432;Username=Bmonky13;Password=v2_3uK8C_jArJzeSymZ9haEmzqwgLusg;Database=Bmonky13.Classified";
            cnn = new NpgsqlConnection(connectionString);

            string txtUsernameValue = Username;
            string txtPasswordValue = Password;

            //LblInvalidCredentials.Visible = false;
            //LblSucessfulConnect.Visible = false;
            //LblMatch.Visible = false;

            try
            {
                cnn.Open();
            }
            catch (NpgsqlException)
            {
                //LblSucessfulConnect.Visible = true;
            }


            using (NpgsqlConnection newcnn = new NpgsqlConnection(connectionString))
            {
                string readerString = "SELECT * FROM logininfo";
                NpgsqlCommand command = new NpgsqlCommand(readerString, newcnn);

                try
                {
                    newcnn.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Console.WriteLine("userid: {0}, username: {1}, password: {2}", reader.GetInt32(0), reader.GetString(1), reader.GetString(2));


                            if (txtUsernameValue == reader.GetString(1) && txtPasswordValue == reader.GetString(2)) //Equals
                            {
                                //PannelLogin.Visible = false;
                                //PannelDashboard.Visible = true;
                                //LblMatch.Visible = true;
                                Console.WriteLine("Match!");
                                //UsernameMatch = reader.GetString(1);
                                //PasswordMatch = reader.GetString(2);
                                //LblMatchedUsername.Text = UsernameMatch;
                                break;
                            }

                        }
                        /*if (LblMatch.Visible == false)
                        {
                            LblInvalidCredentials.Visible = true;
                        }*/
                    }
                }
                catch (NpgsqlException)
                {
                    //LblSucessfulConnect.Visible = true;
                }

            }
            cnn.Close();

        }
    }
}
