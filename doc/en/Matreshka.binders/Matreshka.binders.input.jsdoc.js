/**
@function Matreshka.binders.input
@module matreshka/binders/input
@importance 3
@since 0.3
@summary Returns a binder which binds an object property to an ``input`` element value. It is not obligatory to use the binder directly because it is included in the {@link Matreshka.defaultBinders} list.
@param {string} [type] - Input type
@returns {binder}
@example
this.bindNode('myKey', '.my-input', Matreshka.binders.input('range'));
*/
