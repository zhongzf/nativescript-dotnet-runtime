
using Jurassic;
using RaisingStudio.NativeScript;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace clear_runtime
{
    public class Program
    {
        [STAThread]
        public static void Main()
        {
            //var application = new System.Windows.Application();
            //var window = new System.Windows.Window();
            //application.Run(window);
            var applicationPath = AppDomain.CurrentDomain.BaseDirectory;
            string fileName = Path.Combine(applicationPath, "app", "app.js");
            var sourceCode = File.ReadAllText(fileName);

            //var engine = new JScriptEngine(WindowsScriptEngineFlags.EnableDebugging);
            //var engine = new V8ScriptEngine(V8ScriptEngineFlags.EnableDebugging);
            //engine.AddHostType("Console", typeof(Console));
            //var typeCollection = new HostTypeCollection("mscorlib", "System", "System.Core", "PresentationCore", "PresentationFramework", "WindowsBase");
            //engine.AddHostObject("clr", typeCollection);
            //engine.AddHostObject("xHost", new ExtendedHostFunctions());
            //engine.Execute(fileName, sourceCode);


            var engine = new ScriptEngine();
            engine.SetGlobalFunction("log", new Action<string>((data) => Console.WriteLine(data)));
            engine.SetGlobalValue("Application", new ApplicationConstructor(engine));
            engine.SetGlobalValue("application", new Application(engine));
            engine.Execute(sourceCode);
        }
    }
}
