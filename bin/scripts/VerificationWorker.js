// Generated by CoffeeScript 1.7.1
(function() {
  importScripts('../lib/buckets.min.js', '../engines/Strategies.js', '../formats/WKS.js', '../formats/WCCS.js', '../formats/WCTL.js', '../formats/WKSParser.js', '../formats/WCCSParser.js', '../formats/WCTLParser.js', '../engines/NaiveEngine.js', '../engines/SymbolicEngine.js', '../engines/MinMaxEngine.js');

  self.onmessage = function(e) {
    var encoding, engine, expensive_stats, formula, method, mode, model, property, search_strategy, start, state, strategy, time, val, verifier, wks, _ref;
    _ref = e.data, model = _ref.model, mode = _ref.mode, state = _ref.state, property = _ref.property, engine = _ref.engine, encoding = _ref.encoding, strategy = _ref.strategy, expensive_stats = _ref.expensive_stats;
    formula = WCTLParser.parse(property);
    wks = self["" + mode + "Parser"].parse(model);
    wks.resolve();
    state = wks.getStateByName(state);
    if (engine === 'Local') {
      method = 'local';
    }
    if (engine === 'Global') {
      method = 'global';
    }
    verifier = new self["" + encoding + "Engine"](formula, state);
    search_strategy = null;
    if (strategy != null) {
      search_strategy = Strategies[strategy];
    }
    start = (new Date).getTime();
    val = verifier[method](expensive_stats, search_strategy);
    time = (new Date).getTime() - start;
    val['Time'] = time + " ms";
    val['TimeAsInt'] = Math.round(time);
    if (strategy != null) {
      val["Search strategy"] = strategy;
    }
    val['Encoding / Engine'] = encoding + ' / ' + engine;
    return self.postMessage(val);
  };

}).call(this);