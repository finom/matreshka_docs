/**
@method Seemple#bindNode
@importance 1
@fires bind
@fires bind:KEY
@summary Пов'язує властивість об'єкта з HTML елементом
@desc ``bindNode`` - це єдиний метод класу {@link Seemple}, який відповідає за зміни DOM. Він створює міст між значенням властивості і станом HTML елемента на сторінці: від простого інпут до складного віджета (складність елементів не обмежена). Після зв'язування властивості екземпляра і HTML елемента не потрібно більше стежити за синхронізацією даних та виду.

> Зверніть увагу, що у метода є {@link Seemple.bindNode статичний аналог}, який працює в точності так само, але приймає будь-який об'єкт в якості першого аргументу, зсовуючи інші аргументи вправо.

```js
const bindNode = require('seemple/bindnode');
const object = {};
bindNode(object, key, node, binder, eventOptions);
// замість this.bindNode(key, node, binder, eventOptions);
```

Для двостороннього зв'язування елемента і значення властивості, в метод передаються три аргументи: **ім'я властивості**, **HTML елемент** і **правило прив'язки** (байндер, біндер, binder, прівязчік). Байндер, в свою чергу, є звичайним об'єктом і може мати наступні властивості: ``on``, ``getValue``, ``setValue``, ``initialize``, ``destroy`` (докладніше див. {@link #typedef-binder}). Всі п'ять властивостей опційні. Це дозволяє також оголошувати і односторонні прив'язки.

> Метод ``bindNode`` підтримує прив'язки "багато до багатьох". З одною властивістю можна зв'язати кілька елементів, а з одним елементом можна зв'язати кілька властивостей, в тому числі і від різних екземплярів різних класів.

```js
this.bindNode('myKey', '.my-element', {
	on: 'click',
	getValue () {...},
	setValue () {...}
});
```

Наприклад, ви хочете зв'язати властивість об'єкта з елементом ``input[type="checkbox"]``:
```js
this.bindNode('myKey', '.my-checkbox', {
	// Коли змінюється стан елемента?
	// - За подією 'click'
	on: 'click',
	// Як витягти стан елемента?
	// - Повернути значення 'checked'
	getValue() {
		return this.checked;
	},
	// Як встановити стан елемента?
	// - Встановити значення 'checked'
	setValue(v) {
		this.checked = !! v;
	}
});
```

Після оголошення прив'язки можна встановлювати значення властивості об'єкта самим звичним способом, а елемент змінить свій стан автоматично. При кліці на чекбокс, значення властивості теж зміниться на відповідне.
```js
// Встановлює checked = true
this.myKey = true;
```

Більш складний приклад: зв'язування властивості об'єкта з віджетом jQuery UI
```html
<div class="my-slider"></div>
```

```js
this.bindNode('myKey', '.my-slider', {
	// Коли змінювати стан елемента?
	// - За подією 'slide'
	on: 'slide',
	// Як витягти стан елемента?
	// - Повернути значення віджета 'value'
	getValue() {
		return $(this).slider('option', 'value');
	},
	// Як встановити стан елемента?
	// - Встановити значення 'value'
	setValue(v) {
		$(this).slider('option', 'value', v);
	},
	// Як ініціалізувати віджет?
	// Зробити це можна будь-яким способом,
	// але initialize надає трохи синтаксичного цукру
	initialize() {
		$(this).slider({ min: 0, max: 100 });
	}
});
```

```js
// Встановить значення слайдера 42
this.myKey = 42;
```

Виглядає просто, але у вас, швидше за все, винекне питанням: "Як зробити так, щоб мені не довелося кожен раз прописувати ці правила?". Дійсно, на сторінці може бути дуже багато однотипних елементів: текстових полів, полів з специфікації HTML5, можуть бути і сторонні віджети (про що говорить приклад вище).

Як видно з документації до аргументів методу ``bindNode``, третій аргумент не обов'язковий. Цю проблему вирішує масив {@link Seemple.defaultBinders}, який містить функції, що перевіряють HTML елемент на відповідність заданим правилам і повертають відповідний Байндер або ``undefined``. З'являється можливість багаторазово скоротити код, виносячи правила прив'язки в окрему частину вашого коду, а для прив'язки використовувати синтаксис без третього аргументу:
```js
this.bindNode('myKey', '.my-element');
```
Як це зробити? Потрібно додати функцію, яка перевіряє ваш елемент на відповідність деяким правилам в початок масиву {@link Seemple.defaultBinders}.
```js
const checkboxBinder = () => {
	return {
		on: 'click',
		getValue () {
			return this.checked;
		},
		setValue (v) {
			this.checked = !! v;
		}
	}
};

// Метод unshift додає функцію
// у початок масиву Seemple.defaultBinders
Seemple.defaultBinders.unshift(node ​​=> {
	// Перевіряємо, чи це чекбокс
	if (node.tagName === 'INPUT' && node.type === 'checkbox') {
		// Якщо перевірка пройдена, повертаємо новий байндер
		return checkboxBinder();
	}
});
```
```js
this.bindNode('myKey', '.my-checkbox');
this.myKey = true;
```

Що робити, якщо вам потрібно передати аргументи для ініціалізації якогось плагіна або віджету? Можна вручну викликати функцію, яка повертає Байндер.

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

Для глобального доступу до байндера, можна розширити {@link Seemple.binders}.
```js
Seemple.binders.uiSlider = uiSlider;
// ...
this.bindNode('myKey1', '.my-slider1', Seemple.binders.uiSlider(0, 100));
this.bindNode('myKey2', '.my-slider2', Seemple.binders.uiSlider(1 1000));
```


{@link Seemple.defaultBinders} з коробки містить підтримку **всіх без винятку** HTML елементів форм: ``select`` (включаючи ``multiple``), ``textarea``, ``output``, ``input`` (в тому числі і всі типи із специфікації HTML5: ``text``, ``checkbox``, ``radio``, ``range``, ``number``, ``date``, ``search``, ``time``, ``datetime``, ``datetime-local``, ``color`` та інших). Це означає, що для стандартних елементів вказувати Байндер не обов'язково.
```html
<input type="color" class="my-color-input">
```
```js
this.bindNode('myColor', '.my-color-input');
this.myColor = '#66bb6a';
```

Після прив'язки, вам доступний новий нестандартний CSS селектор ``:bound(KEY)``.

```js
this.bindNode('myKey', '.my-element');

// Знайде елемент .my-inner-element який є в '.my-element'
this.bindNode('myAnotherKey', ':bound(myKey) .my-inner-element');
```

І розширюється синтаксис можливих імен подій:
```js
this.bindNode('myKey', '.my-element');

// Відловити клік на елементі .my-element
this.on('click::myKey', () => {...});

// Відловити клік на елементі .my-element .my-inner-element
this.on('click::myKey(.my-inner-element)', () => {...});
```

> Якщо елемент не знайдений, кидається виняток ``"Bound element is missing"``. Для того, щоб уникнути помилки використовуйте метод {@link Seemple#bindOptionalNode}

#### Створення пісочниці

{@link Seemple#bindNode} вміє асоціювати екземпляр класу з "головним" HTML елементом, створюючи так звану **пісочницю**. Це потрібно для того, щоб обмежити вплив об'єкта одним HTML елементом. Для прив'язки пісочниці використовується спеціальна властивість ``sandbox``.
```html
<div class="my-sandbox">
	<!-- Your HTML code -->
</div>
```

```js
this.bindNode('sandbox', '.my-sandbox');
```

Визначення пісочниці додає безліч зручностей програмісту. наприклад:
+ Дозволяє використовувати методи {@link Seemple#select} і {@link Seemple#$}
+ Додає можливість використовувати селектор ``:sandbox`` в методах {@link Seemple#bindNode}, {@link Seemple#select}, {@link Seemple#$}
+ Додає синтаксичний цукор для делегованих DOM подій в методі {@link Seemple#on}

> Слід мати на увазі, що тільки один HTML елемент може бути пов'язаний з властивістю ``sandbox``, інакше кидається помилка. Для оголошення пісочниці можна скористатися методом {@link Seemple#bindSandbox}. Перед тим, як оголосити байндінг, метод одв'язує попередню пісочницю.

```js
// Оголошуємо пісочницю
this.bindNode('sandbox', '.my-sandbox');

// .my-element шукається в пісочниці
this.bindNode('myKey', ':sandbox .my-element');

// Для делегованих подій всередині пісочниці не потрібно вказувати ключ
this.on('click::(.my-button)', () => {...});

// Виведе в консоль елемент .inner-node,
// Який знаходиться всередині пісочниці
console.log(this.$('.inner-node'));
```

### Важливі особливості роботи методу і спеціальні прапори

Четвертим аргументом ``eventOptions`` в метод ``bindNode`` можна передати об'єкт, що складається з прапорів, описаних нижче, глобальних прапорів (наприклад, ``silent``), або кастомних даних, які потраплять в оброблювачі подій ``bind`` і ``bind:KEY``.

```js
this.on('bind:x', evt => {
	console.log(evt.foo); // bar
});
this.bindNode('x', node, binder, { foo: 'bar' });
```

Для ознайомлення з важливими тонкощами роботи ``bindNode`` інформація нижче обов'язкова до ознайомлення. При цьому, імена прапорів запам'ятовувати не обов'язково.

#### Прапор ``exactKey=false``

Якщо в якості ``key`` передати строку, що містить точку, то така строка буде інтерпрітірована як шлях до властивості у вкладеному об'єкті. Seemple.js буде слухати зміни в усьому дереві, розриваючи зв'язок для старих гілок, і створюючи його для нових.

```js
this.a = { b: { c: 'foo' } };
this.bindNode ('a.b.c', node);

this.a.b.c = 'bar'; // Оновить елемент значенням bar

const oldB = this.a.b;

this.a.b = { c: 'baz' }; // Оновить елемент значенням baz

// Елемент не оновиться, оскільки він більше не пов'язаний з цією гілкою
oldB.c = 'fuu';
```

У разі, якщо ім'я властивості має бути використано як є, скористайтеся прапором ``exactKey`` зі значенням ``true``.

```js
this['a.b.c'] = 'foo';
this.bindNode('a.b.c', node, binder, {
	exactKey: true
});
this['a.b.c'] = 'bar';
```

#### Прапор ``getValueOnBind``

При наявності у байндера ``getValue``, стан елемента буде вилучено та присвоєно властивості відразу після виклику ``bindNode`` за умови, якщо прив'язувана властивість має значення ``undefined``. Для того, щоб форсувати цю поведінку навіть якщо властивість - не ``undefined`` використовуйте прапор ``getValueOnBind`` зі значенням ``true``. Для скасування цієї поведінки, використовуйте той же прапор зі значенням ``false``.

#### Прапор ``setValueOnBind``

При наявності у байндері ``setValue``, значення властивості буде встановлено в якості стану елемента відразу після виклику ``bindNode`` за умови, якщо прив'язувати властивість має значення відмінне від ``undefined``. Для того, щоб форсувати цю поведінку навіть якщо властивість - ``undefined`` використовуйте прапор ``setValueOnBind`` зі значенням `` true``. Для скасування цієї поведінки, використовуйте той же прапор зі значенням ``false``.

#### Прапори ``debounceGetValue=true`` і ``debounceSetValue=true``

Важливою особливістю методу ``bindNode`` є те, що до зміни властивостей і зміни стану елемента застосовується мікропаттерн debounce. Це означає, що якщо прив'язана властивість буде змінена багаторазово за короткий проміжок часу (наприклад, в циклі), стан елемента буде оновлено лише один раз після затримки в кілька мілісекунд (завдяки ``debounceSetValue=true``). І навпаки: якщо стан елемента змінюється багато разів за короткий проміжок часу (тобто викликається відповідна DOM подія), властивість отримає нове значення тільки один раз після короткої затримки (завдяки ``debounceGetValue=true``).

```js
const input = document.querySelector('.my-input');
this.bindNode('x', input);
this.x = 'foo';
console.log(input.value === 'foo'); // false
setTimeout(() => {
	console.log(input.value === 'foo'); // true
});
```

Для скасування цієї поведінки, використовуйте прапори ``debounceSetValue`` i/або ``debounceGetValue`` зі значенням ``false``.

#### Прапори ``debounceSetValueOnBind=false`` і ``debounceGetValueOnBind=false``

Як говорилося вище, до зміни властивостей і зміни стану елемента застосовується мікропаттерн debounce. Це не стосується самого моменту зв'язування. При виклику ``bindNode`` стан елемента або значення властивості встановлюється синхронно. ``debounceSetValueOnBind`` і ``debounceGetValueOnBind`` встановлені як ``true`` вмикають debounce і для цих процесів.

#### Прапори ``debounceSetValueDelay=0`` і ``debounceGetValueDelay=0``

Ці прапори дозволяють вказати затримку debounce. ``debounceSetValueDelay`` задається при використанні ``debounceSetValue`` і ``debounceSetValueOnBind``, ``debounceGetValueDelay`` - при використанні ``debounceGetValue`` і ``debounceGetValueOnBind``.

#### Прапор ``useExactBinder=false``

Навіть якщо в метод ``bindNode`` передати конкретний байндер, фреймворк спробує відшукати байндер у {@link Seemple.defaultBinder} і розширити його властивостями переданого об'єкта. Така можливість дозволяє використовувати дефолтний частково перевизначений байндер.

Наприклад, ми хочемо зв'язати ``input[type="text"]`` з властивістю. За замовчуванням, стандартний байндер для цього елемента містить властивість ``"on"`` зі значенням ``"input"``. Це означає, що значення властивості об'єкта і стан елемента будуть синхронізовані відразу після введення або видалення символу користувачем. У разі, якщо ви хочете, щоб синхронізація відбувалася після DOM події ``"blur"``, вам буде потрібно передати третім аргументом об'єкт, що містить єдину властивість ``"on"``. Цей об'єкт об'єднається зі стандартним байндером, зберігши при цьому значення ``getValue`` і ``setValue``.

```js
this.bindNode('x', '.my-input', { on: "blur" });
```

Для скасування цієї поведінки і використання байндера як він є, в об'єкт події можна передати прапор ``useExactBinder`` зі значенням ``true``.

```js
this.bindNode('x', node, binder, {
	useExactBinder: true
});
```

@see {@link Seemple#unbindNode}
@see {@link Seemple#bindOptionalNode}
@see {@link Seemple#bindSandbox}
@see {@link Seemple#$}
@see {@link Seemple.binders}
@see {@link Seemple.defaultBinders}


@param {string} key - Ім'я властивості
@param {string|node|$nodes} node - HTML елемент, який повинен бути пов'язаний з властивістю об'єкта
@param {binder} [binder] - Байндер, що містить властивості ``on``, ``getValue``, ``setValue``, ``initialize``, ``destroy``, див. {@link #typedef-binder}.
@param {eventOptions} [eventOptions] - Об'єкт події, в який можна передати ключ ``"silent"`` (щоб не генерувати події ``"bind"`` і ``"bind:KEY"``), прапори, описані вище або кастомні дані

@returns {object} self
*/


/**
@method Seemple#bindNode
@importance 2
@variation 2
@summary Альтернативний синтаксис {@link Seemple#bindNode}: можливість передати об'єкт з байндінгамі
@desc У метод {@link Seemple#bindNode} можна передати об'єкт щоб уникнути багаторазового виклику методу і скоротити код. Ключі об'єкта - це імена властивостей, а значення можуть бути наступними:
- HTML елемент
- Об'єкт з властивостями ``node`` (HTML елемент) і ``binder``
- Масив об'єктів з властивостями ``node`` (HTML елемент) і ``binder``

Якщо `` binder`` переданий другим аргументом, то він служить байндером для тих елементів, для яких байднер не вказано явно.

@param {object} bindings - (див. приклад)
@param {binder} [binder] - (див. вище)
@param {eventOptions} [eventOptions] - (див. вище)

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
@summary Альтернативний синтаксис, що дозволяє оголосити необмежену кількість байндінгов одним викликом методу.

@desc Варіація методу дозволяє передати масив об'єктів, що містять інформацію про байндінги. Елемент масиву повинен містити наступні властивості:
- ``key`` - ім'я властивості
- ``node`` - елемент, для якого оголошуємо зв'язування з ``key``
- ``binder`` - байндер (не обов'язково)
- ``event`` - об'єкт події (не обов'язково)

Другий аргумент - загальний об'єкт події, що розширює ``event`` для кожного байндінга (властивості з ``event`` є більш пріоритетні).

@param {array} batch - Масив байндінгів
@param {eventOptions} [commonEventOptions] - Загальні для всіх об'єктів властивості події

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
