using Perspex.Themes.Default;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RaisingStudio.NativeScript
{
    public class Application : Perspex.Application
    {
        public Application()
        {
            RegisterServices();
            InitializeSubsystems((int)Environment.OSVersion.Platform);
            Styles = new DefaultTheme();
        }
    }
}
