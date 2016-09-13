/**
@function Matreshka.binders.dataset
@module matreshka/binders/dataset
@importance 2
@since 1.1
@summary Returns a binder which changes given [dataset](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset) property of bound DOM node depending on instance property value.
@param {string} property - A property of ``dataset`` object
@returns {binder}
@example
this.bindNode('myKey', '.my-progres', Matreshka.binders.dataset('myProp'));
this.myKey = 'cool value';
*/