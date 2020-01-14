/**
@method Seemple.Class
@module seemple/class
@importance 2
@summary Реалізація класів, заснована на прототипному спадкуванні
@desc Функція ``Class`` дозволяє використовувати класичне ООП в тих випадках, коли немає можливості скористатися синтаксисом ECMAScript 2015 classes.

@param {object} prototype - Методи та властивості
@param {object} [statics] - Статичні методи та властивості

@returns {class} клас (точніше, конструктор класу)
@example
const A = Seemple.Class({
	method1() { ... }
});

const B = Seemple.Class({
	// B успадковується від A
	extends: A,
	method2() { ... }
});

const C = Seemple.Class({
	// С успадковується від B
	extends: B,
	method2() {
		// виклик батьківського методу
		B.prototype.method2.apply(this, arguments);
	},
	method3(a, b) { ... }
});

const D = Seemple.Class({
	// D успадковується від C
	extends: C,
	method3(a, b) {
		// виклик батьківського методу
		C.prototype.method2.call(this, arguments);
	}
});

@example <caption>Передача об'єкта зі статичними методами і властивостями</caption>
const MyClass = Seemple.Class({
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
