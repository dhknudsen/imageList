(function() {
	
	// Root Variables
	var 
	defaults = {
		containerId			: 'container',
		templateId 			: 'imageTmpl',
		template				: null, 
		maxrender  			: 20,
		parent 	 	 			: 'ul',
		parentClass			: 'image-list',
		animationDelay 	: '30',
		buttonText 			: 'Show More',
		buttonId				: 'buttonTmpl',
		buttonTemplate  : null
	},

	// DOM Elements
	wrapper, 
	parent, 
	childen,
	button, 

	// Templates
	tmpl,	
	buttonTmpl,

	// tracker of number of rendered. 
	currentlyShowing = null;


	/**
	 * Renders an imageList given the data input in the specified output container
	 * Depends: underscore.js
	 * @param  {Array} 	jsonArr		Data to render
	 * @param  {Object} options		User settings Object
	 * @return {[type]}
	 */
	window.layoutImages = function (jsonArr, options) {
		// Fail silently if data input is invalid 
		if(!jsonArr instanceof Array) return;

		// Merge defaults with user settings 
		settings = _.extend({}, defaults, options);
		
		// Grab template(s) from either DOM or settings and make underscore template factories		
		tmpl = _.template((settings.template) ? settings.template : document.getElementById(settings.templateId).text),
		buttonTmpl = _.template((settings.buttonTemplate) ? settings.buttonTemplate : document.getElementById(settings.buttonId).text);

		// create our wrapper
		wrapper = document.createElement('div'); 
		wrapper.className = 'wrapper';

		// create our parent
		parent = document.createElement(settings.parent);
		parent.className = settings.parentClass + " " + 'group';

		//...and inject into DOM
		wrapper.appendChild(parent);
		document.getElementById(settings.containerId).appendChild(wrapper);

		// Determine if we render all or the maxlength of images
		currentlyShowing = (settings.maxrender && settings.maxrender < jsonArr.length) ? settings.maxrender : jsonArr.length;

		// Render the selected image set to the parent element
		renderImages(jsonArr.slice(0,currentlyShowing), tmpl, parent);

		// Add the 'more' button
		parent.insertAdjacentHTML('afterend', buttonTmpl({label: settings.buttonText}));
		button = document.querySelector('button');

		// Add click handler to button
		bean.on(button, 'click touchstart',	function (e) {

			var data; 
			if(currentlyShowing+2 <= jsonArr.length){
				data = jsonArr.slice(currentlyShowing, currentlyShowing+2);
				currentlyShowing = currentlyShowing + 2; 
			} else {
				data = [
					{ "name":  "Image1", "url": "http://farm5.staticflickr.com/4010/4578838483_f9c66aece1_z.jpg" },
  				{ "name":  "Image2", "url": "http://farm8.staticflickr.com/7214/7030801869_0dbf5fa4a3_z.jpg"},
				];
			}
			
			renderImages(data, tmpl, parent);
			adjustGutterWidth();

		});

		// Save image elements for later manipulation
		children = parent.children;



		// Set gutters between images (first load)
		adjustGutterWidth();

		// Update gutters when window resizes. 
		window.onresize = adjustGutterWidth;
	}

	// Setup and Helper functions ----------------------------------------------------

	
	/////////////////////////////////////////////////////////////////
	// Change the underscore template syntax (personal preference) //
	/////////////////////////////////////////////////////////////////
	_.templateSettings = {
	    interpolate: /\{\{=(.+?)\}\}/g,
	    evaluate: /\{\{(.+?)\}\}/g,
	};


	///////////////////////////////////////////////
	// parseUri 1.2.2                            //
	// (c) Steven Levithan <stevenlevithan.com>  //
	// MIT License                               //
	// Used for enabling debugging mode 				 //
	///////////////////////////////////////////////
	function parseUri(a){for(var b={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},c=b.parser[b.strictMode?"strict":"loose"].exec(a),d={},e=14;e--;)d[b.key[e]]=c[e]||"";return d[b.q.name]={},d[b.key[12]].replace(b.q.parser,function(a,c,e){c&&(d[b.q.name][c]=e)}),d}
	var uri = parseUri(document.URL);


	/**
	 * Helper function: simple debug console logger 
	 * @param  {String} expression the expression to be sent to console
	 */
	function log (expression){
		if(uri['queryKey'].hasOwnProperty('debug')) console.log(expression);
	}


	/**
	 * Renders the given data into the desired output
	 * @param  {Array} 	data
	 * @param  {Object} template
	 * @param  {DOM Element} output	
	 * @return {[type]}
	 */
	function renderImages (data, template, parentElm){
		if(data instanceof Array) {
			data.forEach(function(item, index){
				item.delay = (settings.animationDelay * index) + "ms";
				parentElm.insertAdjacentHTML('beforeend', template(item));
			})
		}
	} 


	/**
	 * Helper function: (Re)calculate the horisontal gutter width needed between images 
	 * to fill the width of the parent container 
	 * @param  {DOM Element} parent
	 */
	function adjustGutterWidth() {
	
		var	
		// Extract the parent padding after styles are applied
		paddingLeft			= parseInt(getStyle(parent, 'padding-left'), 10),
		paddingRight		= parseInt(getStyle(parent, 'padding-right'), 10),
		
		// Calculate the parent width to be occupied by images (total width - padding) 
		parentWidth 		= parent.clientWidth - (paddingLeft + paddingRight),
		
		// Extract the current image container width after styles are applied
		childWidth 			= parseInt(getStyle(parent.children[0], 'width'), 10),

		// Calculate how many images can fit in a row
		numInRow 				= Math.floor(parentWidth/childWidth),
		
		// Calculate the remaining space after filling the row
		remainder				= parentWidth % childWidth;

		//Deal with cases where we have less images than there can fit in the first row. 
		if (numInRow > currentlyShowing) {
			remainder = remainder + ((numInRow - currentlyShowing)*childWidth);
			numInRow = currentlyShowing;
		}  


		// Calculate the distribution of space between images in a row
		newMarginRight 	= remainder / (numInRow-1);

				
		log('parent: ' + parentWidth + ', child: ' + childWidth);
		log('numinRow: ' + numInRow + ", remainder: " + remainder + ', newMarginRight: ' + newMarginRight );


		for(var i=0,len=children.length; i<len; i=i+1){
			children[i].style.marginRight = ((i+1) % numInRow !== 0) ? newMarginRight + "px" : "0px";
		}

	}


	/**
	 * Helper function: extract computed styles from a DOM Element
	 * @param  {DOM Element} oElm
	 * @param  {String} css3Prop
	 * @return {String}
	 */
	function getStyle(oElm, css3Prop){
		var strValue = "";

		if(window.getComputedStyle){
			strValue = getComputedStyle(oElm).getPropertyValue(css3Prop);
		}
	  //IE
	  else if (oElm.currentStyle){
	  	try {
	  		strValue = oElm.currentStyle[css3Prop];
	  	} catch (e) {}
	  }

	  return strValue;
	}


}());