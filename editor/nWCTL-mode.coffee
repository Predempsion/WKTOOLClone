syntax = [
  ['number',     [/[0-9]+/]]
  ['operator',   ["||", "&&", "AG", "AF", ">=", "<=", "==", "+", "*", "#"]]
  ['bracket',    ["(", ")"]]
  ['property',   [/[A-Za-z][A-Za-z0-9_]*/]]
]

CodeMirror.defineMode "nWCTL", ->
  token:      (stream, state) ->
    stream.eatSpace()
    for rule in syntax
      for pattern in rule[1]
        if stream.match(pattern, true, false)
          return rule[0]
    stream.next() # Eat next character to avoid looping
    return "error"