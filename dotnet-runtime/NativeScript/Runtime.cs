using Jint;
using Jint.Native;
using Jint.Parser;
using Jint.Runtime.Debugger;
using Perspex.Controls;
using Perspex.Markup.Xaml;
using Perspex.Media;
using RaisingStudio.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RaisingStudio.NativeScript
{
    public sealed class Runtime : Engine
    {
        public static readonly Runtime Instance = new Runtime();
#if DEBUG
        public const bool DebugMode = true;
        public static readonly string[] DebugFileList = new string[]
        {
            //"observable.js",
            //"dependency-observable.js",
            //"font-common.js",
            //"font.js",
            //"style-property.js",
            //"style-scope.js",
            //"style.js",
            //"stylers-common.js",
            //"stylers.js",
            //"styling.js",
            //"visual-state-constants.js",
            //"visual-state.js",
            "view-common.js",
            "view.js",
            //"button-common.js",
            //"button.js",
            //"text-base.js",
            //"text-field-common.js",
            //"text-field.js",
            //"editable-text-base.js",
            //"editable-text-base-common.js",
            //"text-view-common.js",
            //"text-view.js",
            //"text-base.js",
            //"label-common.js",
            //"label.js",
            //"file-name-resolver.js",
            //"file-system.js",
            //"file-system-access.js",
            //"text.js",
            //"formatted-string-common.js",
            //"formatted-string.js",
            //"span-common.js",
            //"span.js",
            //"platform.js",
            //"xml.js",
            //"absolute-layout.js",
            //"dock-layout.js",
            //"grid-layout.js",
            //"stack-layout.js",
            //"wrap-layout.js",
            //"layout.js",
            //"gestures-common.js",
            //"gestures.js",
            //"builder.js",
            //"component-builder.js",
            //"frame-common.js",
            //"frame.js",            
            "page-common.js",
            "page.js"
        };
#else
        public const bool DebugMode = false;
        public static readonly string[] DebugFileList = new string[] {};
#endif

        private Runtime()
            : base(cfg => cfg
                .AllowClr(
                    typeof(Enumerable).Assembly,
                    typeof(Uri).Assembly,
                    typeof(Control).Assembly,
                    typeof(Color).Assembly,
                    typeof(PerspexXamlLoader).Assembly,
                    typeof(Runtime).Assembly
                   )
                .DebugMode(DebugMode)
            )
        {
            if (DebugMode)
            {
                this.Step += Runtime_Step;
            }
        }

        private static bool IsAllowDebug(string filePath)
        {
            var fileName = (new FileInfo(filePath)).Name;
            return DebugFileList.Contains(fileName, StringComparer.OrdinalIgnoreCase);
        }

        private StepMode Runtime_Step(object sender, DebugInformation e)
        {
            //if (!(new[] { "__extends.js", "es6-shim.js", "require.js" }.Contains(e.CurrentStatement.Location.Source)))
            //{
            if (IsAllowDebug(e.CurrentStatement.Location.Source))
            {
                Console.WriteLine("{0}: Line {1}, Char {2}, Source {3}", e.CurrentStatement.ToString(), e.CurrentStatement.Location.Start.Line, e.CurrentStatement.Location.Start.Column, e.CurrentStatement.Location.Source);
            }
            //}
            return StepMode.Into;
        }

        private string applicationPath;
        private ResourceLoader resourceLoader;

        public Engine Execute(string source, string name)
        {
            var sourceName = string.IsNullOrEmpty(name) ? name : FixSourceName(name);
            return this.Execute(source, DebugMode ? new ParserOptions { Source = sourceName } : null);
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

            this.SetValue("global", base.Global);
            this.SetValue("this", base.Global);

            this.SetValue("log", new Action<string>(this.WriteLog));
            this.SetValue("watch", new Action<object>(this.Watch));

            var __extendsSourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.__extends.js"));
            var __extendsFunction = this.Execute(__extendsSourceCode, "__extends.js").GetCompletionValue();
            this.SetValue("__extends", __extendsFunction);

            var es6SourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.es6-shim.js"));
            var es6 = this.Execute(es6SourceCode, "es6-shim.js").GetCompletionValue();
            es6.Invoke();
        }

        public void WriteLog(string value)
        {
            Console.WriteLine(value);
        }

        public void Watch(object value)
        {
            Console.WriteLine(value);
        }

        public object CreateModuleFunction(string moduleBody, string moduleUrl)
        {
            var moduleFunctionBody = string.Format("(function (require, module, exports, dirName, path) {{ 'use strict'; {0} \n }});", moduleBody);
            var moduleFunction = this.Execute(moduleFunctionBody, moduleUrl).GetCompletionValue();
            return moduleFunction;
        }

        public void ExecuteModule(string entryPointModuleIdentifier)
        {
            var sourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.require.js"));
            var requireFunction = this.Execute(sourceCode, "require.js").GetCompletionValue();
            var require = requireFunction.Invoke(this.applicationPath, JsValue.FromObject(this, new Func<string, string, object>(this.CreateModuleFunction)));
            require.Invoke("./");
        }
    }
}
