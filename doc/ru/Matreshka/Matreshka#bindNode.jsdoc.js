/**
@method Seemple#bindNode
@importance 1
@fires bind
@fires bind:KEY
@summary Связывает свойство объекта с HTML элементом
@desc {@link Seemple#bindNode} - это единственный метод класса {@link Seemple}, отвечающий за изменения DOM. Он создаёт мост между значением свойства и состоянием HTML элемента на странице: от простого инпута до сложного виджета (сложность элементов не ограничена).  После связывания свойства экземпляра и HTML элемента не нужно больше следить за синхронизацией данных и представления.

> Обратите внимание, что у метода есть {@link Seemple.bindNode статичный аналог}, который работает в точности так же, но принимает любой целевой объект в качестве первого аргумента, cдвигая остальные аргументы вправо.
```js
const bindNode = require('seemple/bindnode');
const object = {};
bindNode(object, key, node, binder, eventOptions);
// вместо this.bindNode(key, node, binder, eventOptions);
```

Для двустороннего связывания элемента и значения свойства, в метод передаются три аргумента: **имя свойства**, **HTML элемент** и **правило привязки** (байндер, биндер, binder, привязчик). Байндер, в свою очередь, является обычным объектом и может иметь следующие свойства: ``on``, ``getValue``, ``setValue``, ``initialize``, ``destroy`` (подробнее см. {@link #typedef-binder}). Все пять свойств опциональны. Это позволяет также объявлять и односторонние привязки.

> Метод ``bindNode`` поддерживает привязки "многие ко многим". С одним свойством можно связать несколько элементов, а с одним элементом можно связать несколько свойств, в том числе и от разных экземпляров разных классов.

```js
this.bindNode('myKey', '.my-element', {
	on: 'click',
	getValue() { ... },
	setValue() { ... }
});
```

Например, вы хотите связать свойство объекта с элементом ``input[type="checkbox"]``:
```js
this.bindNode('myKey', '.my-checkbox', {
	// когда менятся состояние элемента?
	// - по событию 'click'
	on: 'click',
	// как извлечь состояние элемента?
	// - вернуть значение 'checked'
	getValue() {
		return this.checked;
	},
	// как установить состояние элемента?
	// - установить значение 'checked'
	setValue(v) {
		this.checked = !!v;
	}
});
```

После объявления привязки можно устанавливать значение свойства объекта самым привычным способом, а элемент изменит своё состояние автоматически. При клике на чекбокс, значение свойства тоже изменится на соответствующее.
```js
// устанавливает checked = true
this.myKey = true;
```

Более сложный пример: связывание свойства объекта с виджетом jQuery UI
```html
<div class="my-slider"></div>
```

```js
this.bindNode('myKey', '.my-slider', {
	// когда менятся состояние элемента?
	// - по событию 'slide'
	on: 'slide',
	// как извлечь состояние элемента?
	// - вернуть значение виджета 'value'
	getValue() {
		return $(this).slider('option', 'value');
	},
	// как установить состояние элемента?
	// - установить значение 'value'
	setValue(v) {
		$(this).slider('option', 'value', v);
	},
	// как инициализировать виджет?
	// инициализировать слайдер можно любым способом,
	// но initialize предоставляет немного синтаксического сахара
	initialize() {
		$(this).slider({ min: 0, max: 100 });
	}
});
```

```js
// установит знaчeние слайдера 42
this.myKey = 42;
```

Выглядит просто, но вы, скорее всего, задаётесь вопросом: "Как сделать так, чтоб мне не пришлось каждый раз прописывать эти правила?".  Действительно, на странице может быть очень много однотипных элементов: текстовых полей, выпадающих меню, новых полей из спецификации HTML5, могут быть и сторонние виджеты (о чем говорит пример выше).

Как видно из документации к аргументам метода ``bindNode``, третий аргумент не обязателен. Этот вопрос решает массив {@link Seemple.defaultBinders}, который содержит функции, проверяющие HTML элемент на соответствие заданным правилам и возвращающие соответствующий байндер или ``undefined``. Появляется возможность многократно сократить код, вынося правила привязки в отдельную часть вашего кода, а для привязки использовать синтаксис без третьего аргумента:
```js
this.bindNode('myKey', '.my-element');
```
Как это сделать? Нужно добавить функцию, проверяющую ваш элемент на соответствие некоторым правилам в начало массива {@link Seemple.defaultBinders}.
```js
const checkboxBinder = () => {
	return {
		on: 'click',
		getValue() {
			return this.checked;
		},
		setValue(v) {
			this.checked = !!v;
		}
	}
};

// метод unshift добавляет функцию
// в начало массива Seemple.defaultBinders
Seemple.defaultBinders.unshift(node => {
	// проверяем, является ли элемент чекбоксом
	if(node.tagName === 'INPUT' && node.type === 'checkbox') {
		// если проверка пройдена, возвращаем новый байндер
		return checkboxBinder();
	}
});
```
```js
this.bindNode('myKey', '.my-checkbox');
this.myKey = true;
```

Что делать, если вам нужно передать аргументы для инициализации какого-нибудь плагина или виджета? Можно вручную вызывать функцию, возвращающую байндер.

```js
const uiSlider = (min, max) => {
	return {
		on: 'slide',
		getValue() {
			return $(this).slider('option', 'value');
		},
		setValue(v) {
			$(this).slider('option', 'value', v);
		},
		initialize() {
			$(this).slider({ min: min, max: max });
		}
	}
};

this.bindNode('myKey1', '.my-slider1', uiSlider(0, 100));
this.bindNode('myKey2', '.my-slider2', uiSlider(1, 1000));
this.myKey1 = 42;
this.myKey2 = 999;
```

Для глобального доступа к байндеру, можно расширить {@link Seemple.binders}.
```js
Seemple.binders.uiSlider = uiSlider;
// ...
this.bindNode('myKey1', '.my-slider1', Seemple.binders.uiSlider(0, 100));
this.bindNode('myKey2', '.my-slider2', Seemple.binders.uiSlider(1, 1000));
```


{@link Seemple.defaultBinders} из коробки содержит поддержку **всех без исключения** HTML элементов форм: ``select`` (включая ``multiple``), ``textarea``, ``output``, ``input`` (в том числе и все типы из спецификации HTML5: ``text``, ``checkbox``, ``radio``, ``range``, ``number``, ``date``, ``search``, ``time``, ``datetime``, ``datetime-local``, ``color`` и остальных). Это значит, что для стандартных элементов указывать байндер не обязательно.
```html
<input type="color" class="my-color-input">
```
```js
this.bindNode('myColor', '.my-color-input');
this.myColor = '#66bb6a';
```

После привязки, вам доступен новый нестандартный CSS селектор ``:bound(KEY)``.

```js
this.bindNode('myKey', '.my-element');

// найдет элемент '.my-inner-element' внутри '.my-element'
this.bindNode('myAnotherKey', ':bound(myKey) .my-inner-element');
```

И расширяется синтаксис возможных имен событий:
```js
this.bindNode('myKey', '.my-element');

// отловит клик на элементе .my-element
this.on('click::myKey', () => { ... });

// отловит клик на элементе .my-element .my-inner-element
this.on('click::myKey(.my-inner-element)', () => { ... });
```

> Если элемент не найден, бросается исключение ``"Bound element is missing"``. Для того, чтоб избежать ошибки используйте метод {@link Seemple#bindOptionalNode}

#### Создание песочницы

{@link Seemple#bindNode} умеет ассоциировать экземпляр класса с "главным" HTML элементом, создавая так называемую **песочницу**. Это нужно для того, чтоб ограничить влияние объекта одним HTML элементом. Для привязки песочницы используется специальное свойство ``sandbox``.
```html
<div class="my-sandbox">
	<!-- your HTML code -->
</div>
```

```js
this.bindNode('sandbox', '.my-sandbox');
```

Определение песочницы добавляет множество удобств программисту. Например:
+ Позволяет использовать методы {@link Seemple#select} и {@link Seemple#$}
+ Добавляет новый селектор ``:sandbox`` в методах {@link Seemple#bindNode}, {@link Seemple#select}, {@link Seemple#$}
+ Добавляет синтаксический сахар для делегированных DOM событий в методе {@link Seemple#on}

> Следует иметь в виду, что только один HTML элемент может быть связан со свойством ``sandbox``, иначе бросается ошибка. Для объявления песочницы можно воспользоваться методом {@link Seemple#bindSandbox}. Перед тем, как объявить байндинг, метод отвязывает предыдущую песочницу.

```js
// объявляем песочницу
this.bindNode('sandbox', '.my-sandbox');

// .my-element ищется в песочнице
this.bindNode('myKey', ':sandbox .my-element');

// для делегированных событий внутри песочницы не требуется указывать ключ
this.on('click::(.my-button)', () => { ... });

// выведет в консоль элемент .inner-node,
// который находится внутри песочницы
console.log(this.$('.inner-node'));
```

### Важные особенности работы метода и специальные флаги

Четвертым аргументом ``eventOptions`` в метод ``bindNode`` можно передать объект, состоящий из флагов, описанных ниже, глобальных флагов (например, ``silent``), или кастомных данных, которые попадут в обработчики событий ``bind`` и ``bind:KEY``.

```js
this.on('bind:x', evt => {
	console.log(evt.foo); // bar
});
this.bindNode('x', node, binder, { foo: 'bar' });
```

Для ознакомления с важными тонкостями работы ``bindNode`` информация ниже обязательна к ознакомлению. При этом, имена флагов запоминать не обязательно.

#### Флаг ``exactKey=false``

Если в качестве ``key`` передать строку, содержащую точку, то такая строка будет интерпритирована как путь к свойству во вложенном объекте. фреймворк будет слушать изменения во всём дереве, разрывая связь для старых ветвей, и создавая её для новых.

```js
this.a = { b: { c: 'foo' } };
this.bindNode('a.b.c', node);

this.a.b.c = 'bar'; // обновит элемент значением bar

const oldB = this.a.b;

this.a.b = { c: 'baz' }; // обновит элемент значением baz

 // элемент не обновится, так как связь с этой ветвью разорвана
oldB.c = 'fuu';
```

В случае, если имя свойства должно быть использовано как есть, воспользуйтесь флагом ``exactKey`` со значением ``true``.

```js
this['a.b.c'] = 'foo';
this.bindNode('a.b.c', node, binder, {
	exactKey: true
});
this['a.b.c'] = 'bar';
```

#### Флаг ``getValueOnBind``

При наличии у байндера ``getValue``, состояние элемента будет извлечено и присвоено свойству сразу после вызова ``bindNode`` при условии, если привязываемое свойство имеет значение ``undefined``. Для того, чтоб форсировать это поведение даже если свойство - не ``undefined`` используйте флаг ``getValueOnBind`` со значением ``true``. Для отмены этого поведения, используйте тот же флаг со значением ``false``.

#### Флаг ``setValueOnBind``

При наличии у байндера ``setValue``, значение свойства будет установлено в качестве состояния элемента сразу после вызова ``bindNode`` при условии, если привязываемое свойство имеет значение отличное от ``undefined``. Для того, чтоб форсировать это поведение даже если свойство - ``undefined`` используйте флаг ``setValueOnBind`` со значением ``true``. Для отмены этого поведения, используйте тот же флаг со значением ``false``.

#### Флаги ``debounceGetValue=true`` и ``debounceSetValue=true``

Важной особенностью метода ``bindNode`` является то, что к изменению свойств и изменению состояния элемента применяется микропаттерн debounce. Это значит, что если привязанное свойство будет изменено многократно за короткий промежуток времени (например, в цикле), состояние элемента будет обновлено лишь один раз после задержки в несколько миллисекунд (благодаря ``debounceSetValue=true``). И наоборот: если состояние элемента меняется многократно за короткий промежуток времени (т. е. вызывается соответствующее DOM событие), свойство получит новое значение только один раз после короткой зарержки (благодаря ``debounceGetValue=true``).

```js
const input = document.querySelector('.my-input');
this.bindNode('x', input);
this.x = 'foo';
console.log(input.value === 'foo'); // false
setTimeout(() => {
	console.log(input.value === 'foo'); // true
});
```

Для отмены этого поведения, т. е. для отмены асинхронности действий, используйте флаги ``debounceSetValue`` и/или ``debounceGetValue`` со значением ``false``.

#### Флаги ``debounceSetValueOnBind=false`` и ``debounceGetValueOnBind=false``

Как говорилось выше, к изменению свойств и изменению состояния элемента применяется микропаттерн debounce. Это не касается самого момента связывания. При вызове ``bindNode`` установка состояния элемента или его извлечение с изменением свойства происходит синхронно. ``debounceSetValueOnBind`` и ``debounceGetValueOnBind`` установленные как ``true`` включают debounce и для этих процессов.

#### Флаги ``debounceSetValueDelay=0`` и ``debounceGetValueDelay=0``

Эти флаги позволяют указать задержку debounce. ``debounceSetValueDelay`` задаётся при использовании ``debounceSetValue`` и ``debounceSetValueOnBind``, ``debounceGetValueDelay`` при использовании ``debounceGetValue`` и ``debounceGetValueOnBind``.

#### Флаг ``useExactBinder=false``

Даже если в метод ``bindNode`` передать конкретный байндер, фреймворк попытается отыскать байндер из {@link Seemple.defaultBinder} и расширить его свойствами переданного объекта. Такая возможность позволяет использовать дефолтный байндер, который частично переопределен.

Например, мы хотим связать ``input[type="text"]`` со свойством. По умолчанию, стандартный байндер для этого элемента содержит свойство ``"on"`` со значением ``"input"``. Это значит, что значение свойства экземпляра и состояние элемента будут синхронизированы сразу после ввода или удаления символа пользователем. В случае, если вы хотите, чтоб синхронизация происходила по DOM событию ``"blur"``, вам потребуется передать третьим аргументом объект, содержащий единственное свойство ``"on"``. Этот объект объединится со стандартным байндером, сохранив при этом значения ``getValue`` и ``setValue``.

```js
this.bindNode('x', '.my-input', { on: "blur" });
```

Для отмены этого поведения и использования байндера как он есть, в объект события можно передать флаг ``useExactBinder`` со значением ``true``.

```js
this.bindNode('x', node, binder, {
	useExactBinder: true
})
```

@see {@link Seemple#unbindNode}
@see {@link Seemple#bindOptionalNode}
@see {@link Seemple#bindSandbox}
@see {@link Seemple#$}
@see {@link Seemple.binders}
@see {@link Seemple.defaultBinders}


@param {string} key - Имя свойства
@param {string|node|$nodes} node - HTML элемент, который должен быть связан со свойством объекта
@param {binder} [binder] - Байндер, содержащий свойства ``on``, ``getValue``, ``setValue``, ``initialize``, ``destroy``, см. {@link #typedef-binder}.
@param {eventOptions} [eventOptions] - Объект события, в который можно передать ключ ``"silent"`` (чтоб не генерировать события ``"bind"`` и ``"bind:KEY"``), флаги, описанные выше или кастомные данные

@returns {object} self
*/


/**
@method Seemple#bindNode
@importance 2
@variation 2
@summary Альтернативный синтаксис {@link Seemple#bindNode}: возможность передать объект с байндингами
@desc В метод {@link Seemple#bindNode} можно передать объект чтобы избежать многократного вызова метода и сократить код. Ключи объекта - это имена привязываемых свойств, а значения могут быть следующими:
- HTML элемент
- Объект со свойствами ``node`` (HTML элемент) и ``binder``
- Массив объектов со свойствами ``node`` (HTML элемент) и ``binder``

Если ``binder`` передан вторым аргументом, то он служит байндером для тех элементов, для которых байднер не указан явно.

@param {object} bindings - (см. пример)
@param {binder} [binder] - (см. выше)
@param {eventOptions} [eventOptions] - (см. выше)

@returns {object} self

@example
this.bindNode({
	foo: '.custom-checkbox',
	'bar.length': 'textarea'
});

@example
this.bindNode({
	foo: {
		node: ':sandbox .aaa',
		binder: Seemple.binders.html()
	},
	bar: '.bbb',
	baz: [{
		node: '.ccc'
	}, {
		node: document.querySelector('.ddd'),
		binder: Seemple.binders.prop('baz')
	}]
}, {
	// will be used as a binder for .bbb and .ccc
	setValue(value) {
		foo(value);
	}
});
*/


/**
@method Seemple#bindNode
@importance 2
@variation 3
@summary Альтернативный синтаксис, позволяющий объявить неограниченное количество байндингов одним вызовом метода.

@desc Вариация метода позволяет передать массив объектов, содержащих информацию об одном байндинге каждый. Элемент массива должен содержать следующие свойства:
- ``key`` - имя свойства
- ``node`` - элемент, для которого объявляем связывание с ``key``
- ``binder`` - байндер (не обязательно)
- ``event`` - объект события (не обязательно)

Второй аргумент - общий объект события, расширяющий ``event`` для каждого байндинга (свойства из ``event`` приоритетнее).

@param {array} batch - Массив байндингов
@param {eventOptions} [commonEventOptions] - Общие для всех объектов события свойств

@returns {object} self

@example
this.bindNode([{
	key: 'a',
	node: '.my-node',
	binder: {
		setValue(v) {
			doSomething(v);
		}
	}
}, {
	key: 'b',
	node: document.querySelectorAll('.bar')
	event: {
		foo: 'bar'
	}
}, {
	key: 'c.d.e',
	node: jQuery('.baz'),
	binder: Seemple.binders.html(),
	event: {
		silent: true,
		exactKey: true
	}
}], {
	getValueOnBind: false
});
*/
