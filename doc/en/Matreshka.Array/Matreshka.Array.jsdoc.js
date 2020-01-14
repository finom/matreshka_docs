/**
@class Seemple.Array
@module seemple/array
@inherits Seemple
@importance 1
@classdesc The ``Seemple.Array`` serves as collection class in Seemple framework. It is inherited from the {@link Seemple} class, obtaining all parent possibilities without exception. Besides, ``Seemple.Array`` has all methods that ordinary array has.

#### All the methods which have been adopted from the built-in Array work like their originals
A programmer familiar to the methods of native ``Array`` can understand immediately by means of which method adds (``push``, ``unshift``, ``splice``), deletes (``pop``, ``shift``, ``splice``), sorts (``sort``, ``reverse``) items etc.

For the reason that methods work the same as original ones (with a few exceptions), they are not presented in this documentation separately but they are gathered in the {@link Seemple.Array#METHOD} section.
```js
this.push(1, 2, 3);
this.pop();
```

#### All methods adopted from built-in ``Array`` which modify an array can be called with an event object passing

The ``method_`` syntax is used for this, where underscore at the end of a method name means that the last argument is an event object. Such methods are not given in this documentation because it is necessary to remember their syntax only. See {@link Seemple.Array#METHOD_}.
```js
this.push_(1, 2, 3, {
	silent: true
});

this.pop_({
	foo: 'bar'
});
```

#### A developer has an opportunity of catching any data modification

__While using a methods adopted from built-in ``Array``, events with corresponding name are fired.__ Calling the ``push`` method, the ``push`` event  is fired, calling the ``shift`` method, the ``shift`` event is fired,  calling the ``sort`` method, the ``sort`` event is fired, and so on.
```js
this.on('push', evt => {
	console.log('push is called');
});

this.push(1, 2, 3);
```

__While adding items, ``add`` and ``addone`` events are fired.__ The first one is fired once on adding (for example, you have added few items using ``push`` and the event has been fired only once), the second one is fired once on every added item. On the ``add`` event triggering, an array of added items is passed to an event object as ``added`` property and on the ``addone`` triggering, each particular added item is passed to it as ``addedItem`` property.
```js
this.on('add', evt => {
	console.log(evt.added); // [1,2,3]
});

this.push(1, 2, 3);
```
```js
// the handler will be called three times,
// as three new item have been added to the array
this.on('addone', evt => {
	console.log(evt.addedItem); // 1 ... 2 ... 3
});

this.push(1, 2, 3);
```

__On removing items the same logic is observed__: ``remove`` triggers once even though several items have been removed (removed items are contained in the ``removed`` property) and the ``removeone`` event triggers for each removed item individually (removed item is contained in the ``removedItem`` property).

```js
this.push(1, 2, 3, 4, 5);

this.on('remove', evt => {
	console.log(evt.removed); // [2, 3, 4]
});

this.splice(1, 3);
```
```js
this.push(1, 2, 3, 4, 5);

// the handler will be called three times,
// as three items have been removed from the array
this.on('removeone', evt => {
	console.log(evt.removedItem); // 2 ... 3 ... 4
});

this.splice(1, 3);
```
__On every modification of an array the ``modify`` event is fired__, allowing to catch all changes in the array (adding, removing, re-sorting).
```js
this.on('modify', evt => {
	console.log(evt.added);
	console.log(evt.removed);
});
```

__``length`` is an ordinary property which can be bound to HTML node__  or you can listen changes using the ``change:length`` event name.

> For example, on adding three items using the ``push`` method with three arguments, the following events: ``push``, ``add``, ``addone`` (three times), ``modify``, ``change:length`` are fired.

#### Model
The {@link Seemple.Array#Model} property specifies a class of items that an array contains. It is recommended to inherit ``Model`` from the {@link Seemple.Object} class or the {@link Seemple.Array} one (in case if it is necessary to get a collection of collections) in order to get the opportunity of converting an array into an ordinary one recursively by using the {@link Seemple.Array#toJSON} method.

#### Automatic rendering
``Seemple.Array`` can render HTML nodes on a page automatically in any modifications of an array. The {@link Seemple.Array#itemRenderer} property is used for that. You do not have to worry about rebuilding the HTML tree, ``Seemple.Array`` does it for you. For detailed information read the documentation of {@link Seemple.Array#itemRenderer}.

@see {@link Seemple.Array#itemRenderer}
@see {@link Seemple.Array#Model}

@example <caption>An instance creation</caption>
new Seemple.Array();
@example <caption>An instance creation with length specifying</caption>
new Seemple.Array(42);
@example <caption>Items passing on creation</caption>
new Seemple.Array('Hi', {a: 'b'});
@example <caption>The inheritance</caption>
class MyClass extends Seemple.Array {
	constructor(items) {
		super(...items).sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}

@example <caption>The inheritance using {@link Seemple.Class} function</caption>
const MyClass = Seemple.Class({
	extends: Seemple.Array,
	constructor(items) {
		this.recreate(items).sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
*/
