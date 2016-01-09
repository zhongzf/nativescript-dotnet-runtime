﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace RaisingStudio.Utils
{
    public class ResourceLoader
    {
        class AssemblyDescriptor
        {
            public AssemblyDescriptor(Assembly assembly)
            {
                Assembly = assembly;

                if (assembly != null)
                {
                    Resources = assembly.GetManifestResourceNames()
                        .ToDictionary(n => n, n => (IAssetDescriptor)new AssemblyResourceDescriptor(assembly, n));
                    Name = assembly.GetName().Name;
                }
            }

            public Assembly Assembly { get; }
            public Dictionary<string, IAssetDescriptor> Resources { get; }
            public string Name { get; }
        }


        private static readonly Dictionary<string, AssemblyDescriptor> AssemblyNameCache
            = new Dictionary<string, AssemblyDescriptor>();

        private readonly AssemblyDescriptor _defaultAssembly;

        public ResourceLoader(Assembly assembly = null)
        {
            if (assembly == null)
                assembly = Assembly.GetEntryAssembly();
            _defaultAssembly = new AssemblyDescriptor(assembly);
        }



        AssemblyDescriptor GetAssembly(string name)
        {
            if (name == null)
                return _defaultAssembly;
            AssemblyDescriptor rv;
            if (!AssemblyNameCache.TryGetValue(name, out rv))
                AssemblyNameCache[name] = rv =
                    new AssemblyDescriptor(AppDomain.CurrentDomain.GetAssemblies()
                        .FirstOrDefault(a => a.GetName().Name == name)
                                           ?? Assembly.Load(name));
            return rv;
        }

        interface IAssetDescriptor
        {
            Stream GetStream();
        }


        class AssemblyResourceDescriptor : IAssetDescriptor
        {
            private readonly Assembly _asm;
            private readonly string _name;

            public AssemblyResourceDescriptor(Assembly asm, string name)
            {
                _asm = asm;
                _name = name;
            }

            public Stream GetStream()
            {
                return _asm.GetManifestResourceStream(_name);
            }
        }


        IAssetDescriptor GetAsset(Uri uri)
        {
            if (!uri.IsAbsoluteUri || uri.Scheme == "resm")
            {
                var qs = uri.Query.TrimStart('?')
                    .Split(new[] { '&' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(p => p.Split('='))
                    .ToDictionary(p => p[0], p => p[1]);
                //TODO: Replace _defaultAssembly by current one (need support from OmniXAML)
                var asm = _defaultAssembly;
                if (qs.ContainsKey("assembly"))
                    asm = GetAssembly(qs["assembly"]);

                IAssetDescriptor rv;
                asm.Resources.TryGetValue(uri.AbsolutePath, out rv);
                return rv;
            }
            throw new ArgumentException($"Invalid uri, see https://github.com/Perspex/Perspex/issues/282#issuecomment-166982104", nameof(uri));
        }

        /// <summary>
        /// Checks if an asset with the specified URI exists.
        /// </summary>
        /// <param name="uri">The URI.</param>
        /// <returns>True if the asset could be found; otherwise false.</returns>
        public bool Exists(Uri uri)
        {
            return GetAsset(uri) != null;
        }

        /// <summary>
        /// Opens the resource with the requested URI.
        /// </summary>
        /// <param name="uri">The URI.</param>
        /// <returns>A stream containing the resource contents.</returns>
        /// <exception cref="FileNotFoundException">
        /// The resource was not found.
        /// </exception>
        public Stream Open(Uri uri)
        {
            var asset = GetAsset(uri);
            if (asset == null)
                throw new FileNotFoundException($"The resource {uri} could not be found.");
            return asset.GetStream();
        }

        public string Load(Uri uri)
        {
            using (var streamReader = new StreamReader(Open(uri)))
            {
                return streamReader.ReadToEnd();
            }
        }
    }
}
