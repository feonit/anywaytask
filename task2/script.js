/**
 *
 * */

var app;

!function($, global){

	global.app = {};

	app.url = {
		start : 'http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
		status : 'http://api.anywayanyday.com/api/RequestState/?R=ID&_Serialize=JSON',
		result : 'http://api.anywayanyday.com/api/Fares/?R=ID&V=Matrix&VB=true&L=ru&_Serialize=JSON'
	};

	app.url.templates = {
		start : 'http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
		status : 'http://api.anywayanyday.com/api/RequestState/?R=${ID}&_Serialize=JSON',
		result : 'http://api.anywayanyday.com/api/Fares/?R=${ID}&V=Matrix&VB=true&L=ru&_Serialize=JSON'
	};

	app.mockAnswer = {
		startId : '25urBMO0z2f45d',
		completed : 100,
		result : {}
	};


	var fnDone = function (data){

		if (!data) {
			return console.log('Не полученны данные');
		}

		if (data['Error'] !== null) {
			return console.log('Ошибка: ' + data['Error']);
		}

		return data.Id;
	};

	var fnFail = function(jqXHR, textStatus, errorThrown) {
		alert( "error" );
	};

	app.send = function(url, handle){
		$.ajax({
			url : url,
			type : 'GET',
			dataType: 'jsonp',
			crossDomain : true
		})
			.done(handle)
			.fail(fnFail);
	};

	app.requestStart = function(){
		var url = app.url.start,
			handle = function(data){
				console.log(data)
			};

		app.send(url, handle)
	};

	app.requestStatus = function(id){
		var url = $.tmpl( app.url.templates.status, {
				ID : id
			}).text(),

			handle = function(data){
				console.log(data)
			};

		app.send(url, handle)
	};

	app.requestResult = function(id){
		var url = $.tmpl( app.url.templates.result, {
				ID : id
			}).text(),

			handle = function(data){
				console.log(data)
			};

		app.send(url, handle)
	};



}(jQuery, this);
