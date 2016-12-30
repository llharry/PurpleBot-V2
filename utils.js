var EXPORT = module.exports;


EXPORT.IsNumeric = function(input){
    return (input - 0) == input && (''+input).trim().length > 0;
}
