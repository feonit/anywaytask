http://feonit.github.io/anywaytask/task1/task1.html
http://feonit.github.io/anywaytask/task2/index.html

<h1>Тестовое задание Anywayanyday</h1>
<ul>
<li>
Сверстать трехколоночный резиновый макет
левая колонка фиксированная;
правая занимает % от всей ширины экрана;
средняя - оставшееся пространство;
колонки одинаковой высоты – 100% высоты окна браузера;
при изменении ширины/высоты окна браузера, макет не теряет целостность;
Необходимо использовать блочную верстку.
</li>
<li>
Есть сервис, который производит поиск рейсов авиакомпаний.
Для запуска поиска используется ссылка: http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON (возвращает параметр ID, по которому будет опрашиваться статус поиска и запрашиваться результат).
Для получения статуса поиска используется ссылка: http://api.anywayanyday.com/api/RequestState/?R=ID&_Serialize=JSON (передаваемый параметр R равен ID, который вернулся на момент запуска поиска. Значение Completed равное “100” означает, что поиск завершен)
Получить результат поиска можно по ссылке http://api.anywayanyday.com/api/Fares/?R=ID&V=Matrix&VB=true&L=ru&_Serialize=JSON
</li>
Необходимо, используя ООП JavaScript, HTML и CSS:
представить информацию о рейсах в виде папок, где каждая папка соответствует авиакомпании, в папке находятся рейсы соответствующей авиакомпании;
рейсы отсортировать по возрастанию стоимости;
добавить возможность переключаться между папками-авиакомпаниями;
обновлять раз в N минут информацию о рейсах, запрашивая ее с сервера, сохраняя старые рейсы и добавляя только новые.

p.s.
желательно использовать jQuery;
желательно "переключение" между "папками" реализовать самостоятельно, а не использовать сторонние плагины;
визуально это не обязательно должны быть папки в том виде, в котором они привычны пользователю. Достаточно названия папки и некоего контейнера, где будет представлена информация.
</ul>

<i>Главным критерием принятия тестового задания является качество кода.

Не забывайте, написанный Вами код, нам нужно прочитать, и очень желательно, чтобы читать было удобно.
</i>
