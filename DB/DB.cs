using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DB
{
    public class DB
    {
        public SqlConnection cn;

        public DB()
        {
            string connection = @"server=WIN-14Q9V59B957;database=EC;UID=sa;PWD=1234";
            cn = new SqlConnection
            {
                ConnectionString = connection
            };
        }

        public bool Login(string _strLoginID, string _strLoginPWD) //登入 //傳回使用者輸入的帳號密碼是否存在
        {
            cn.Open();
            SqlCommand cm;
            string strCm = @"SELECT PWD 
            FROM [MANAGER_ACCOUNT] 
            WHERE LOGIN_ID = '" + _strLoginID + "'"
            + "COLLATE Chinese_Taiwan_Stroke_BIN";
            cm = new SqlCommand(strCm, cn);
            SqlDataReader dr = cm.ExecuteReader();
            string strLoginPWD = "";
            if (dr.Read())
                strLoginPWD = Convert.ToString(dr[0]);
            cn.Close();
            cn.Dispose();
            return _strLoginPWD == strLoginPWD;
        }

        public string Search(string strID_1, string strID_2, string strLoginID,string strCreatTime, string strLastName, string strFirstName,
                             string strGender, string strdBirthday, string strPhoneNumber,string strPostaCode, string strAddress, string strEmail)
        {
            cn.Open();
            SqlCommand cm;
            StringBuilder strCm = new StringBuilder();
            strCm.AppendLine("SELECT ID,LOGIN_ID,ACCOUNT_LEVEL,TYPE,LAST_NAME,FIRST_NAME,GENDER,BIRTHDAY,EMAIL,EMAIL_UPDATE,PHONENUM,POSTA_CODE,ADDRESS,CREAT_IP,CREAT_TIME FROM[ACCOUNT] WHERE");
            if (!String.IsNullOrEmpty(strID_2)) 
                strCm.AppendLine("(ID BETWEEN '" + strID_1 + "' AND '" + strID_2 + "') AND ");
            if (!String.IsNullOrEmpty(strLoginID))
                strCm.AppendLine("LOGIN_ID = '" + strLoginID + "' AND ");
            //strCm.AppendLine("(CREAT_TIME BETWEEN '" + strCreatTime + "' AND '" + strCreatTime + "') AND ");
            if (!String.IsNullOrEmpty(strLastName))
                strCm.AppendLine("LAST_NAME = '" + strLastName + "' AND ");
            if (!String.IsNullOrEmpty(strFirstName))
                strCm.AppendLine("FIRST_NAME = '" + strFirstName + "' AND ");
            //strCm.AppendLine("GENDER = '" + strGender + "' AND ");
            //strCm.AppendLine("(BIRTHDAY BETWEEN '" + strdBirthday + "' AND '" + strdBirthday + "') AND ");
            if (!String.IsNullOrEmpty(strEmail))
                strCm.AppendLine("EMAIL = '" + strEmail + "' AND ");
            if (!String.IsNullOrEmpty(strPhoneNumber))
                strCm.AppendLine("PHONENUM = '" + strPhoneNumber + "' AND ");
            if (!String.IsNullOrEmpty(strPostaCode))
                strCm.AppendLine("POSTA_CODE = '" + strPostaCode + "' AND ");
            if (!String.IsNullOrEmpty(strAddress))
                strCm.AppendLine("ADDRESS = '" + strAddress + "' AND ");
            strCm.Remove(strCm.Length - 7 ,5);
            cm = new SqlCommand(Convert.ToString(strCm), cn);
            SqlDataReader dr = cm.ExecuteReader();

            DataTable table = new DataTable(); //建立DataTable
            //DataTable加入欄位
            table.Columns.Add(new DataColumn("ID")); 
            table.Columns.Add(new DataColumn("LOGIN_ID"));
            table.Columns.Add(new DataColumn("ACCOUNT_LEVEL"));
            table.Columns.Add(new DataColumn("TYPE"));
            table.Columns.Add(new DataColumn("LAST_NAME"));
            table.Columns.Add(new DataColumn("FIRST_NAME"));
            table.Columns.Add(new DataColumn("GENDER"));
            table.Columns.Add(new DataColumn("BIRTHDAY"));
            table.Columns.Add(new DataColumn("EMAIL"));
            table.Columns.Add(new DataColumn("EMAIL_UPDATE"));
            table.Columns.Add(new DataColumn("PHONENUM"));
            table.Columns.Add(new DataColumn("POSTA_CODE"));
            table.Columns.Add(new DataColumn("ADDRESS"));
            table.Columns.Add(new DataColumn("CREAT_IP"));
            table.Columns.Add(new DataColumn("CREAT_TIME"));
            //存入資料
            while (dr.Read()) {
                DataRow row = table.NewRow();
                row[0] = Convert.ToString(dr[0]);
                row[1] = Convert.ToString(dr[1]);
                row[2] = Convert.ToString(dr[2]);
                row[3] = Convert.ToString(dr[3]);
                row[4] = Convert.ToString(dr[4]);
                row[5] = Convert.ToString(dr[5]);
                row[6] = Convert.ToString(dr[6]);
                row[7] = (Convert.ToString(dr[7]) == "")? "" : Convert.ToDateTime(dr[7]).ToString("yyyy/MM/dd");
                row[8] = Convert.ToString(dr[8]);
                row[9] = Convert.ToString(dr[9]);
                row[10] = Convert.ToString(dr[10]);
                row[11] = Convert.ToString(dr[11]);
                row[12] = Convert.ToString(dr[12]);
                row[13] = Convert.ToString(dr[13]);
                row[14] = Convert.ToString(dr[14]);
                table.Rows.Add(row);
            }
            string strJson = JsonConvert.SerializeObject(table); //轉成JSON格式
            cn.Close();
            cn.Dispose();
            return strJson;
        }

        public void Add(string strLoginID2,/* string strPassword2,*/ string strLastName2, string strFirstName2, string strGender2,
                        string strdBirthday2, string strEmail2, string strPhoneNumber2, string strPostaCode2, string strAddress2)
        {
            cn.Open();
            SqlCommand cm;
            //現在時間
            string strCm = "INSERT INTO [ACCOUNT] (CREAT_IP,CREAT_TIME,ACCOUNT_LEVEL,TYPE,LOGIN_ID,LAST_NAME,FIRST_NAME,GENDER,BIRTHDAY,EMAIL,PHONENUM,POSTA_CODE,ADDRESS)" +
            "VALUES('0.0.0.0','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','0','0', '" +
            strLoginID2 /*+ "', '"+ strPassword2 */+ "', '" + strLastName2 + "', '" + strFirstName2 + "', '" + strGender2 + "', " + 
            "NULLIF('" + strdBirthday2 + "', ''), '" + strEmail2 + "', '" + strPhoneNumber2 + "', '" + strPostaCode2 + "', '" + strAddress2 + "')";
            cm = new SqlCommand(strCm, cn);
            cm.ExecuteNonQuery();
            cn.Close();
            cn.Dispose();
        }

        public void Modify(string strId2_2, string strLoginID2,/* string strPassword2,*/ string strLastName2, string strFirstName2, string strGender2,
                           string strdBirthday2, string strEmail2, string strPhoneNumber2, string strPostaCode2, string strAddress2)
        {
            cn.Open();
            SqlCommand cm;
            string strCm = "UPDATE [ACCOUNT] SET " +
            "LOGIN_ID='" + strLoginID2 /*+ "',PWD='" + strPassword2 */+ "',LAST_NAME='" + strLastName2 + "',FIRST_NAME='" + strFirstName2 + "',GENDER='" + strGender2 +
            "',BIRTHDAY=NULLIF('" + strdBirthday2 + "', '') ,EMAIL='" + strEmail2 + "',PHONENUM='" + strPhoneNumber2 + "',POSTA_CODE='" + strPostaCode2 + "',ADDRESS='" + strAddress2 +
            "' WHERE ID=" + strId2_2;
            cm = new SqlCommand(strCm, cn);
            cm.ExecuteNonQuery();
            cn.Close();
            cn.Dispose();
        }

        public void Delete(string strCheckedTr_ID)
        {
            cn.Open();
            SqlCommand cm;
            string strCm = @"DELETE FROM [ACCOUNT]" +
            "WHERE ID IN("+ strCheckedTr_ID + ")";
            cm = new SqlCommand(strCm, cn);
            cm.ExecuteNonQuery();
            cn.Close();
            cn.Dispose();
        }

        //public string OpenData() //檢查是否連線成功
        //{
        //    string strTest = "";
        //    if (cn.State == System.Data.ConnectionState.Closed)
        //    {
        //        try
        //        {
        //            cn.Open();
        //            strTest = "連通成功";
        //        }
        //        catch (Exception)
        //        {
        //            strTest = "連通失敗";
        //        }
        //    }
        //    return strTest;
        //}
    }
}
