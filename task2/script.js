/*
 * Решение на тестовое задание Anywayanyday "Поиск рейсов авиакомпаний"
 *
 * author: Orlov Leonid
 * email: feonitu@yandex.ru
 * */



var app = new function Module() {

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
   * @this {Module}
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
   * Для получения статуса поиска
   *
   * @this {Module}
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
   * @this {Module}
   * @param {String} id Идентификатор поискового запроса
   * @param {Function} handle Обработчик результата
   * */
	this.requestResult = function(id, handle){
		var temp = this.urlTemplates.result,
        url = $.tmpl( temp, { ID : id}).text();

		this.sendGetRequest(url, handle);
	};

  /**
   * Обработка поиска
   *
   * @this {Module}
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
            that.parseData(data);
            that.initView();
          })
        }
      })
    }, 1000);
  };


  //==============================================================================================
  //      Обработка и отображение данных
  //==============================================================================================

	var that = this;

	/**
	 * Алфавит авиакомпаний
   *
	 * */

	this.member = {};


	this.parseData = function (data){
		var airlines = data['Airlines'],
			i = airlines.length,
			member = that.member,
      airline,
      name,
      len,
      alpha,
      fare,
      id;

    //запоминаем информацию по каждой компании
    while (i--) {

      airline = airlines[i];
      name = airline['Name'];
      len = airline['FaresFull'].length;

      if (member[name]) {
        //если авиакомпания добавлена, обновляем алфавит рейсов
        alpha = member[name]['FaresFull'];

        while (len--) {
          fare = airline['FaresFull'][len];
          id = fare['FareId'];

          //если нет такой записи, добавляем
          if ( !alpha[id] ) {
            alpha[id] = fare;
          }
        }

      } else {
        //если нет
        alpha = {};

        while (len--) {
          fare = airline['FaresFull'][len];
          id = fare['FareId'];

          //сформировать алфавит рейсов по идентификаторам
          alpha[id] = fare;
        }
        //добавляем
        member[name] = alpha;
      }
    }
	};

  this.createListOfAirlines = function () {

    return Object.keys(that.member).sort()
  };


/*
  Нужные данные приходят в таком вот виде

Airlines: Array[26]
  Name: "Air Baltic"
  FaresFull: Array[1]
    FareId: "89"
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

 Airlines.Name Airlines.FaresFull[].TotalAmount
*/

  /**
   * Вывести список авиакомпаний
   *
   * */

   this.appendAirLine = function(list){

    var $divConteiner = $('.left'),
        $html = $('<ol>'),
        template = "<li><a class='folder-close' href= '#'>${name}</a></li>",

        len = list.length;


        for (var i=0; i<len; i+=1){
          $.tmpl(template, { name : list[i] }).appendTo($html);
        }

        $divConteiner.empty().append($html);
  };

  /**
   * Отобразить информацию об авиакомпании
   *
   * */

  this.appendFares = function(name){
    var fares = that.member[name],
      data,
      $divConteiner = $('.center'),
      template = "<div> ${id} ${amount} ${seats} </div>",
      $html = $('<div>');

    for (var id in fares ) { if (!fares.hasOwnProperty(id)) return;

      data = {
        id : id,
        seats : fares[id]['MinAvailSeats'],
        amount : fares[id]['TotalAmount']
     };

      $.tmpl(template, data).appendTo($html)
    }

    $divConteiner.empty().append($html);

  };


  /**
   * Привязка событий к пользовательскому интерфейсу (возможность переключаться)
   *
   * */

  var handler = function(){
    that.appendFares($(this).text());
  };

  this.initView = function(){
    var list = this.createListOfAirlines();
    this.appendAirLine(list);
    this.appendFares(list[0]);

    $('a').on('click', handler);

  };

  setInterval(this.requestStart, 15000);

};
