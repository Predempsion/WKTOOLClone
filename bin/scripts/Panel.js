// Generated by CoffeeScript 1.7.1
(function() {
  var deleteMenuItemClick, load, loadEmptyProject, loadExample, loadFromFileMenuItemClick, loadMenuItemClick, loadScalableModelDialogFinished, loadScalableModelMenuItemClick, restoreSession, save, saveToLocalStorage, saveWithOverwriteToLocalStorage, updateLoadMenu, _inits, _layout, _layoutState, _loadedProjectName, _showMessageTimeout;

  _layout = null;

  _layoutState = null;

  _inits = [];

  this.Init = function(c) {
    return _inits.push(c);
  };

  $(function() {
    var c, options, _i, _len;
    for (_i = 0, _len = _inits.length; _i < _len; _i++) {
      c = _inits[_i];
      c();
    }
    options = {
      applyDefaultStyles: false,
      onresize: function() {
        return Editor.height($('#editor').height() - 30);
      },
      maxSize: "80%",
      fxSpeed: "slow"
    };
    restoreSession();
    if (_layoutState != null) {
      options['south__initClosed'] = _layoutState.closed;
      options['south__size'] = _layoutState.size;
    }
    $(window).resize();
    _layout = $('#splitter').layout(options);
    return Editor.height($('#editor').height() - 30);
  });

  Init(function() {
    return $(window).resize(function() {
      return $('#splitter').height($(window).height() - $('.navbar').height() - 20);
    });
  });

  load = function(json) {
    var max_untitled;
    if (json == null) {
      json = {};
    }
    max_untitled = updateLoadMenu();
    $('#project-name').val(json.name || ("Untitled Project " + (max_untitled + 1)));
    Editor.load(json.model);
    Verifier.load(json.properties);
    if (json.pane != null) {
      if (_layout == null) {
        return _layoutState = {
          size: json.pane.size,
          closed: json.pane.closed
        };
      } else {
        if (json.pane.closed) {
          _layout.close('south');
        } else {
          _layout.open('south');
        }
        return _layout.sizePane('south', json.pane.size || 350);
      }
    } else {
      if (_layout == null) {
        return _layoutState = {
          size: 350,
          closed: false
        };
      } else {
        return _layout.sizePane('south', 350);
      }
    }
  };

  save = function() {
    return {
      name: $('#project-name').val(),
      model: Editor.save(),
      properties: Verifier.save(),
      pane: {
        closed: _layout.state.south.isClosed,
        size: _layout.state.south.size
      }
    };
  };

  Init(function() {
    updateLoadMenu();
    return $('#save-menu').click(function() {
      saveToLocalStorage();
      return Utils.track('UI', 'menu-click', 'save-to-localstorage');
    });
  });

  updateLoadMenu = function() {
    var add_divider, del_entries, entries, entry, examples, i, link, match, max_untitled, name, ordering, _i, _j, _k, _len, _len1, _ref;
    examples = $('#examples-menu').detach();
    $('#load-menu').empty();
    $('#delete-menu-items').empty();
    max_untitled = 0;
    entries = [];
    del_entries = [];
    for (i = _i = 0, _ref = localStorage.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      match = /^project\/([^]*)$/.exec(localStorage.key(i));
      if (match != null) {
        name = match[1];
        if (add_divider) {
          add_divider = false;
        }
        entry = $('<a>');
        entry.html(name);
        entry.data('project-name', name);
        entry.click(loadMenuItemClick);
        entries.push(entry);
        entry = $('<a>');
        entry.html(name);
        entry.data('project-name', name);
        entry.click(deleteMenuItemClick);
        del_entries.push(entry);
        match = /Untitled Project ([1-9][0-9]*)/.exec(name);
        if (match != null) {
          max_untitled = Math.max(max_untitled, match[1]);
        }
      }
    }
    ordering = function(a, b) {
      if (a.data('project-name') > b.data('project-name')) {
        return 1;
      }
      return -1;
    };
    entries.sort(ordering);
    del_entries.sort(ordering);
    for (_j = 0, _len = entries.length; _j < _len; _j++) {
      entry = entries[_j];
      $('#load-menu').append($('<li>').append(entry));
    }
    if (entries.length > 0) {
      $('#load-menu').append($('<li>').addClass('divider'));
    }
    link = $('<a>').html("Empty project").click(function() {
      loadEmptyProject();
      return Utils.track('UI', 'menu-click', 'load-empty-project');
    });
    $('#load-menu').append($('<li>').append(link));
    $('#load-menu').append(examples);
    link = $('<a>').html("Load from file").click(loadFromFileMenuItemClick);
    $('#load-menu').append($('<li>').append(link));
    for (_k = 0, _len1 = del_entries.length; _k < _len1; _k++) {
      entry = del_entries[_k];
      $('#delete-menu-items').append($('<li>').append(entry));
    }
    if (del_entries.length > 0) {
      $('#delete-menu').removeClass('disabled');
    } else {
      $('#delete-menu').addClass('disabled');
    }
    return max_untitled;
  };

  loadEmptyProject = function() {
    return load();
  };

  _loadedProjectName = null;

  saveToLocalStorage = function() {
    var name;
    name = $('#project-name').val();
    if (_loadedProjectName !== name) {
      if (localStorage.getItem("project/" + name) != null) {
        $('.overwrite-name').html(name);
        $('#overwrite-warning').modal();
        Utils.track('UI', 'overwrite-localstorage-warning', name);
      }
    }
    return saveWithOverwriteToLocalStorage();
  };

  Init(function() {
    return $('#overwrite-button').click(saveWithOverwriteToLocalStorage);
  });

  saveWithOverwriteToLocalStorage = function() {
    var name;
    name = $('#project-name').val();
    localStorage.setItem("project/" + name, JSON.stringify(save()));
    _loadedProjectName = name;
    updateLoadMenu();
    ShowMessage("Saved \"" + name + "\" to LocalStorage");
    return Utils.track('UI', 'save-to-localstorage', name);
  };

  loadMenuItemClick = function() {
    var json, name;
    name = $(this).data('project-name');
    json = localStorage.getItem("project/" + name);
    if (json != null) {
      load(JSON.parse(json));
      _loadedProjectName = name;
      ShowMessage("Loaded \"" + name + "\" from LocalStorage");
      Utils.track('UI', 'loaded-from-localstorage', name);
    } else {
      ShowMessage("Failed to load \"" + name + "\" from LocalStorage");
      updateLoadMenu();
      Utils.track('UI', 'error', "Failed to load " + name + " from localStorage");
    }
    return Utils.track('UI', 'menu-click', 'load-from-localstorage');
  };

  loadFromFileMenuItemClick = function() {
    $('#file-browser').click();
    return Utils.track('UI', 'menu-click', 'load-from-file');
  };

  Init(function() {
    return $('#file-browser').change(function() {
      var file, reader;
      file = this.files[0];
      if (file != null) {
        reader = new FileReader();
        reader.onload = function() {
          load(JSON.parse(reader.result));
          ShowMessage("Loaded \"" + ($('#project-name').val()) + "\" from \"" + file.name + "\"");
          return Utils.track('UI', 'loaded-from-file', $('#project-name').val());
        };
        return reader.readAsText(file);
      }
    });
  });

  deleteMenuItemClick = function() {
    var name, removeFromStorage;
    name = $(this).data('project-name');
    if (localStorage.getItem("project/" + name) != null) {
      removeFromStorage = function() {
        $('#delete-button').off('click.removeFromStorage');
        localStorage.removeItem("project/" + name);
        updateLoadMenu();
        return ShowMessage("Removed \"" + name + "\" from LocalStorage");
      };
      $('.delete-name').html(name);
      $('#delete-button').on('click.removeFromStorage', removeFromStorage);
      $('#delete-warning').modal();
    } else {
      ShowMessage("Failed to delete \"" + name + "\" from LocalStorage");
      updateLoadMenu();
      Utils.track('UI', 'error', 'failed to delete from localstorage');
    }
    return Utils.track('UI', 'menu-click', 'delete-menu-item');
  };

  _showMessageTimeout = null;

  this.ShowMessage = function(msg) {
    $('#message-box').html(msg).fadeIn(500);
    if (_showMessageTimeout != null) {
      clearTimeout(_showMessageTimeout);
    }
    return _showMessageTimeout = setTimeout((function() {
      return $('#message-box').fadeOut(500);
    }), 2000);
  };

  Init(function() {
    var _lastBlobUrl;
    _lastBlobUrl = null;
    return $('#download-file').mousedown(function() {
      if (_lastBlobUrl != null) {
        URL.revokeObjectURL(_lastBlobUrl);
      }
      _lastBlobUrl = URL.createObjectURL(new Blob([JSON.stringify(save())]));
      $('#download-file')[0].href = _lastBlobUrl;
      $('#download-file')[0].download = $('#project-name').val() + '.wkp';
      return Utils.track('UI', 'menu-click', 'export-file');
    });
  });

  Init(function() {
    var factory, link, model, models, name, _i, _len;
    $('#examples a').click(function() {
      loadExample($(this).html());
      return Utils.track('UI', 'menu-click', 'load-example');
    });
    models = ((function() {
      var _results;
      _results = [];
      for (name in ScalableModels) {
        factory = ScalableModels[name];
        _results.push(name);
      }
      return _results;
    })()).sort();
    $('#examples').append($('<div>').addClass('divider'));
    for (_i = 0, _len = models.length; _i < _len; _i++) {
      model = models[_i];
      link = $('<a>');
      link.html(model);
      link.data('model', model);
      link.click(loadScalableModelMenuItemClick);
      $('#examples').append($('<li>').append(link));
    }
    return $('#load-scalable-model-button').click(loadScalableModelDialogFinished);
  });

  loadScalableModelMenuItemClick = function() {
    var body, div, i, init_val, model, model_name, p, param, _i, _len, _ref;
    model_name = $(this).data('model');
    model = ScalableModels[model_name];
    body = $('#scalable-model-dialog .modal-body');
    body.empty();
    _ref = model.parameters;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      param = _ref[i];
      init_val = model.defaults[i];
      p = $('<p>').html(param);
      div = $('<div>').addClass('input-prepend');
      div.append($('<span>').addClass('add-on').html('Enter number:'));
      div.append($('<input />').attr({
        type: 'text'
      }).val(init_val).data('index', i));
      body.append(p);
      body.append(div);
    }
    $('.scalable-model-name').html(model_name);
    $('#scalable-model-dialog').data('model', model_name);
    $('#scalable-model-dialog').modal();
    return Utils.track('UI', 'menu-click', 'load-scalable-model');
  };

  loadScalableModelDialogFinished = function() {
    var m, model, model_name, params;
    model_name = $('#scalable-model-dialog').data('model');
    model = ScalableModels[model_name];
    params = [];
    $("#scalable-model-dialog .modal-body input").each(function() {
      var ival, val;
      if (params == null) {
        return;
      }
      val = $(this).val();
      ival = parseInt(val);
      if (typeof ival !== 'number' && ival % 1 === 0) {
        ShowMessage("Model Instantiation Failed \"" + val + "\" isn't a number!");
        params = null;
        Utils.track('UI', 'failed-scalable-model-instantiation', model_name);
        return;
      }
      params[$(this).data('index')] = ival;
      return Utils.track('scalable-models', model_name, model.parameters[$(this).data('index')], ival);
    });
    if (params == null) {
      return;
    }
    m = model.factory.apply(model, params);
    if (m != null) {
      load(m);
      ShowMessage("Instantiated and Loaded \"" + model_name + "\"");
      return Utils.track('UI', 'loaded-scalable-model', model_name);
    }
  };

  loadExample = function(name) {
    return $.ajax({
      url: "examples/" + name + ".wkp",
      dataType: 'json',
      success: function(data) {
        load(data);
        ShowMessage("Loaded the \"" + name + "\" example!");
        return Utils.track('UI', 'loaded-example', name);
      },
      error: function() {
        ShowMessage("Failed to load the \"" + name + "\" example!");
        return Utils.track('UI', 'error', "Failed to load example " + name);
      }
    });
  };

  restoreSession = function() {
    var name, session;
    name = localStorage.getItem("last-loaded-project-name");
    session = localStorage.getItem("last-session");
    if ((name != null) && (session != null)) {
      _loadedProjectName = JSON.parse(name);
      return load(JSON.parse(session));
    } else {
      return loadEmptyProject();
    }
  };

  $(window).unload(function() {
    localStorage.setItem("last-loaded-project-name", JSON.stringify(_loadedProjectName));
    return localStorage.setItem("last-session", JSON.stringify(save()));
  });

  Init(function() {
    var frame, layer, overwriteFrame;
    layer = $('#visualization-layer');
    frame = $('#visualization-layer iframe');
    overwriteFrame = false;
    layer.click(function() {
      overwriteFrame = true;
      return layer.fadeOut(function() {
        if (overwriteFrame) {
          return frame.prop('src', "");
        }
      });
    });
    return $('#visualize').click(function() {
      layer.fadeIn();
      overwriteFrame = false;
      frame.prop('src', "visualize.html");
      return Utils.track('UI', 'menu-click', 'visualize');
    });
  });

  window.onmessage = function(e) {
    if (e.origin !== Utils.origin()) {
      return;
    }
    if (e.data.type === 'request-model-message') {
      e.source.postMessage({
        type: 'visualize-model-message',
        model: Editor.model(),
        mode: Editor.mode()
      }, Utils.origin());
    }
    if (e.data.type === 'close-visualization-message') {
      $('#visualization-layer').click();
    }
    if (e.data.type === 'visualization-error-message') {
      $('#visualization-layer').click();
      if (typeof e.data.message === 'string') {
        ShowMessage(e.data.message);
      }
    }
    if (e.data.type === 'close-help-message') {
      return $('#help-layer').click();
    }
  };

  Init(function() {
    var frame, layer;
    layer = $('#help-layer');
    frame = $('#help-layer iframe');
    layer.click(function() {
      return layer.fadeOut(function() {
        return frame.prop('src', "");
      });
    });
    return $('#show-help').click(function() {
      layer.fadeIn();
      frame.prop('src', "help.html");
      return Utils.track('UI', 'menu-click', 'help');
    });
  });

  this.fetchTaskGraph = function(file) {
    var data, req;
    req = new XMLHttpRequest();
    req.open('GET', Utils.origin() + file, false);
    req.send(null);
    data = null;
    if (req.status === 200) {
      data = req.responseText;
    }
    return data;
  };

}).call(this);
