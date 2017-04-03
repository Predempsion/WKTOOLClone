# Class for nWCCS expressions
@nWCTL = {}

class @nWCTL.Expression
  constructor: ->
  convert_to_xml: ->

class @nWCTL.Phi extends @nWCTL.Expression
  constructor: (@quantifier, @psi) ->
  convert_to_xml: -> 
    xml = "<all-paths>\n"
    if @quantifier is "AF"
      xml = xml + "<finally>\n#{@psi.convert_to_xml()}</finally>\n"
    else
      xml = xml + "<globally>\n#{@psi.convert_to_xml()}</globally>\n"
    xml = xml + "</all-paths>\n"

class @nWCTL.Psi extends @nWCTL.Expression
  constructor: (@text, @exp1, @exp2) ->
  convert_to_xml: ->
    xml = "<#{@text.convert_to_xml()}>\n"
    xml = xml + @exp1.convert_to_xml() + @exp2.convert_to_xml()
    xml = xml + "</#{@text.convert_to_xml()}>\n"
    

class @nWCTL.Chi extends @nWCTL.Expression
  constructor: (@child, @operator, @param) ->
  convert_to_xml: ->
    xml = ""
    lop = ""
    if @operator is "+"
      lop = "addition"
    else if @operator is "*"
      lop = "multiplication"
    xml = "<#{lop}>\n"
    xml = xml + @child.convert_to_xml() + @param.convert_to_xml()
    xml = xml + "</#{lop}>\n"

class @nWCTL.Constant extends @nWCTL.Expression
  constructor: (@const_c) ->
  convert_to_xml: ->
    xml = "<constant>\n#{@const_c}\n</constant>\n" 

class @nWCTL.Propersition extends @nWCTL.Expression
  constructor: (@prop) ->
  convert_to_xml: ->
    xml = "<proposition>\n#{@prop}\n</proposition>\n" 

class @nWCTL.Component  extends @nWCTL.Expression
  constructor: (@component) ->
  convert_to_xml: ->
    xml = "<component>\n#{@component}\n</component>\n" 

class @nWCTL.Compare  extends @nWCTL.Expression
  constructor: (@compare_o) ->
  convert_to_xml: ->
    return "compare-#{@compare_o}"

