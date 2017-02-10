{
  var contexts = new nWCCS.Context();
}
Start
 = s:Declaration  { contexts.reverse();
                    return contexts; }
 
 Declaration
  = N:name _ ":=" _ S:Statement _";" _ D:Declaration?     { return contexts.declarations.push(new nWCCS.Declaration(N,S)); }
 
 Statement
  = act:ActionProcess "." S:Statement                     { return new nWCCS.ActionProcess(act, S); }
  / lab:label ":" S:Statement                             { return new nWCCS.LabelProcess(lab, S); }
  / P1:PostProcess _ "+" _  P2:Statement                  { return new nWCCS.ChoiseProcess(P1, P2); }
  / P1:PostProcess _ "|" _ P2:Statement                   { return new nWCCS.ParProcess(P1, P2); }
  / P:PostProcess _ "\\" _ "{" acts:Actions "}"           { return new nWCCS.RestrictProcess(P, acts); }
  / P:PostProcess _ "[" labs:Renames "]"                  { return new nWCCS.RenameProcess(P, labs.reverse()); }
  / P:PostProcess                                         { return P; }

 PostProcess
  = name:name                                             { return new nWCCS.PostProcess(name); }
  / "(" _ S:Statement _ ")"                               { return new nWCCS.PostProcess("()", S); }
  / "0"                                                   { return new nWCCS.PostProcess("0"); }
 
 ActionProcess
  = "<" act:action _ "," w:Weights _ ",c>"                { return new nWCCS.Action(act, w.reverse(), true); }
  / "<" act:action _ "," w:Weights _ ",u>"                { return new nWCCS.Action(act, w.reverse(), false); }
  
 Actions
  = act:action _ "," _ al:Actions                         { al.push(act); return al; }
  / act:action  _                                         { var al = [act]; return al; }
  
 Renames
  = labS:label _ "->" _ labT:label _ "," _ ll:Renames       { ll.push(new nWCCS.RenamedLabel(labS,labT)); return ll; }
  / labS:label _ "=>" _ labT:label _ "," _ ll:Renames       { ll.push(new nWCCS.RenamedLabel(labS,labT)); return ll; }
  / labS:label _ "->" _ labT:label _                        { var ll = [new nWCCS.RenamedLabel(labS,labT)]; return ll; }
  / labS:label _ "=>" _ labT:label _                        { var ll = [new nWCCS.RenamedLabel(labS,labT)]; return ll; }
  
  
 Weights
  = _ w:weight _ "," _ wl:Weights               { wl.push(w); return wl; }
  / _ w:weight    _                             { var wl = [w]; return wl; }
 
 name "name"
  = first:[A-Z] rest:[A-Za-z0-9_]*              { return first + rest.join(''); }
 
 action "action"
  = first:[a-z] rest:[A-Za-z0-9_]* io:"!"       { return first + rest.join('') + io; }
  / first:[a-z] rest:[A-Za-z0-9_]*              { return first + rest.join(''); }

 label "label"
  = first:[a-z] rest:[A-Za-z0-9_]*              { return first + rest.join(''); }
  
 weight "weight"
  = w:[0-9]+                                    { return parseInt(w.join('')); }

_ "whitespace"
  = [" "\n\r\t] _               {}
  / '#' [^\n]* '\n' _           {}
  / '#' [^\n]* ![^]             {}
  / " "*                        {}