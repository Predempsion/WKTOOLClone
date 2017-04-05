Phi
  = _ 'AF' _ '('_ psi:Psi _ ')'_                                            { return new nWCTL.Phi('AF', psi); }
  / _ 'AG' _ '('_ psi:Psi _ ')'_                                            { return new nWCTL.Phi('AG', psi); }
  
Psi
  = phi:Phi                                                                 { return phi; }
  / a:prop                                                                  { return new nWCTL.Propersition(a); }
  / '(' _ psi1:PsiH _ '||' _ psi2:Psi _ ')'                              { return new nWCTL.Psi(new nWCTL.Compare('disjunction'), psi1, psi2); }
  / '(' _ psi1:PsiH _ '&&' _ psi2:Psi _')'                               { return new nWCTL.Psi(new nWCTL.Compare('conjunction'), psi1, psi2); }
  / chi:Chi _ s:compare _ c:const                                           { return new nWCTL.Psi(s, chi, new nWCTL.Constant(c)); }

PsiH
  = phi:Phi                                                                 { return phi; }
  / a:prop                                                                  { return new nWCTL.Propersition(a); }
  / '(' _ psi1:PsiH _ '||' _ psi2:Psi _ ')'                              { return new nWCTL.Psi(new nWCTL.Compare('disjunction'), psi1, psi2); }
  / '(' _ psi1:PsiH _ '&&' _ psi2:Psi _')'                               { return new nWCTL.Psi(new nWCTL.Compare('conjunction'), psi1, psi2); }
  / chi:Chi _ s:compare _ c:const                                           { return new nWCTL.Psi(s, chi, new nWCTL.Constant(c)); }
  
Chi
  = c:const                                                                 { return new nWCTL.Constant(c); }
  / '#'v:const                                                              { return new nWCTL.Component(v); }
  / '(' _ chi1:ChiH _ '+' _ chi2:Chi _ ')'                                  { return new nWCTL.Chi(chi1, "+", chi2); }
  / '(' _ chi1:ChiH _ '*' _ chi2:Chi _ ')'                                  { return new nWCTL.Chi(chi1, "*", chi2); }
  / chi1:ChiH _ '+' _ chi2:Chi                                              { return new nWCTL.Chi(chi1, "+", chi2); }
  / chi1:ChiH _ '*' _ chi2:Chi                                              { return new nWCTL.Chi(chi1, "*", chi2); }

ChiH
  = c:const                                                                 { return new nWCTL.Constant(c); }
  / '#'v:const                                                              { return new nWCTL.Component(v); }
  
const "integer"
  = c:[0-9]+                                                                { return parseInt(c.join('')); }

prop "propersition"
  = first:[A-Za-z] rest:[A-Za-z0-9_]*                                       { return first + rest.join(''); }

compare "comparison-operator"
  = s:'<='                                                                  { return new nWCTL.Compare("leq"); }
  / s:'>='                                                                  { return new nWCTL.Compare("geq"); }
  / s:'=='                                                                  { return new nWCTL.Compare("eq"); }

_ "whitespace"
  = [" "\n\r\t] _                                                           {}
  / " "*                                                                    {}