var currentCodeFlower;
var createCodeFlower = function(json) {
    // update the jsonData textarea
    //document.getElementById('jsonData').value = JSON.stringify(json);
    // remove previous flower to save memory
    if (currentCodeFlower) currentCodeFlower.cleanup();
    // adapt layout size to the total number of elements
    var total = countElements(json);
    //w = parseInt(Math.sqrt(total + 10) * 30, 10);
    //h = parseInt(Math.sqrt(total + 10) * 30, 10);
    w = document.getElementById('visualization').clientWidth;
    //h = w / 2;
    h = w;
    // create a new CodeFlower
    currentCodeFlower = new CodeFlower("#visualization", w, h).update(json);
};

d3.json('data.json', createCodeFlower);

//document.getElementById('project').addEventListener('change', function() {
    //d3.json(this.value, createCodeFlower);
//});

//document.getElementById('jsonInput').addEventListener('submit', function(e) {
    //e.preventDefault();
    //document.getElementById('visualization').scrollIntoView();
    //var json = JSON.parse(document.getElementById('jsonData').value);
    //currentCodeFlower.update(json);
//});


// WEBSOCKETS:
var Ws = (function() {

    let api = {};

	//var wsUri = 'ws://echo.websocket.org/';
	api.wsUri = 'wss://ws.blockchain.info/inv';
	api.websocket = null;
	api.waitTx = false;
    api.isOpen = false;
	api.tx = {
        name: 'root',
        size: 100,
        children: []
    };
	api.output = null;
	api.pingTimeout = null;
	api.getTxTimeout = null;

	api.init = function() {
		api.output = document.getElementById("output");
		api.testWebSocket();
	}

	api.testWebSocket = function() {
	    api.websocket = new WebSocket(api.wsUri);
	    api.websocket.onopen = function(evt) { api.onOpen(evt) };
	    api.websocket.onclose = function(evt) { api.onClose(evt) };
	    api.websocket.onmessage = function(evt) { api.onMessage(evt) };
	    api.websocket.onerror = function(evt) { api.onError(evt) };
	}

	api.onOpen = function(evt) {
		console.log('CONNECTED');
        api.isOpen = true;
		//doSend('{"op":"ping_block"}');
		//doSend('{"op":"ping_tx"}');
		//ping();
		api.getTx();
	}

	api.ping = function() {
		api.pingTimeout = setTimeout(function() {
			api.doSend('{"op":"ping"}');
			api.ping();
		}, 20000);
	}

	api.getTx = function() {
		api.getTxTimeout = setTimeout(function() {
			api.waitTx = true;
			api.doSend('{"op":"ping_tx"}');
			api.getTx();
		}, 1000);
	}

	api.onClose = function(evt) {
		console.log('DISCONNECTED');
        api.isOpen = false;
		//clearTimeout(pingTimeout);
		clearTimeout(api.getTxTimeout);
	}

	api.onMessage = function(evt) {
		var children = [];
		var res = JSON.parse(evt.data);
		const RATIO = 1000000;
		console.log('RESPONSE:', res);

		if (api.waitTx && res.op === 'utx') {
			api.waitTx = false;
            console.log('API.TX 1:', api.tx)
			if ((api.tx.children.length === 0)
			 || ((api.tx.children[0]) && (api.tx.children[0].hash !== res.x.hash))) {

				for (var i = 0; i < res.x.inputs.length; i++) {
					children.push({
						name: res.x.inputs[i].prev_out.addr,
						size: res.x.inputs[i].prev_out.value / RATIO
					})
				}

                // keep the app lighter ;)
                if (api.tx.children.length > 30)
                    api.tx.children = [];

				api.tx.children.unshift({
					name: res.x.hash,
					size: res.x.out[0].value / RATIO,
					children: children
				});

                console.log('API.TX 2:', api.tx)

				currentCodeFlower.update(api.tx);
			}
			//else console.log('SAME TX');
		}
	}

	api.onError = function(evt) {
		console.log('ERROR:', evt.data);
	}

	api.doSend = function(message) {
		console.log('SENT: ' + message);
		api.websocket.send(message);
	}

	api.writeToScreen = function(message) {
		var pre = document.createElement('p');
		pre.style.wordWrap = 'break-word';
		pre.innerHTML = message;
		api.output.appendChild(pre);
	}

    return api;

}());

document.getElementById('disconnect').addEventListener('click', function(e) {
    e.preventDefault();
    console.log(Ws);
    if (Ws.isOpen) {
        Ws.websocket.close();
        this.innerHTML = 'Connect';
        console.log('CLOSE WEBSOCKET');
    }
    else {
        Ws.testWebSocket();
        console.log('this:', this);
        this.innerHTML = 'Disconnect';
        console.log('MANUALLY OPEN WEBSOCKET');
    }
});

window.addEventListener('load', Ws.init, false);

// Parallax effect:
// source: http://untame.net/2013/04/how-to-integrate-simple-parallax-with-twitter-bootstrap/
window.addEventListener('load', function() {
    // cache the window object
    $window = $(window);

    $('.bg[data-type="background"]').each(function(){
        // declare the variable to affect the defined data-type
        var $scroll = $(this);

        $(window).scroll(function() {
            // HTML5 proves useful for helping with creating JS functions!
            // also, negative value because we're scrolling upwards                             
            var yPos = -($window.scrollTop() / $scroll.data('speed')); 

            // background position
            var coords = '50% '+ yPos + 'px';

            // move the background
            $scroll.css({ backgroundPosition: coords });    
        }); // end window scroll
    });  // end section function

    // IE:
    document.createElement('header');
    document.createElement('section');

}, false);
