using System.Web;

namespace www.ashx
{
    /// <summary>
    /// memberProfile 的摘要描述
    /// </summary>
    public class memberProfile : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            DB.DB db = new DB.DB();
            //string strSystemID = context.Request["strSystemID"]; // 系統識別碼
            string strAction = context.Request["strAction"]; // 執行動作
            string strResponse = ""; 
            switch (strAction)
            {
                case "Search":
                    string strID_1 = context.Request["txtID_1"].Trim();
                    string strID_2 = context.Request["txtID_2"].Trim();
                    string strLoginID = context.Request["txtLoginID"].Trim();
                    string strCreatTime = context.Request["dgrdCreatTime"];
                    string strLastName = context.Request["txtLastName"].Trim();
                    string strFirstName = context.Request["txtFirstName"].Trim();
                    string strGender = context.Request["dplGender"];
                    string strdBirthday = context.Request["dgrdBirthday"];
                    string strPhoneNumber = context.Request["txtPhoneNumber"].Trim();
                    string strPostaCode = context.Request["txtPostaCode"].Trim();
                    string strAddress = context.Request["txtAddress"].Trim();
                    string strEmail = context.Request["txtEmail"].Trim();
                    strResponse = db.Search(strID_1, strID_2, strLoginID, strCreatTime, strLastName, strFirstName, strGender, strdBirthday, strPhoneNumber, strPostaCode, strAddress, strEmail);
                    context.Response.ContentType = "application/json"; // JSON 格式
                    context.Response.Write(strResponse);
                    break;
                case "Add":
                case "Modify":
                    string strId2_2 = context.Request["lblId2_2"].Trim();
                    string strLoginID2 = context.Request["txtLoginID2"].Trim();
                    //string strPassword2 = context.Request["txtPassword2"].Trim();
                    string strLastName2 = context.Request["txtLastName2"].Trim();
                    string strFirstName2 = context.Request["txtFirstName2"].Trim();
                    string strGender2 = context.Request["dplGender2"];
                    string strdBirthday2 = context.Request["dgrdBirthday2"];
                    string strEmail2 = context.Request["txtEmail2"].Trim();
                    string strPhoneNumber2 = context.Request["txtPhoneNumber2"].Trim();
                    string strPostaCode2 = context.Request["txtPostaCode2"].Trim();
                    string strAddress2 = context.Request["txtAddress2"].Trim();
                    if (strAction == "Add") db.Add(strLoginID2,/* strPassword2, */strLastName2, strFirstName2, strGender2, strdBirthday2, strEmail2, strPhoneNumber2, strPostaCode2, strAddress2);
                    if (strAction == "Modify") db.Modify(strId2_2, strLoginID2,/* strPassword2, */strLastName2, strFirstName2, strGender2, strdBirthday2, strEmail2, strPhoneNumber2, strPostaCode2, strAddress2);
                    break;
                case "Delete":
                    string strCheckedTr_ID = context.Request["strCheckedTr_ID"];
                    db.Delete(strCheckedTr_ID);
                    break;
            }
            //string strPath = HttpContext.Current.Server.MapPath(strPage);
            //string content = System.IO.File.ReadAllText(strPath);

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}