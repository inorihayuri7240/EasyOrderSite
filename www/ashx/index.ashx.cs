using System;
using System.Web;

namespace www.ashx
{
    /// <summary>
    /// index 的摘要描述
    /// </summary>
    public class index : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string strLoginID = context.Request["txtLoginID"]; //帳號
            string strLoginPWD = context.Request["txtLoginPWD"]; //密碼
            DB.DB db = new DB.DB();
            string strTest= Convert.ToString(db.Login(strLoginID, strLoginPWD));
            context.Response.ContentType = "text/plain"; // JSON 格式
            context.Response.Write(strTest);
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