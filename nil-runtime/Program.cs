using NiL.JS;
using NiL.JS.Core;
//using RaisingStudio.NativeScript;
using System;
using System.Collections.Generic;
using System.IO;
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
            //Runtime.Instance.Init(AppDomain.CurrentDomain.BaseDirectory);
            //Runtime.Instance.ExecuteModule("./");

            //var request = System.Net.WebRequest.CreateHttp("");
            //var response = request.GetResponseAsync();
            //response.ContinueWith((data)=> data.Result.)

            var types = new[]
            {
                typeof(System.Windows.Application),
                typeof(System.Windows.Window)
            };



            var namespaceProvider = new NamespaceProvider("System.Windows");
            var context = new Context();

            context.DefineVariable("windows").Assign(namespaceProvider);

            var applicationPath = AppDomain.CurrentDomain.BaseDirectory;
            string fileName = Path.Combine(applicationPath, "app", "app.js");
            var sourceCode = File.ReadAllText(fileName);

            context.Eval(sourceCode);
        }
    }
}
