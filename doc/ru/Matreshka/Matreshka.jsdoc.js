/**
@class Matreshka
@module matreshka/matreshka
@importance 1
@lang ru
@alias MK
@see {@link Class}
@classdesc Класс Matreshka - ядро фреймворка Matreshka.js, от которого наследуются {@link Matreshka.Array}, {@link Matreshka.Object} и каждый класс создаваемого приложения. Он содержит основной функционал фреймворка, среди которого есть несколько полезнейших функций: {@link Matreshka#mediate медиаторы}, {@link Matreshka#linkProps зависимости}, {@link Matreshka#bindNode привязки к DOM}, {@link Matreshka#on движок событий} и пр. Наследование этого класса, как и наследование любого другого класса, осуществляется при помощи функции {@link Class}.

Как правило, этот класс, (как и {@link Matreshka.Array} и {@link Matreshka.Object}), не используются напрямую. Вместо этого, от него наследуются классы, создаваемые вами. Поэтому, примеры к свойствам и методам в этой документации, как правило, будут приведены с использованием ключевого слова ``this``.
@example <caption>Создание экземпляра</caption>
var mk = new Matreshka;
@example <caption>Краткая запись: MK вместо Matreshka</caption>
var mk = new MK;
@example <caption>Наследование</caption>
var MyClass = MK.Class({
	'extends': Matreshka,
	constructor: function() {
		this.sayHello();
	},
	sayHello: function() {
		alert("Hello World!");
	}
});
@example <caption>Матрешка использует прототипы для реализации наследования. Функция {@link Class} лишь вносит синтаксический сахар. Поэтому вы можете воспользоваться любым другим полюбившимся способом наследования, например, используя классы из ECMAScript 2015</caption>
class MyClass extends Matreshka {
	constructor() {
		this.sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
*/