/**
@method Seemple.trigger
@module seemple/trigger
@importance 3
@since 1.1
@summary Fires an event
@desc This static method works the same as {@link Seemple#trigger} and all its variations, but accepts any kind of JavaScript object as first argument.
@returns {object} The first argument
@see {@link Seemple#trigger}
@example
const object = {};
Seemple.on(object, 'foo', evt => {
	alert(evt.hello);
});

Seemple.trigger(object, 'foo', { hello: 'World' });
*/
