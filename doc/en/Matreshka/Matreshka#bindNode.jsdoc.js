/**
@method Seemple#bindNode
@importance 1
@fires bind
@fires bind:KEY
@summary Binds a property of an object to HTML node, implementing two-way data binding
@desc {@link Seemple#bindNode} is the only method of the {@link Seemple} class  which is responsible for changing DOM (except array renderer). It creates a bridge between value of a property and state of HTML node on the page: from a simple input to a complicated widget (the complexity of elements is unlimited). After using this method, it isn't necessary to monitor the synchronizations between model and view.

> Note that the method has {@link Seemple.bindNode static alternative}, which works just the same but accepts any object as the first argument, shifting rest arguments to the right.
```js
const bindNode = require('seemple/bindnode');
const object = {};
bindNode(object, key, node, binder, eventOptions);
// instead of this.bindNode(key, node, binder, eventOptions);
```


The method acepts three arguments: **a property name**, **HTML node** and a **binding rule** (a binder). In its turn, a binder is an ordinary object and it can have the following properties: ``on``, ``getValue``, ``setValue``, ``initialize``, ``destroy`` (Read more here: {@link #typedef-binder}). All the five properties are optional. It also allows to declare one-way data bindings (any direction).

> The ``bindNode`` method  supports the many-to-many bindings. Several elements can be bound to one property and several properties can be bound to one element, including ones from different instances of various classes.

```js
this.bindNode('myKey', '.my-element', {
	on: 'click',
	getValue() { ... },
	setValue() { ... }
});
```

For example, you want to bind a property of an object to a ``input[type="checkbox"]`` node:
```js
this.bindNode('myKey', '.my-checkbox', {
	// when is element state changed?
	// - after 'click' event
	on: 'click',
	// how to extract element state?
	// - return 'checked' value
	getValue() {
		return this.checked;
	},
	// how to set element state?
	// - set 'checked' value
	setValue(v) {
		this.checked = !!v;
	}
});
```

After binding is declared, you can set value of an object property in your most habitual way and HTML node (in this case, a checkbox) will change its state immediately. After clicking on the checkbox, the property value will be changed to the corresponding one as well.
```js
// sets checked = true
this.myKey = true;
```

More complicated example: binding object property to jQuery UI widget
```html
<div class="my-slider"></div>
```

```js
this.bindNode('myKey', '.my-slider', {
	// when is element state changed?
	// - after 'slide' event
	on: 'slide',
	// how to extract element state?
	// - return 'value' of the widget
	getValue() {
		return $(this).slider('option', 'value');
	},
	// how to set element state?
	// - set 'value'
	setValue(v) {
		$(this).slider('option', 'value', v);
	},
	// how to initialize the widget?
	// you can initialize the slider in any way,
	// but 'initialize' function provides some syntactic sugar
	initialize() {
		$(this).slider({ min: 0, max: 100 });
	}
});
```

```js
// will set the slider value 42
this.myKey = 42;
```

It looks easy but you may ask a question: "What should I do to avoid writing these rules every time?". Indeed, there can be a lot of elements of the same type on the page: text fields, drop down menus, fields from the HTML5 specification as well as third party widgets (see the example above).

As observed in this documentation, the third argument is not obligatory for the ones of the ```bindNode``` method (see below). This problem is solved by the {@link Seemple.defaultBinders} array which contains functions checking an HTML node against a set of rules and returns corresponding binder or ``undefined``. You get an opportunity to reduce your code a great deal, putting  binding rules into a separate part of your code and to use a syntax for binding without the third argument:
```js
this.bindNode('myKey', '.my-element');
```
How to do it? You should add a function checking  your element against a set of rules to the beginning of the {@link Seemple.defaultBinders} array.
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

// the unshift method adds the function
// to the beginning of the Seemple.defaultBinders array
Seemple.defaultBinders.unshift(node => {
	// check if the element is a checkbox
	if(node.tagName == 'INPUT' && node.type == 'checkbox') {
		// if checking is OK, return a new binder
		return checkboxBinder();
	}
});
```
```js
this.bindNode('myKey', '.my-checkbox');
this.myKey = true;
```

What should you do if you need to pass arguments for initializing some plugin or a widget? You can call the function that returns a binder manually.

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
```
```js
this.bindNode('myKey1', '.my-slider1', uiSlider(0, 100));
this.bindNode('myKey2', '.my-slider2', uiSlider(1, 1000));
this.myKey1 = 42;
this.myKey2 = 999;
```

For global access to the binder you can add new property to {@link Seemple.binders}.
```js
Seemple.binders.uiSlider = uiSlider;
// ...
this.bindNode('myKey1', '.my-slider1', Seemple.binders.uiSlider(0, 100));
this.bindNode('myKey2', '.my-slider2', Seemple.binders.uiSlider(1, 1000));
```


{@link Seemple.defaultBinders} OOB has a support for **all form elements** without any exception: ``select`` (including ``multiple``), ``textarea``, ``output``, ``input`` (including all types from the specification of HTML5: ``text``, ``checkbox``, ``radio``, ``range``, ``number``, ``date``, ``search``, ``time``, ``datetime``, ``datetime-local``, ``color`` and others). That means it is not necessary to designate a binder for standard elements.
```html
<input type="color" class="my-color-input">
```
```js
this.bindNode('myColor', '.my-color-input');
this.myColor = '#66bb6a';
```

Besides, after the binding, a new non-standard ``:bound(KEY)`` CSS selector is available for you.
```js
this.bindNode('myKey', '.my-element');

// will find the element '.my-inner-element' inside '.my-element'
this.bindNode('myAnotherKey', ':bound(myKey) .my-inner-element');
```

And the syntax of possible event names is extended:
```js
this.bindNode('myKey', '.my-element');

// will handle the click on the '.my-element' element
this.on('click::myKey', () => { ... });

// will handle the click on the '.my-element .my-inner-element'
this.on('click::myKey(.my-inner-element)', () => { ... });
```

> If a node is not found ``"Bound element is missing"`` error will be thrown. Check out {@link Seemple#bindOptionalNode}.

#### Sandbox definition
{@link Seemple#bindNode} can associate a class instance with the "main" HTML element on the page creating so-called **sandbox**. It is necessary to limit the instance influence on other HTML nodes. A special property ``sandbox`` is used for binding a sandbox.
```html
<div class="my-sandbox">
	<!-- your HTML code -->
</div>
```

```js
this.bindNode('sandbox', '.my-sandbox');
```

The definition of the sandbox adds lots of conveniences for you. For example:
+ allows to use the {@link Seemple#select} and {@link Seemple#$} methods
+ adds a new ``:sandbox`` selector for the {@link Seemple#bindNode}, {@link Seemple#select}, {@link Seemple#$} methods and others
+ adds syntactic sugar for delegated DOM events in the {@link Seemple#on} method

> Keep in mind that you can bind only one sandbox element to ``sandbox`` property. You can try {@link Seemple#bindSandbox} which does the same thing but removes previous binding.

```js
// declare a sandbox
this.bindNode('sandbox', '.my-sandbox');

// .my-element is being searched for in the sandbox
this.bindNode('myKey', ':sandbox .my-element');

// it is not required to specify a key
// for the delegated events inside a sandbox
this.on('click::(.my-button)', () => { ... });

// will put the .inner-node element
// which is inside the sandbox into the console
console.log(this.$('.inner-node'));
```


### Important features of the method and special flags

The fourth argument of ``bindNode`` method is  ``eventOptions``. As usual this object can include special flags or custom data which will be passed to ``bind`` and ``bind:KEY`` event handlers.

```js
this.on('bind:x', evt => {
	console.log(evt.foo); // bar
});
this.bindNode('x', node, binder, { foo: 'bar' });
```

To understand important features of ``bindNode`` it is required to read information below but it's not required to remember all these flags.

#### A flag ``exactKey=false``

If ``key`` string includes a dot then such string will be interpreted as a path to a property of nested object. Seemple will listen all changes of given object tree.

```js
this.a = { b: { c: 'foo' } };
this.bindNode('a.b.c', node);

this.a.b.c = 'bar'; // updates node by bar

const oldB = this.a.b;

this.a.b = { c: 'baz' }; // updates node by baz

// node is not updated because
// the connection with the object subtree is destroyed
oldB.c = 'fuu';
```

In case if you need to use property name as is, use  ``exactKey`` flag with ``true`` value.

```js
this['a.b.c'] = 'foo';
this.bindNode('a.b.c', node, binder, {
	exactKey: true
});
this['a.b.c'] = 'bar';
```

#### A flag ``getValueOnBind``

When ``getValue`` is given then a state of an element will be extracted and assigned to bound property immediately after ``bindNode`` call in case if the property has ``undefined`` value. To force this behavior even if the property has non-undefined value use ``getValueOnbind`` flag with ``true`` value. To cancel this behavior use the same flag with ``false`` value.

#### A flag ``setValueOnBind``

When ``setValue`` is given then the value of the property will be set as element state immediately after ``bindNode`` call in case if the property has non-undefined value. To force this behavior even if the property is ``undefined`` use ``setValueOnBind`` flag with ``true`` value. To cancel this behavior use the same flag but with ``false`` value.

#### Flags ``debounceGetValue=true`` and ``debounceSetValue=true``

One of the most important feature of ``bindNode`` is that the logic of property change and the logic of element state change uses debounce pattern. It means that if bound property is changed many times in a short time then bound element state will be updated only once after small delay (thanks to ``debounceSetValue=true``). If element state is changed many times in a short time (eg corresponding DOM event is triggered), the property gets new value only once after minimum delay (thanks to ``debounceGetValue=true``).

```js
const input = document.querySelector('.my-input');
this.bindNode('x', input);
this.x = 'foo';
console.log(input.value === 'foo'); // false
setTimeout(() => {
	console.log(input.value === 'foo'); // true
});
```

To cancel this behavior (e. g. initiate synchronous binding) use ``debounceSetValue`` and/or ``debounceGetValue`` flags with ``false`` value.

#### Flags ``debounceSetValueOnBind=false`` and ``debounceGetValueOnBind=false``

As described above ``bindNode`` uses debounce pattern on property change and on bound node change. This doesn't apply to a moment when ``bindNode`` is called. To remind, when the method is called a property or a node is changed immediately. When ``debounceGetValueOnBind`` and/or ``debounceSetValueOnBind`` are set to ``true`` then debounce is turned on for binding initialization as well.

#### Flags ``debounceSetValueDelay=0`` и ``debounceGetValueDelay=0``

These flags allow to set debounce delay. ``debounceSetValueDelay`` is used when ``debounceSetValue`` or ``debounceSetValueOnBind`` is ``true``, ``debounceGetValueDelay`` is used when ``debounceGetValue`` or ``debounceGetValueOnBind`` is true.

#### A flag ``useExactBinder=false``

Even if you pass a binder to ``bindNode``, the framework tries to find default binder at {@link Seemple.defaultBinder} and extend it by properties of the passed object. This feature makes possible to use partially re-defined default binder.

For example, we want to bind ``input[type="text"]`` to a property. By default, the standard binder contains ``"on"`` property with ``"input"`` value for this kind of node. It means that the value of the instance property and node state will be synchronized when a user releases a key of the keyboard or pastes text from clipboard. In case if you want synchronization to be performed after the ``"blur"`` DOM event, you need to pass an object containing the only ``"on"`` property as the third argument. This object will extend the default binder, having retained ``getValue`` and ``setValue`` values.

```js
this.bindNode('myKey', '.my-input', { on: 'blur' });
```

To cancel this behavior and use the binder as is, you can use ``useExactBinder`` flag with ``true`` value.

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


@param {string|seemple} key - A property name
@param {string|node|$nodes} node - An HTML element which must be bound to a ``key``
@param {binder} [binder] - A binder containing the following properties: ``on`` , ``getValue``, ``setValue``, ``initialize``, ``destroy``. You can get more detailed information about binders in their documentation: see {@link #typedef-binder}
@param {eventOptions} [eventOptions] - An event options which accepts ``"silent"`` (don't fire ``"bind"`` and ``"bind:KEY"``), flags described above or custom data
@returns {object} self

*/


/**
@method Seemple#bindNode
@importance 2
@variation 2
@summary Alternative syntax: passing of an object
@desc To the {@link Seemple#bindNode} method an object can be passed to avoid multiple invocation of the method and reduce code. Keys of the object are property names and values can get the following look:

- A node
- An object with properties ``node`` and ``binder``
- An array of objects with properties ``node`` and ``binder``

If ``binder`` arg is passed as the second argument then it wil be used as the binder for those elements for which a binder wasn't specified.

@param {object} bindings - (see the example)
@param {binder} [binder] - (see above)
@param {eventOptions} [eventOptions] - (see above)

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
@summary Alternative syntax which makes possible to define unlimited amount of bindings per one ``bindNode`` call.

@desc The method variation allows to pass an array of objects which need to include the following properties:

- ``key`` - a property name
- ``node`` - an HTML element which must be bound to a ``key``
- ``binder`` - a binder (optional)
- ``event`` - event options (optional)

The second arg object includes common event options for all bindings and extends ``event`` object (properties from ``event`` has more priority).

@param {array} batch - A batch of bindings
@param {eventOptions} [commonEventOptions] - Common event options

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
