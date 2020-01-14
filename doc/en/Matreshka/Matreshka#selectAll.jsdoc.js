/**
@method Seemple#selectAll
@synonym Seemple#$
@importance 2
@summary Returns HTML nodes corresponding to a selector from a sandbox
@desc After sandbox declaration using {@link Seemple#bindNode} method, you can get its descendants. Besides, the method supports the ``:bound(KEY)`` selector.

> The method has {@link Seemple.selectAll static alternative}

@param {string} selector - A selector
@returns {$nodes}
@example
this.bindNode('sandbox', '.app');
nodes = this.selectAll('.my-element');
// the same as
nodes = this.$('.my-element'); // $ is a short reference to selectAll
// the same as
nodes = this.$nodes.sandbox.find('.my-element');
// the same as
nodes = $('.app').find('.my-element');

@example <caption>The ``:bound(KEY)`` selector</caption>
this.bindNode('myKey', '.my-element');
nodes = this.selectAll(':bound(myKey) .my-another-element');
// the same as
nodes = this.$nodes.myKey.find('.my-another-element');
// the same as
nodes = $('.my-element').find('.my-another-element');
*/


/**
@method Seemple#$
@importance 2
@variation instance
@summary Does the same as {@link Seemple#selectAll}
@example
this.$('.my-element');
*/
