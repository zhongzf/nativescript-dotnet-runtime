var encoding;
(function (encoding) {
    // TODO: 
    encoding.ISO_8859_1 = System.Text.Encoding.Default;
    encoding.US_ASCII = System.Text.Encoding.ASCII;
    encoding.UTF_16 = System.Text.Encoding.Unicode;
    encoding.UTF_16BE = System.Text.Encoding.BigEndianUnicode;
    // TODO:
    encoding.UTF_16LE = System.Text.Encoding.Default;
    encoding.UTF_8 = System.Text.Encoding.UTF8;
})(encoding = exports.encoding || (exports.encoding = {}));
