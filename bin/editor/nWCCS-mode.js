// Generated by CoffeeScript 1.7.1
(function() {
  var syntax;

  syntax = [['atom', ["0"]], ['channel', [/\<[ \n\r\t]*[A-Za-z][A-Za-z0-9_]*!?[ \n\r\t]*(,[ \n\r\t]*[0-9]+)*[ \n\r\t]*(,[ \n\r\t]*[cu])[ \n\r\t]*\>/, /\{([ \n\r\t]*[A-Za-z][A-Za-z0-9_]*[ \n\r\t]*,)*[ \n\r\t]*[A-Za-z][A-Za-z0-9_]*[ \n\r\t]*\}/, /[A-Za-z][A-Za-z0-9_]*[ \n\r\t]*-\>[ \n\r\t]*[A-Za-z][A-Za-z0-9_]*/]], ['error', [/\{.*\}/]], ['property', [/[A-Za-z][A-Za-z0-9_]*:/, /[A-Za-z][A-Za-z0-9_]*[ \n\r\t]*=\>[ \n\r\t]*[A-Za-z][A-Za-z0-9_]*/]], ['number', [/[0-9]+/]], ['fat-comment', [/####.*/]], ['comment', [/#.*/]], ['def', [/[A-Za-z][A-Za-z0-9_]*/]], ['operator', [":=", "|", "+", ":", "\\", ";", "!", ",", "."]], ['bracket', ["{", "}", "(", ")", "[", "]"]]];

  CodeMirror.defineMode("nWCCS", function() {
    return {
      token: function(stream, state) {
        var pattern, rule, _i, _j, _len, _len1, _ref;
        stream.eatSpace();
        for (_i = 0, _len = syntax.length; _i < _len; _i++) {
          rule = syntax[_i];
          _ref = rule[1];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            pattern = _ref[_j];
            if (stream.match(pattern, true, false)) {
              return rule[0];
            }
          }
        }
        stream.next();
        return "error";
      }
    };
  });

}).call(this);