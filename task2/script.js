/**
 *
 * */

var app;

!function($, global){

	global.app = {};

	app.urlTemplates = {
		start : 'http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
		status : 'http://api.anywayanyday.com/api/RequestState/?R=${ID}&_Serialize=JSON',
		result : 'http://api.anywayanyday.com/api/Fares/?R=${ID}&V=Matrix&VB=true&L=ru&_Serialize=JSON'
	};

	app.send = function(url, handle){
		$.ajax({
			url : url,
			type : 'GET',
			dataType: 'jsonp',
			crossDomain : true
		})
			.done(function(data){
				if (!data) {
		      return alert('Не полученны данные');
	      }

	      if (data['Error'] !== null) {
		      return alert('Ошибка: ' + data['Error']);
	      }
	      console.log(data);
	      return handle(data);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
		    alert('ajax fail: ' + errorThrown);
	    });
	};
	
		app.handle = function(data){
		var id = data.Id,
		    init;
		    
		init = setInterval(function(){
		  app.requestStatus(id, function(data){
		    if (data.Completed == 100){
		      clearInterval(init);
		      app.requestResult(id, function(data){
		        app.appendData(data)
		      })
		    }
		  })
		}, 1000);
	};

	app.requestStart = function(){
		var url = app.urlTemplates.start;

		app.send(url, app.handle)
	};

	app.requestStatus = function(id, handle){
		var url = $.tmpl( app.urlTemplates.status, {
				ID : id
			}).text();

		app.send(url, handle)
	};

	app.requestResult = function(id, handle){
		var url = $.tmpl( app.urlTemplates.result, {
				ID : id
			}).text();

		app.send(url, handle)
	};

app.appendData = function(data){
  var airLines = data.Airlines,
      $divConteiner = $('.left'),
      $html = $('<ol>'),
      template = "<li><a class='folder-close' href= '#'>${name}</a></li>",
      
      len = airLines.length;
      
      
      for(var i=0; i<len; i+=1){
        $.tmpl(template, {
                           name : airLines[i].Name
                         }
        ).appendTo($html);
      };
      
      app.appendFlightData(airLines[2]);
      $divConteiner.append($html);
}

app.appendFlightData = function(airLines){
  var fares = airLines.FaresFull,
      $divConteiner = $('.center'),
      template = "<div> ${id} ${amount} ${seats} </div>",
      len = fares.length,
      $html = $('<div>');
      
      for (var i=0; i < len; i+=1){
        data = {
         id : fares[i].FareId,
         seats : fares[i].MinAvailSeats,
         amount : fares[i].TotalAmount,
       }
      
        $.tmpl(template, data).appendTo($html)
      }

      $divConteiner.append($html);
}


}(jQuery, this);
