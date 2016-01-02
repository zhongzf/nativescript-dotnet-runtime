﻿using Jint;
using Jint.Native;
using Perspex.Controls;
using Perspex.Markup.Xaml;
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

        private Runtime()
            : base(cfg => cfg
                .AllowClr(
                    typeof(Uri).Assembly,
                    typeof(Control).Assembly,
                    typeof(PerspexXamlLoader).Assembly,
                    typeof(Runtime).Assembly
                   )
                .DebugMode()
                .AllowDebuggerStatement()
            )
        {
        }

        private string applicationPath;
        private object globalObject;
        private ResourceLoader resourceLoader;

        public void Init(string applicationPath)
        {
            this.resourceLoader = new ResourceLoader();
            this.applicationPath = applicationPath;
            this.globalObject = this.Execute("var global = {};").GetValue("global");
            this.SetValue("log", new Action<string>(this.WriteLog));
            this.SetValue("watch", new Action<object>(this.Watch));

            var __extendsSourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.__extends.js"));
            var __extendsFunction = this.Execute(__extendsSourceCode).GetCompletionValue();
            this.SetValue("__extends", __extendsFunction);

            var __mapSourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.__map.js"));
            var __mapFunction = this.Execute(__mapSourceCode).GetCompletionValue();
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
            var moduleFunctionBody = string.Format("(function (require, module, exports, dirName, path) {{ \n 'use strict'; {0} \n }});", moduleBody);
            var moduleFunction = this.Execute(moduleFunctionBody).GetCompletionValue();
            return moduleFunction;
        }

        public void ExecuteModule(string entryPointModuleIdentifier)
        {
            var sourceCode = resourceLoader.Load(new Uri("resm:RaisingStudio.NativeScript.require.js"));
            var requireFunction = this.Execute(sourceCode).GetCompletionValue();
            var require = requireFunction.Invoke(this.applicationPath, JsValue.FromObject(this, new Func<string, string, object>(this.CreateModuleFunction)));


            var pathCache = this.Execute("new Map()").GetCompletionValue();
            this.SetValue("pathCache", pathCache);
            var modulesCache = this.Execute("new Map()").GetCompletionValue();
            this.SetValue("modulesCache", modulesCache);

            require.Invoke("./");
        }
    }
}
