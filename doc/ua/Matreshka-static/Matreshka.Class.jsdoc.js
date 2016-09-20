/**
@method Matreshka.Class
@module matreshka/class
@importance 2
@summary Реализация классов, основанная на прототипном наследовании
@desc Функция ``Class`` позволяет использовать классическое ООП в тех случаях, когда нельзя воспользоваться синтаксисом ECMAScript 2015 classes.

@param {object} prototype - Методы и свойства
@param {object} [statics] - Статичные методы и свойства

@returns {class} class (точнее, конструктор класса)
@example
const A = Matreshka.Class({
	method1() { ... }
});

const B = Matreshka.Class({
	// B наследуется от A
	extends: A,
	method2() { ... }
});

const C = Matreshka.Class({
	// С наследуется от B
	extends: B,
	method2() {
		// вызов родительского метода
		B.prototype.method2.apply(this, arguments);
	},
	method3(a, b) { ... }
});

const D = Matreshka.Class({
	// D наследуется от C
	extends: C,
	method3(a, b) {
		// вызов родительского метода
		C.prototype.method2.call(this, arguments);
	}
});

@example <caption>Передача объекта со статичными методами и свойствами</caption>
const MyClass = Matreshka.Class({
	method() { ... }
}, {
	staticProp: 'foo',
	staticMethod() {
		return 'bar';
	}
});

alert(MyClass.staticProp); // foo
alert(MyClass.staticMethod()); // bar

*/
