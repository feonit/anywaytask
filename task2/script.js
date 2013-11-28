/*
 * Решение на тестовое задание Anywayanyday "Поиск рейсов авиакомпаний"
 *
 * author: Orlov Leonid
 * email: feonitu@yandex.ru
 * */



var app = new function AirLine() {

  /**
   * Хранилище
   * */

  this.store = null;

  //==============================================================================================
  //      Получение данных
  //==============================================================================================

  /**
   * Шаблоны по предоставленному API сервиса, производящего поиск рейсов авиакомпаний
   *
   * */

  this.urlTemplates = {
    start : 'http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
    status : 'http://api.anywayanyday.com/api/RequestState/?R=${ID}&_Serialize=JSON',
    result : 'http://api.anywayanyday.com/api/Fares/?R=${ID}&V=Matrix&VB=true&L=ru&_Serialize=JSON'
  };

  /**
   * Запрос к сервису
   *
   * @param {String} url Адрес ресурса по предоставленному API
   * @param {Function} handle Обработчик ответа
   * */

  this.sendGetRequest = function(url, handle){

    $.ajax({
      url : url,
      type : 'GET',
      dataType: 'jsonp',
      crossDomain : true
    })

    .done( function(data) {
      if (!data) {
        return alert('Не получены данные от сервиса!');
      }

      if (data['Error'] && data['Error'] !== null) {
        return alert('Сервис прислал ошибку: ' + data['Error']);
      }
      console.log(data);
      return handle(data);
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      alert('Запрос через AJAX был неудачен: ' + errorThrown);
    });

  };

  /**
   * Запуск поиска
   *
   * @this {AirLine}
   * */

  this.requestStart = function(){
    var url = this.urlTemplates.start,
      that = this;

    this.sendGetRequest(url, function (data) {
      var id;

      if ( id = data['Id'] ) {
        that.processSearch(id);
      }
    })
  };

  /**
   * Обработка поиска
   *
   * @this {AirLine}
   * */

  this.processSearch = function(id){
    var init,
      that = this;
    // Периодически
    init = setInterval(function(){
      // Опрашиваем статус
      that.requestStatus(id, function(data){
        // Пока не убедимся, что поиск завершён
        if (data['Completed'] && data['Completed'] == 100){
          // После чего останавливаем счетчик
          clearInterval(init);
          // Получаем результат поиска
          that.requestResult(id, function(data){
            // И обрабатываем данные
            that.appendData(data)
          })
        }
      })
    }, 1000);
  };


  /**
   * Для получения статуса поиска
   *
   * @this {AirLine}
   * @param {String} id Идентификатор поискового запроса
   * @param {Function} handle Обработчик результата
   * */

	this.requestStatus = function(id, handle){
		var temp = this.urlTemplates.status,
        url = $.tmpl( temp, {	ID : id }).text();

		this.sendGetRequest(url, handle);
	};

  /**
   * Для получения результата поиска
   *
   * @this {AirLine}
   * @param {String} id Идентификатор поискового запроса
   * @param {Function} handle Обработчик результата
   * */
	this.requestResult = function(id, handle){
		var temp = this.urlTemplates.result,
        url = $.tmpl( temp, { ID : id}).text();

		this.sendGetRequest(url, handle);
	};


  //==============================================================================================
  //      Обработка и отображение данных
  //==============================================================================================

  //алфавит авиакомпаний

  this.store.airlines = null;

  var Airline = function(){
    var name = name,
      flight = {};

  }

/*
  Нужные данные приходят в таком вот виде

Airlines: Array[26]
  Name: "Air Baltic"
  FaresFull: Array[1]
    Pricing
      ADTTotal: "60684"
    TotalAmount: "62901"
    Directions: Array[1]
      Segments: Array[1]  //сектор
        Trips: Array[1]  //поездки
          Departure: Object
            Airport: "Домодедово"
            AirportCode: "DME"
            City: "Москва"
            Country: "Россия"
            Date: "2014-06-24"
            DayOfWeek: "Tuesday"
            Displacement: null
            Terminal: ""
            Time: "07:25"

          Arrival: Object
            Airport: "Рига"
            AirportCode: "RIX"
            City: "Рига"
            Country: "Латвия"
            Date: "2014-06-24"
            DayOfWeek: "Tuesday"
            Displacement: null
            Terminal: ""
            Time: "08:35"
          FlightDuration: "02:10"
          FlightNumber: "BT-417"
          OnEarth: "00:45"
*/

  this.appendData = function(data){
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

  this.appendFlightData = function(airLines){
    var fares = airLines.FaresFull,
        $divConteiner = $('.center'),
        template = "<div> ${id} ${amount} ${seats} </div>",
        len = fares.length,
        $html = $('<div>');

        for (var i=0; i < len; i+=1){
          data = {
           id : fares[i].FareId,
           seats : fares[i].MinAvailSeats,
           amount : fares[i].TotalAmount
         };

          $.tmpl(template, data).appendTo($html)
        }

        $divConteiner.append($html);
  };

  this.requestStart()

};
