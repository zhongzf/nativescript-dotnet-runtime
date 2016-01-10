using RaisingStudio.NativeScript;
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
            Runtime.Instance.Init(AppDomain.CurrentDomain.BaseDirectory);
            Runtime.Instance.RumModule();

            //var application = new System.Windows.Application();
            //var window = new System.Windows.Window();
            //var xamlLoader = new OmniXaml.Wpf.WpfXamlLoader();
            //xamlLoader.Load(File.OpenRead(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app", "main-page.xaml")), window);
            //window.Loaded += Window_Loaded;
            //application.Run(window);
        }

        private static void Window_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            var button = (sender as System.Windows.Window).FindName("button");
            var b = button as System.Windows.Controls.Button;
            b.Click += Button_Click;
        }

        private static void Button_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            throw new NotImplementedException();
        }
    }
}
