/**
@method Seemple#off
@importance 1
@fires removeevent
@fires removeevent:NAME
@summary Deletes an event handler
@desc It deletes a handler which has been created before. All the three arguments are optional. You can delete both all the events (without passing any argument) and separate ones (having passed only the event name, the event name and the handler, the event name and the handler and the context).

@see {@link Seemple#on}
@see {@link Seemple#once}
@see {@link Seemple#onDebounce}
@see {@link Seemple#trigger}
@param {eventNames} [names] - A list of event names which are separated by spaces (for example, ``"change:x ajaxcomplete change:y"``)
@param {eventHandler} [callback] - A function-handler
@param {object} [context] - A context
@returns {object} self
@example
this.off('change:x bind');
@example <caption>The deletion of all events</caption>
this.off();
@example <caption>The deletion of an event with definite handler</caption>
const handler = function() {
	//...
}
this.on('change:x', handler);
this.off('change:x', handler);
@example <caption>The deletion of an event with definite context</caption>
const object = {};
this.on('change:x', handler, object);
this.off('change:x', handler, object);
*/
