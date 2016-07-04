exports.write = function(level, msg)
{
    level = String("     " + level).slice(-5);

    console.log(`${level}: ${msg}\n`);
}

exports.trace = function(msg)
{
    exports.write('TRACE', msg);
}

exports.debug = function (msg)
{
    exports.write('DEBUG', msg);
};

exports.info = function (msg)
{
    exports.write('INFO', msg);
}

exports.warn = function (msg)
{
    exports.write('WARN', msg);
}

exports.error = function (msg)
{
    exports.write('ERROR', msg);
}

exports.fatal = function ()
{
    exports.write('FATAL', msg);
}
