/**
@function Matreshka.binders.output
@module matreshka/binders/output
@importance 3
@since 1.4
@summary Возвращает байндер, связывающий свойство объекта с элементом ``output``. Напрямую байндер использовать не обязательно, так как он входит в список {@link Matreshka.defaultBinders}.
@returns {binder}
@example
this.bindNode('myKey', '.my-output', Matreshka.binders.output());
*/
