// Generated by CoffeeScript 1.7.1
(function() {
  var Configuration, CoverEdge, HyperEdge, nextId, _nId, _nb_covers, _nb_hyps;

  _nId = 0;

  nextId = function() {
    return _nId++;
  };

  Configuration = (function() {
    function Configuration(state, formula) {
      this.state = state;
      this.formula = formula;
      this.value = null;
      this.deps = [];
      this.id = nextId();
    }

    Configuration.prototype.stringify = function() {
      return "[" + (this.state.name()) + ", " + (this.formula.stringify()) + "]";
    };

    Configuration.prototype.dep = function(edge) {
      var e, _i, _len, _ref;
      _ref = this.deps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e === edge) {
          return;
        }
      }
      return this.deps.push(edge);
    };

    return Configuration;

  })();

  _nb_hyps = 0;

  HyperEdge = (function() {
    function HyperEdge(source, targets) {
      this.source = source;
      this.targets = targets;
      _nb_hyps++;
      this.in_queue = true;
    }

    HyperEdge.prototype.stringify = function() {
      var i, target, tlist, weight, _i, _ref;
      if (this.targets.length !== 0) {
        tlist = [];
        for (i = _i = 0, _ref = this.targets.length; _i < _ref; i = _i += 2) {
          weight = this.targets[i];
          target = this.targets[i + 1];
          tlist.push("" + weight + "," + (target.stringify()));
        }
        return "" + (this.source.stringify()) + " -> " + (tlist.sort().join(', '));
      } else {
        return "" + (this.source.stringify()) + " -> Ø";
      }
    };

    return HyperEdge;

  })();

  _nb_covers = 0;

  CoverEdge = (function() {
    function CoverEdge(source, k, target) {
      this.source = source;
      this.k = k;
      this.target = target;
      _nb_covers++;
    }

    CoverEdge.prototype.stringify = function() {
      return "" + (this.source.stringify()) + " -" + this.k + "-> " + (this.target.stringify());
    };

    return CoverEdge;

  })();

  this.SymbolicEngine = (function() {
    function SymbolicEngine(formula, initState) {
      this.formula = formula;
      this.initState = initState;
      this.nb_confs = 0;
    }

    SymbolicEngine.prototype.local = function(exp_stats, queue) {
      var e, e_bot, e_max, edge, i, iterations, max_queue, queue_size, queue_size_count, queue_size_i, queue_size_interval, queue_sizes, retval, state, target, v0, val, weight, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2;
      _nb_hyps = _nb_covers = 0;
      state = this.initState;
      v0 = this.getConf(state, this.formula);
      this.queue = queue = new queue();
      if (v0.value === null) {
        v0.value = Infinity;
        v0.formula.symbolicExpand(v0, this);
      }
      iterations = 0;
      max_queue = 1;
      queue_sizes = [];
      queue_size_interval = 1;
      queue_size_count = 1;
      queue_size_i = 0;
      while (!queue.empty()) {
        if (exp_stats) {
          queue_size = queue.size();
          if (max_queue < queue_size) {
            max_queue = queue_size;
          }
          queue_size_count -= 1;
          if (queue_size_count === 0) {
            queue_sizes[queue_size_i++] = queue_size;
            if (queue_size_i > 100) {
              queue_size_i = 0;
              for (i = _i = 0; _i < 100; i = _i += 5) {
                queue_sizes[queue_size_i++] = queue_sizes[i];
              }
              queue_size_interval *= 5;
            }
            queue_size_count = queue_size_interval;
          }
        }
        iterations++;
        e = queue.pop();
        e.in_queue = false;
        if (e instanceof HyperEdge) {
          e_max = null;
          e_bot = null;
          val = 0;
          for (i = _j = 0, _ref = e.targets.length; _j < _ref; i = _j += 2) {
            weight = e.targets[i];
            target = e.targets[i + 1];
            if (target.value === Infinity) {
              target.dep(e);
              e_max = e_bot = null;
              break;
            } else if (target.value === null) {
              e_bot = target;
            } else if (e_max === null || e_max < target.value) {
              e_max = target;
            }
            if (val < weight + target.value) {
              val = weight + target.value;
            }
          }
          if (e_bot != null) {
            e_bot.value = Infinity;
            e_bot.dep(e);
            e_bot.formula.symbolicExpand(e_bot, this);
          } else if ((e_max != null) || e.targets.length === 0) {
            if (val < e.source.value) {
              _ref1 = e.source.deps;
              for (_k = 0, _len = _ref1.length; _k < _len; _k++) {
                edge = _ref1[_k];
                queue.push_dep(edge);
              }
              e.source.value = val;
              if (e.source === v0 && val === 0) {
                break;
              }
            }
            if (e.source.value > 0) {
              e_max.dep(e);
            }
          }
        }
        if (e instanceof CoverEdge) {
          if (e.target.value === null) {
            e.target.value = Infinity;
            e.target.dep(e);
            e.target.formula.symbolicExpand(e.target, this);
          } else if (e.target.value < e.k) {
            if (e.source.value !== 0) {
              e.source.value = 0;
              _ref2 = e.source.deps;
              for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
                edge = _ref2[_l];
                queue.push_dep(edge);
              }
              if (e.source === v0) {
                break;
              }
            }
          } else {
            e.target.dep(e);
          }
        }
      }
      retval = {
        result: v0.value === 0,
        'Cover-edges': _nb_covers,
        'Hyper-edges': _nb_hyps,
        'Configurations': this.nb_confs,
        'Iterations': iterations
      };
      if (exp_stats) {
        retval['Queue size'] = {
          sparklines: queue_sizes.slice(0, queue_size_i),
          value: ", max " + max_queue,
          options: {
            chartRangeMin: 0,
            tooltipFormat: "{{y}} edges in queue in the {{x}}'th iteration"
          }
        };
      }
      return retval;
    };

    SymbolicEngine.prototype.global = function(exp_stats) {
      _nb_hyps = _nb_covers = 0;
      this.global_init();
      return this.global_propagate(exp_stats);
    };

    SymbolicEngine.prototype.global_init = function() {
      var c, e, i, state, target, weight, _i, _j, _len, _ref, _ref1;
      state = this.initState;
      this.g_c0 = this.getConf(state, this.formula);
      this.g_confs = [this.g_c0];
      this.g_fresh = [this.g_c0];
      while (this.g_fresh.length !== 0) {
        c = this.g_fresh.pop();
        this.queue = [];
        c.formula.symbolicExpand(c, this);
        c.succ = this.queue;
        this.queue = null;
        _ref = c.succ;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          if (e instanceof HyperEdge) {
            for (i = _j = 0, _ref1 = e.targets.length; _j < _ref1; i = _j += 2) {
              weight = e.targets[i];
              target = e.targets[i + 1];
              if (target.explored == null) {
                target.explored = true;
                this.g_confs.push(target);
                this.g_fresh.push(target);
              }
            }
          }
          if (e instanceof CoverEdge) {
            if (e.target.explored == null) {
              e.target.explored = true;
              this.g_confs.push(e.target);
              this.g_fresh.push(e.target);
            }
          }
        }
        c.value = Infinity;
      }
    };

    SymbolicEngine.prototype.global_propagate = function(exp_stats) {
      var c, changes, cstat_count, cstat_i, cstat_interval, cstat_table, e, i, iterations, max, opts, retval, target, weight, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2;
      changes = 1;
      iterations = 0;
      cstat_table = [];
      cstat_interval = 1;
      cstat_count = 1;
      cstat_i = 0;
      while (changes > 0 && this.g_c0.value !== 0) {
        changes = 0;
        _ref = this.g_confs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (c.value === 0) {
            continue;
          }
          _ref1 = c.succ;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            e = _ref1[_j];
            if (e instanceof HyperEdge) {
              max = 0;
              for (i = _k = 0, _ref2 = e.targets.length; _k < _ref2; i = _k += 2) {
                weight = e.targets[i];
                target = e.targets[i + 1];
                if (weight + target.value > max) {
                  max = weight + target.value;
                }
              }
              if (max < c.value) {
                changes += 1;
                c.value = max;
              }
            }
            if (e instanceof CoverEdge) {
              if (e.target.value < e.k) {
                changes += 1;
                c.value = 0;
              }
            }
          }
        }
        if (exp_stats) {
          cstat_count -= 1;
          if (cstat_count === 0) {
            cstat_table[cstat_i++] = changes;
            if (cstat_i > 100) {
              cstat_i = 0;
              for (i = _l = 0; _l < 100; i = _l += 5) {
                cstat_table[cstat_i++] = cstat_table[i];
              }
              cstat_interval *= 5;
            }
            cstat_count = cstat_interval;
          }
        }
        iterations++;
      }
      retval = {
        result: this.g_c0.value === 0,
        'Cover-edges': _nb_covers,
        'Hyper-edges': _nb_hyps,
        'Configurations': this.nb_confs,
        'Iterations': iterations
      };
      if (exp_stats) {
        opts = {
          chartRangeMin: 0,
          tooltipFormat: "iteration with {{value}} changes"
        };
        if (cstat_interval === 1) {
          opts['type'] = 'bar';
        }
        retval['Changes / Iteration'] = {
          sparklines: cstat_table.slice(0, cstat_i),
          options: opts
        };
      }
      return retval;
    };

    SymbolicEngine.prototype.getConf = function(state, formula) {
      var val;
      if (state.confs == null) {
        state.confs = {};
      }
      val = state.confs[formula.id];
      if (val == null) {
        this.nb_confs++;
        state.confs[formula.id] = val = new Configuration(state, formula);
      }
      return val;
    };

    return SymbolicEngine;

  })();

  WCTL.BoolExpr.prototype.symbolicExpand = function(conf, ctx) {
    if (conf.formula.value) {
      ctx.queue.push(new HyperEdge(conf, []));
    }
  };

  WCTL.AtomicExpr.prototype.symbolicExpand = function(conf, ctx) {
    if (conf.formula.negated) {
      if (!conf.state.hasProp(conf.formula.prop)) {
        ctx.queue.push(new HyperEdge(conf, []));
      }
    } else if (!conf.formula.negated && conf.state.hasProp(conf.formula.prop)) {
      ctx.queue.push(new HyperEdge(conf, []));
    }
  };

  WCTL.OperatorExpr.prototype.symbolicExpand = function(conf, ctx) {
    if (conf.formula.operator === WCTL.operator.AND) {
      ctx.queue.push(new HyperEdge(conf, [0, ctx.getConf(conf.state, conf.formula.expr1), 0, ctx.getConf(conf.state, conf.formula.expr2)]));
    } else if (conf.formula.operator === WCTL.operator.OR) {
      ctx.queue.push(new HyperEdge(conf, [0, ctx.getConf(conf.state, conf.formula.expr1)]), new HyperEdge(conf, [0, ctx.getConf(conf.state, conf.formula.expr2)]));
    } else {
      throw "Operator must be either AND or OR";
    }
  };

  WCTL.UntilUpperExpr.prototype.symbolicExpand = function(conf, ctx) {
    var bound, branches, expr1, expr2, quant, state, _ref;
    state = conf.state;
    _ref = conf.formula, quant = _ref.quant, expr1 = _ref.expr1, expr2 = _ref.expr2, bound = _ref.bound;
    if (bound !== '?') {
      ctx.queue.push(new CoverEdge(conf, bound + 1, ctx.getConf(state, conf.formula.abstract())));
      return;
    }
    ctx.queue.push(new HyperEdge(conf, [0, ctx.getConf(state, expr2)]));
    if (quant === WCTL.quant.E) {
      state.next(function(weight, target) {
        return ctx.queue.push(new HyperEdge(conf, [0, ctx.getConf(state, expr1), weight, ctx.getConf(target, conf.formula)]));
      });
    } else if (quant === WCTL.quant.A) {
      branches = [];
      state.next(function(weight, target) {
        return branches.push(weight, ctx.getConf(target, conf.formula));
      });
      if (branches.length > 0) {
        branches.push(0, ctx.getConf(state, expr1));
        ctx.queue.push(new HyperEdge(conf, branches));
      }
    } else {
      throw "Unknown quantifier " + quant;
    }
  };

  WCTL.WeakUntilExpr.prototype.symbolicExpand = function() {
    throw new Error("Weak until with lower bounds not supported by this engine");
  };

  WCTL.NextExpr.prototype.symbolicExpand = function(conf, ctx) {
    var branches, state;
    state = conf.state;
    if (this.quant === WCTL.quant.E) {
      state.next((function(_this) {
        return function(weight, target) {
          if (weight <= _this.bound) {
            return ctx.queue.push(new HyperEdge(conf, [0, ctx.getConf(target, _this.expr)]));
          }
        };
      })(this));
    } else if (this.quant === WCTL.quant.A) {
      branches = [];
      state.next((function(_this) {
        return function(weight, target) {
          if (weight <= _this.bound) {
            return branches.push(0, ctx.getConf(target, _this.expr));
          }
        };
      })(this));
      if (branches.length > 0) {
        ctx.queue.push(new HyperEdge(conf, branches));
      }
    } else {
      throw "Unknown quantifier " + WCTL.quant.E;
    }
  };

  WCTL.NotExpr.prototype.symbolicExpand = function() {
    throw new Error("Negation operator not supported by this engine");
  };

  WCTL.ComparisonExpr.prototype.symbolicExpand = function(conf, ctx) {
    var v1, v2;
    v1 = this.expr1.evaluate(conf.state);
    v2 = this.expr2.evaluate(conf.state);
    if (this.cmpOp(v1, v2)) {
      ctx.queue.push(new HyperEdge(conf, []));
    }
  };

}).call(this);
