'use strict';

// console.log('Script Loaded: plugin.js');

//To Do: Check $plugin varialbe in ajax function //Done.
function PluginManager(userPlugin){
    this.plugin = {
        name: 'PluginManager',
        code: 'PluginManager',
        version: '1.0.0'
    };

    $.extend(this.plugin, userPlugin);

    this._id = null;

    this._bVerbose = true;
    this._bError = false;
    this.config = {};
    this._userConfig = {};
    this._defaultConfig = {};

    this._log = function(message, noPrefix) {
        if(this._bVerbose) {
            var printMsg = message;
            if(!noPrefix) {
                printMsg = this.plugin.name + '> '+printMsg;
            }
            console.log(printMsg);
        }
    };

    this._plugin_init = function() {
        if(!window.PLUGIN) {
            window.PLUGIN = [];
        }

        if(!window.PLUGIN[this.plugin.code]) {
            window.PLUGIN[this.plugin.code] = [];
        }
    };

    this._setDefaultConfig = function(config) {
        $.extend(this._defaultConfig, config);
    };

    this._setConfig = function(config) {
        this._userConfig = config;
        this.config = $.extend( {}, this._defaultConfig, this._userConfig );
    };

    this._getConfig = function() {
        return this.config;
    };

    this._setPluginInstanceId = function(plugin_instance_id) {
        this._id = plugin_instance_id;
        if(!window.PLUGIN[this.plugin.code][this._id]) {
           window.PLUGIN[this.plugin.code][this._id] = {id: this._id, obj: this};
        } else {
            this._bError = true;
            this._log('Instance ID `' + this._id + '` already exists. Please check your configuration.');
        }
    };

    this._getPluginInstanceId = function() {
      return this._id;  
    };

    this._getPluginCode = function() {
      return this.plugin.code;  
    };

    this._getPluginDOMId = function() {
      return 'plugin_'+this._getPluginCode()+'_'+this._getPluginInstanceId();  
    };

    this._init = function() {
        this._plugin_init();
        this.config = $.extend( {}, this._defaultConfig, this._userConfig );
    };

    this._destroy = function() {
        //Destroy plugin footprint from `window` global scope only
        delete window.PLUGIN[this.plugin.code][this._id];
    };

    this.GET_PLUGIN_INSTANCE_IDS = function() {
        return Object.keys(window.PLUGIN[this.plugin.code]);
    };

    this.GET_PLUGIN_INSTANCE = function() {
        return window.PLUGIN[this.plugin.code];
    };

    this._init();
   
    return this;
}

function LayerBuilder(layer_id, config) {
    var oPlugin = new PluginManager({
        name: 'LayerBuilder',
        code: 'LayerBuilder',
        version: '1.0.0'
    });

    var $this = this;
    
    $this.variant = null;

    oPlugin._setPluginInstanceId(layer_id);
    oPlugin._setDefaultConfig({
        'title': 'Layer Title',
        'content': 'Layer Content',
        'ajax': null
    });

    $this.adaptiveConfig = function(config) {
        var newConfig = config;

        if(config.url) {
            newConfig = $.extend({}, config, {
                'ajax': {
                    config: {
                        url: config.url
                    }
                }
            });
        }
        // console.log(newConfig);
        return newConfig;
    };

    config = $this.adaptiveConfig(config);
    oPlugin._setConfig(config);
    $this._plugin = oPlugin;

    $this._log = function(message, noPrefix) {
        $this._plugin._log(message, noPrefix);
    };

    $this.plugin = function() {
        return $this._plugin;
    };

    $this.render = function(variant_id) {
      var oLayerVariant = new LayerVariantBuilder();
      $this.variant = oLayerVariant.getVariant();

      if($this.variant) {
        $this.ui = $this.variant.ui;
        $this.behavior = $this.variant.behavior;

        $this.ui().render();
      }
    }  
}

function LayerVariantBuilder() {
  this.variant = null;
  this.default_variant_id = 'dialog';
  this.setDefault = function(){
    this.setVariant(this.default_variant_id);
  };

  this.setVariant = function(variant_id) {
    if(variant_id == 'dialog') {
      this.variant = new DialogLayerVariant();
    }
    
    return this.variant;
  };

  this.getVariant = function() {
    return this.variant;
  };

  this.setDefault();
}
  
var DialogLayerVariant = function() {};

$.extend(DialogLayerVariant.prototype, {
    ui: function() {
        var $this = this;

        $.extend($this, {
            '$ele': {},
            'defaultTemplate': function() {
                var wrapperId = $this.plugin()._getPluginDOMId();
                var mainWrapper = $('<div/>').attr({'id': wrapperId, 'class':'layer-wrapper'});
                var headerWrapper = $('<div/>').attr({'class': 'layer-header-wrapper'});
                var contentWrapper = $('<div/>').attr({'class': 'layer-content-wrapper'});
                //child DOM (2nd)
                var headerTitleWrapper = $('<div/>').attr({'class': 'layer-header-title-wrapper'});
                var titleBarButtonsWrapper = $('<div/>').attr({'class': 'layer-title-bar-buttons-wrapper'});
                var innerContentWrapper = $('<div/>').attr({'class': 'layer-inner-content-wrapper'});
                //child DOM (3rd)
                var closeBtnWrapper = $('<div/>').attr({'class': 'layer-close-btn-wrapper'});
                //child DOM (4th)
                var btnClose = $('<a/>').attr({'class': 'btn-close', 'href': 'javascript:void(0);'});

                //set DOM html
                headerTitleWrapper.html($this.plugin()._getConfig().title);
                innerContentWrapper.html($this.plugin()._getConfig().content);
                btnClose.text('x');

                //generate DOMs
                closeBtnWrapper.append(btnClose);
                contentWrapper.append(innerContentWrapper);
                titleBarButtonsWrapper.append(closeBtnWrapper);
                headerTitleWrapper.append(titleBarButtonsWrapper);
                headerWrapper.append(headerTitleWrapper);
                headerWrapper.append(titleBarButtonsWrapper);
                mainWrapper.empty().append(headerWrapper).append(contentWrapper);

                //assign to $ele for context reference
                $this.$ele.mainWrapper = mainWrapper;
                $this.$ele.headerWrapper = headerWrapper;
                $this.$ele.contentWrapper = contentWrapper;
                $this.$ele.innerContentWrapper = innerContentWrapper;
                $this.$ele.btnClose = btnClose;

                return mainWrapper;
            },
            'ajax': function() {
                var $ele = $this.$ele;
                var $plugin = $this.plugin();

                if(typeof($this.plugin()._getConfig().ajax) == 'object') {
                    var ajaxDefaults = {
                        'config': {
                            'method': 'GET'
                        },
                        'before': function() {},
                        'after': function() {},
                        'success': function(data, $ele, $plugin) { this.successDefault(data, $ele, $plugin); },
                        'error': function() {},
                        'successDefault': function(data, $ele, $plugin) {
                            // var json = $.parseJSON(data);
                            var json = data;
                            var contentData = json.data.feed;
                            var contentDOM = $ele.innerContentWrapper;
                            
                            contentDOM.html(contentData);
                            // $plugin._log('trigger successDefault()');
                        }
                    };

                    var ajaxify = $.extend(ajaxDefaults, $this.plugin()._getConfig().ajax);

                    if(typeof(ajaxify.before) == 'function') {
                        ajaxify.before($ele, $plugin);
                    }

                    if(typeof(ajaxify.config.url) == 'string') {
                        $.extend(ajaxify.config, {
                            success: function(data) {
                                if(typeof(ajaxify.success) == 'function') {
                                    ajaxify.success(data, $ele, $plugin);
                                }

                                if(typeof(ajaxify.after) == 'function') {
                                    ajaxify.after($ele, $plugin);
                                }
                            },
                            error: function() {
                                ajaxify.error();
                            }
                        });

                        $.ajax(ajaxify.config);
                    }


                }
            },
            'template': function(){
                return this.defaultTemplate();
            },
            'render': function(){
                this.template().appendTo('body');
                this.ajax();
                this.attachBehavior($this);

            },
            attachBehavior: function(context) {
                //Validate behavior
                if(typeof($this.behavior()) == 'object') {
                    $this.behavior().attach(context);
                }
            }
        });

        return $this;
    }
});

$.extend(DialogLayerVariant.prototype, {
    behavior: function() {
        var $this = this;
        var $context = null;

        $.extend($this, {
            defaultBehavior: function(context) {
                // var wrapperId = $this.plugin()._getPluginDOMId();
                // var mainWrapperDom = $('#'+wrapperId);
                context.$ele.btnClose.unbind('click').bind('click', $this.onClose);
            },
            attach: function(context) {
                $context = context;
                this.defaultBehavior($context);
            },
            onClose: function() {
                $context.$ele.mainWrapper.remove();
                $this.plugin()._destroy();
            }
        });
        return $this;
    }
});