/**
@function Seemple.binders.className
@module seemple/binders/classname
@importance 2
@since 0.1
@summary Returns a binder which switches over DOM node class name depending on an object property value. If property value equals ``true`` non-strictly, a class name is added, otherwise - it's removed. The logic can be changed by passing ``false`` as the second argument and in this way, a class name will be added  when a property value equals ``false`` non-strictly and vice versa.
@param {string} className
@param {boolean} [bool=true]
@returns {binder}
@example
this.bindNode('myKey', '.my-element',
        Seemple.binders.className('foo'));

this.myKey = true; // adds the 'foo' class

this.myKey = false; // removes the 'foo' class
@example
this.bindNode('myKey', '.my-element',
        Seemple.binders.className('foo', false));

this.myKey = false; // adds the 'foo' class

this.myKey = true; // removes the 'foo' class
*/
