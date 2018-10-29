window.APPLICATION_LAYER_IDS = [];

 function ApplicationLayer(layer_id, config) {
    var isLayerExists = false;
    var verbose = true;
    var $this = this;

    this.pluginName = 'ApplicationLayer';
    this.pluginVersion = '1.0.0';

    this.debug = function (title, message){
        if(verbose) {
            console.log(this.pluginName+'@'+title+': '+message);
        }
    };

    //Validate Layer
    if(window.APPLICATION_LAYER_IDS.indexOf(layer_id) == -1) {
        window.APPLICATION_LAYER_IDS.push(layer_id);
        isLayerExists = false;
        this.debug('Create Layer', layer_id);
    } else {
        isLayerExists = true;
        this.debug('Existing Layer', layer_id);
    }

    //Set configuration
    var defaultConfig = {
        'title':'Title',
        'content': 'Hello World!'
    };
    
    this.config = $.extend( {}, defaultConfig, config );
    
    if(isLayerExists) {
        //selectors
    } else {
        //create doms
    }

    return $this;

};

$.extend(ApplicationLayer.prototype, {
    'getInstanceIds': function(){
        console.log(window.APPLICATION_LAYER_IDS);
    }
});