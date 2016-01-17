//using Perspex.Themes.Default;
using ChakraHost.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RaisingStudio.NativeScript
{
    public class Application //: Perspex.Application
    {
        public Application()
        {
            //RegisterServices();
            //InitializeSubsystems((int)Environment.OSVersion.Platform);
            //Styles = new DefaultTheme();
        }

        public static readonly JavaScriptNativeFunction runDelegate = RunCallback;

        public static JavaScriptValue RunCallback(JavaScriptValue callee, bool isConstructCall, JavaScriptValue[] arguments, ushort argumentCount, IntPtr callbackData)
        {
            var jsValueObject = arguments[0].ConvertToObject();
            var application = null as Application;
            if(application == null)
            {
                application = new Application();
            }
            application.Run();
            return JavaScriptValue.Invalid;
        }

        private void Run()
        {
            var application = new System.Windows.Application();
            var window = new System.Windows.Window();
            application.Run(window);
        }
    }
}
