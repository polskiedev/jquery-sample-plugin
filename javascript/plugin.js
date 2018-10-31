
function LayerBuilder(layer_id, config){
    this.plugin = {
        name: 'LayerBuilder',
        code: 'LayerBuilder',
        version: '1.0.0'
    };

    this._id = layer_id;
    this.layer_id = this._id;

    this._bVerbose = true;
    this._bError = false;
    this._defaultConfig = {};
    this._userConfig = config;

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

        if(!window.PLUGIN[this.plugin.code][this._id]) {
           window.PLUGIN[this.plugin.code][this._id] = {id: this._id, obj: this};
        } else {
            this._bError = true;
            this._log('Layer ID `' + this._id + '` already exists. Please check your configuration.');
        }
    };

    this._init = function() {
        this._plugin_init();
        this.config = $.extend( {}, this._defaultConfig, this._userConfig );
    };

    this.getInstanceIds = function() {
        return Object.keys(window.PLUGIN[this.plugin.code]);
    };

    this.getAllInstance = function() {
        return window.PLUGIN[this.plugin.code];
    };

    this._init();
   
    return this;
}

$.extend(LayerBuilder.prototype, {
    user_interface: function() {
        var $this = this;

        $.extend($this, {
            '$ele': {},
            'template': function() {
                var parentWrapper = $('<div/>').attr({'id': 'plugin_'+$this.layer_id, 'class':'dialog-wrapper'});
                var headerWrapper = $('<div/>').attr({'class': 'dialog-header'});
                var contentWrapper = $('<div/>').attr({'class': 'dialog-content'});

                parentWrapper.empty().append(headerWrapper).append(contentWrapper);
                this.$ele.wrapper = parentWrapper;
                return parentWrapper;
            },
            'render': function(){
                this.template().appendTo('body');
            }
        });

        return $this;
    }  
});
// ,
//     'behavior': {

//     },
//     'render': function(){
//         this.user_interface.render();
//     }