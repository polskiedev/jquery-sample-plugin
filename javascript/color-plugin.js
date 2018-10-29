(function($){

$.fn.myplugin = function(options){

	var defaults = {
		myval: 1,
		mycolor: 'blue',
		storeValue: '#myInput'
	},
	settings = $.extend({}, defaults, options);


	return this.each(function(){
		$(this).click(function(){
			doSomething();
		});
	});


	function doSomething(){
		$(settings.storeValue).val(settings.mycolor);
	}
   
};
	 
	 
})(jQuery);