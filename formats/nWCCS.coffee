# Class for nWCCS expressions
@nWCCS = {}

class @nWCCS.Context
  constructor: ->
    @declarations = []
    @initname = ""
  get_declaration: (name) ->
    for dec in @declarations
      if dec.name is name
        dec
  reverse: ->
    @declarations = @declarations.reverse()
  set_init: (name) ->
    if get_declaration(name)?
      @initname = name

class @nWCCS.Declaration
  constructor: (@name, @statement) ->

class @nWCCS.Statement
  constructor: ->
  convert_to_xml: ->

class @nWCCS.ActionProcess extends @nWCCS.Statement
  constructor: (@act, @statement) ->
  convert_to_xml: -> 
    xml = "<action>\n"
    xml = xml + "<action_id>\n#{@act.name}\n</action_id>\n"
    xml = xml + "<type>\n"
    if @act.isControl
      xml = xml + "c\n"
    else
      xml = xml + "u\n"
    xml = xml + "</type>\n"
    weight_str = @act.vector_to_xml()
    xml = xml + "<weights>\n#{weight_str}</weights>\n"
    xml = xml + "<next>\n" + @statement.convert_to_xml() + "</next>\n"
    xml = xml + "</action>\n"


class @nWCCS.LabelProcess extends @nWCCS.Statement
  constructor: (@lab, @statement) ->
  convert_to_xml: ->
    xml = "<label id=\"#{@lab}\">\n"
    xml = xml + "<next>\n" + @statement.convert_to_xml() + "</next>\n"
    xml = xml + "</label>\n"

class @nWCCS.ChoiseProcess extends @nWCCS.Statement
  constructor: (@post, @statement) ->
  convert_to_xml: ->
    xml = "<choice>\n<first>\n"
    xml = xml + @post.convert_to_xml()
    xml = xml + "</first>\n<second>\n"
    xml = xml + @statement.convert_to_xml()
    xml = xml + "</second>\n</choice>\n"

class @nWCCS.ParProcess extends @nWCCS.Statement
  constructor: (@post, @statement) ->
  convert_to_xml: ->
    xml = "<parallel>\n<first>\n"
    xml = xml + @post.convert_to_xml()
    xml = xml + "</first>\n<second>\n"
    xml = xml + @statement.convert_to_xml()
    xml = xml + "</second>\n</parallel>\n"

class @nWCCS.RestrictProcess extends @nWCCS.Statement
  constructor: (@post, @actions) ->
  convert_to_xml: ->
    xml = "<restriction>\n"
    xml = xml + "<restricted_actions>\n"
    for act in @actions
      xml = xml + "<restricted_action>\n#{act}\n</restricted_action>\n"
    xml = xml + "</restricted_actions>\n"
    xml = xml + "<next>\n" + @post.convert_to_xml() + "</next>\n"
    xml = xml + "</restriction>\n"
    

class @nWCCS.RenameProcess extends @nWCCS.Statement
  constructor: (@post, @labels) ->
  convert_to_xml: ->
    xml = "<rename>\n"
    xml = xml + "<renames>\n"
    for lab in @labels
      xml = xml + "<rename>\n<from>\n#{lab.source}\n</from>\n<to>\n#{lab.target}\n</to>\n</rename>\n"
    xml = xml + "</renames>"
    xml = xml + "<next>\n" + @post.convert_to_xml() + "</next>\n"
    xml = xml + "</rename>\n"

class @nWCCS.RenamedLabel
  constructor: (@source, @target) ->

class @nWCCS.PostProcess extends @nWCCS.Statement
  constructor: (@type, @statement = null) ->
  convert_to_xml: ->
    xml = ""
    if @statement?
      xml = xml + @statement.convert_to_xml()
    else if @type is "0\n"
      xml = xml + "<zeroprocess/>\n"
    else
      xml = xml + "<nameprocess>\n#{@type}\n</nameprocess>\n"
    
class @nWCCS.Action
  constructor: (@name, @vector, @isControl) ->
  vector_to_xml: ->
    xml = ""
    i = 1
    for w in @vector
      xml = xml + "<weight id=\"#{i}\" value=\"#{w}\"/>\n"
      i++
    return xml


