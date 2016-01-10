using ChakraHost.Hosting;
using OmniXaml;
using OmniXaml.Wpf;
using RaisingStudio.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Controls;
using System.Windows.Media;

namespace RaisingStudio.NativeScript
{
    public sealed class Runtime
    {
        public static readonly Runtime Instance = new Runtime();

        private JavaScriptRuntime engine;
        private JavaScriptContext context;
        private JavaScriptSourceContext currentSourceContext = JavaScriptSourceContext.FromIntPtr(IntPtr.Zero);

        private Runtime()
        {
            this.engine = JavaScriptRuntime.Create();
            this.context = CreateContext(this.engine);
            runScriptDelegate = this.RunScript;
            createModuleDelegate = this.CreateModuleFunctionCallback;

            //StartDebugging();
        }

        public JavaScriptContext CreateContext(JavaScriptRuntime engine)
        {
            var context = engine.CreateContext();
            return context;
        }


        // We have to hold on to the delegates on the managed side of things so that the
        // delegates aren't collected while the script is running.
        private readonly JavaScriptNativeFunction echoDelegate = Echo;
        private readonly JavaScriptNativeFunction runScriptDelegate;// = RunScript;
        private readonly JavaScriptNativeFunction logDelegate = WriteLog;
        private readonly JavaScriptNativeFunction createModuleDelegate;// = CreateModuleFunctionCallback;

        private static void ThrowException(string errorString)
        {
            // We ignore error since we're already in an error state.
            JavaScriptValue errorValue = JavaScriptValue.FromString(errorString);
            JavaScriptValue errorObject = JavaScriptValue.CreateError(errorValue);
            JavaScriptContext.SetException(errorObject);
        }

        private static JavaScriptValue Echo(JavaScriptValue callee, bool isConstructCall, JavaScriptValue[] arguments, ushort argumentCount, IntPtr callbackData)
        {
            for (uint index = 1; index < argumentCount; index++)
            {
                if (index > 1)
                {
                    Console.Write(" ");
                }

                Console.Write(arguments[index].ConvertToString().ToString());
            }

            Console.WriteLine();

            return JavaScriptValue.Invalid;
        }

        private static void StartDebugging()
        {
            JavaScriptContext.StartDebugging();
        }

        public JavaScriptValue RunScript(JavaScriptValue callee, bool isConstructCall, JavaScriptValue[] arguments, ushort argumentCount, IntPtr callbackData)
        {
            if (argumentCount < 2)
            {
                ThrowException("not enough arguments");
                return JavaScriptValue.Invalid;
            }

            //
            // Convert filename.
            //

            string filename = arguments[1].ToString();

            //
            // Load the script from the disk.
            //

            string script = File.ReadAllText(filename);
            if (string.IsNullOrEmpty(script))
            {
                ThrowException("invalid script");
                return JavaScriptValue.Invalid;
            }

            //
            // Run the script.
            //

            return JavaScriptContext.RunScript(script, currentSourceContext++, filename);
        }

        private static void DefineHostCallback(JavaScriptValue globalObject, string callbackName, JavaScriptNativeFunction callback, IntPtr callbackData)
        {
            //
            // Get property ID.
            //

            JavaScriptPropertyId propertyId = JavaScriptPropertyId.FromString(callbackName);

            //
            // Create a function
            //

            JavaScriptValue function = JavaScriptValue.CreateFunction(callback, callbackData);

            //
            // Set the property
            //

            globalObject.SetProperty(propertyId, function, true);
        }

        private  JavaScriptContext CreateHostContext(JavaScriptRuntime runtime)
        {
            //
            // Create the context. Note that if we had wanted to start debugging from the very
            // beginning, we would have called JsStartDebugging right after context is created.
            //

            JavaScriptContext context = runtime.CreateContext();

            //
            // Now set the execution context as being the current one on this thread.
            //

            using (new JavaScriptContext.Scope(context))
            {
                InitContext();
            }

            return context;
        }

        private Application application = new Application();

        private void InitContext()
        {
            //
            // Create the host object the script will use.
            //

            JavaScriptValue hostObject = JavaScriptValue.CreateObject();

            //
            // Get the global object
            //

            JavaScriptValue globalObject = JavaScriptValue.GlobalObject;

            //
            // Get the name of the property ("host") that we're going to set on the global object.
            //

            JavaScriptPropertyId hostPropertyId = JavaScriptPropertyId.FromString("host");

            //
            // Set the property.
            //

            globalObject.SetProperty(hostPropertyId, hostObject, true);

            //
            // Now create the host callbacks that we're going to expose to the script.
            //

            DefineHostCallback(hostObject, "echo", echoDelegate, IntPtr.Zero);
            DefineHostCallback(hostObject, "runScript", runScriptDelegate, IntPtr.Zero);

            globalObject.SetProperty(JavaScriptPropertyId.FromString("global"), globalObject, true);
            DefineHostCallback(globalObject, "log", logDelegate, IntPtr.Zero);
            DefineHostCallback(globalObject, "watch", logDelegate, IntPtr.Zero);

            JavaScriptValue applicationObject = JavaScriptValue.CreateObject();
            globalObject.SetProperty(JavaScriptPropertyId.FromString("application"), applicationObject, true);
            //applicationObject.SetProperty(JavaScriptPropertyId.FromString("start"), JavaScriptValue.CreateFunction(Application.runDelegate, IntPtr.Zero), true);
            DefineHostCallback(applicationObject, "start", Application.runDelegate, IntPtr.Zero);
        }

        private static void PrintScriptException(JavaScriptValue exception)
        {
            //
            // Get message.
            //

            JavaScriptPropertyId messageName = JavaScriptPropertyId.FromString("message");
            JavaScriptValue messageValue = exception.GetProperty(messageName);
            string message = messageValue.ToString();

            Console.Error.WriteLine("chakrahost: exception: {0}", message);
        }


        private string applicationPath;
        private ResourceLoader resourceLoader;

        public JavaScriptValue Execute(string source, string name)
        {
            var sourceName = string.IsNullOrEmpty(name) ? name : FixSourceName(name);
            if (string.IsNullOrEmpty(source))
            {
                ThrowException("invalid script");
                return JavaScriptValue.Invalid;
            }

            //
            // Run the script.
            //

            return JavaScriptContext.RunScript(source, currentSourceContext++, sourceName);
        }

        private string FixSourceName(string name)
        {
            var uri = new Uri(name, UriKind.RelativeOrAbsolute);
            return uri.IsAbsoluteUri ? uri.AbsolutePath : uri.OriginalString;
        }

        public void Init(string applicationPath)
        {
            this.resourceLoader = new ResourceLoader();
            this.applicationPath = applicationPath;

            //this.SetValue("global", base.Global);
            ////this.SetValue("this", base.Global);

            //this.SetValue("log", new Action<string>(this.WriteLog));
            //this.SetValue("watch", new Action<object>(this.Watch));

            //var __extendsSourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.__extends.js"));
            //var __extendsFunction = this.Execute(__extendsSourceCode, "__extends.js").GetCompletionValue();
            //this.SetValue("__extends", __extendsFunction);

            using (new JavaScriptContext.Scope(context))
            {
                InitContext();
            }

            //var es6SourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.es6-shim.js"));
            //var es6 = this.Execute(es6SourceCode, "es6-shim.js").GetCompletionValue();
            //es6.Invoke();
        }

        private static JavaScriptValue WriteLog(JavaScriptValue callee, bool isConstructCall, JavaScriptValue[] arguments, ushort argumentCount, IntPtr callbackData)
        {
            for (uint index = 1; index < argumentCount; index++)
            {
                if (index > 1)
                {
                    Console.Write(" ");
                }

                Console.Write(arguments[index].ConvertToString().ToString());
            }

            Console.WriteLine();

            return JavaScriptValue.Invalid;
        }


        //public void WriteLog(string value)
        //{
        //    Console.WriteLine(value);
        //}

        //public void Watch(object value)
        //{
        //    Console.WriteLine(value);
        //}

        private Dictionary<string, JavaScriptValue> ModuleFunctionCache = new Dictionary<string, JavaScriptValue>();

        public JavaScriptValue CreateModuleFunction(string moduleBody, string moduleUrl)
        {
            if (ModuleFunctionCache.ContainsKey(moduleUrl))
            {
                return ModuleFunctionCache[moduleUrl];
            }
            else
            {
                //var moduleFunctionBody = string.Format("(function (require, module, exports, dirName, path) {{ 'use strict'; {0} \n }});", moduleBody);
                var moduleFunction = this.Execute(moduleBody, moduleUrl);
                ModuleFunctionCache[moduleUrl] = moduleFunction;
                return moduleFunction;
            }
        }

        public JavaScriptValue CreateModuleFunctionCallback(JavaScriptValue callee, bool isConstructCall, JavaScriptValue[] arguments, ushort argumentCount, IntPtr callbackData)
        {
            var source = arguments[0].ConvertToString().ToString();
            var fileName = arguments[1].ConvertToString().ToString();
            return CreateModuleFunction(source, fileName);
        }


        public void ExecuteModule(string entryPointModuleIdentifier)
        {
            using (new JavaScriptContext.Scope(context))
            {
                var sourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.require.js"));
                var requireFunction = this.Execute(sourceCode, "require.js");
                var require = requireFunction.CallFunction(JavaScriptValue.FromString(this.applicationPath), JavaScriptValue.CreateFunction(createModuleDelegate));
                require.CallFunction(JavaScriptValue.FromString(entryPointModuleIdentifier));
            }
        }

        public void RumModule()
        {
            using (new JavaScriptContext.Scope(context))
            {
                StartDebugging();
                string fileName = Path.Combine(this.applicationPath, "app", "app.js");
                var sourceCode = File.ReadAllText(fileName);
                this.Execute(sourceCode, fileName);
            }
        }
    }
}
