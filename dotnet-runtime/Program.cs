using RaisingStudio.NativeScript;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RaisingStudio
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Runtime.Instance.Init(AppDomain.CurrentDomain.BaseDirectory);
            Runtime.Instance.ExecuteModule("./");

            //var request = System.Net.WebRequest.CreateHttp("");
            //var response = request.GetResponseAsync();
            //response.ContinueWith((data)=> data.Result.)
        }
    }
}
