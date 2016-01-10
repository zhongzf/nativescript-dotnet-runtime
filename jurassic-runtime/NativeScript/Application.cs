using Jurassic;
using Jurassic.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RaisingStudio.NativeScript
{
    public class Application : ObjectInstance
    {
        private System.Windows.Application application;
        private System.Windows.Window window;

        public Application(ScriptEngine engine)
                : base(engine)
        {
            application = new System.Windows.Application();
            window = new System.Windows.Window();
            this.PopulateFunctions();
        }

        public Application(ObjectInstance prototype)
            : base(prototype)
        {
            //application = new System.Windows.Application();
            //window = new System.Windows.Window();
            this.PopulateFunctions();
        }

        [JSFunction(Name = "Run")]
        public void Run()
        {
            application.Run(window);
        }
    }

    public class ApplicationConstructor : ClrFunction
    {
        public ApplicationConstructor(ScriptEngine engine)
            : base(engine.Function.InstancePrototype, "Application", new Application(engine.Object.InstancePrototype))
        {
        }
    }
}
