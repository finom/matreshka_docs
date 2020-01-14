/**
@method Seemple#select
@importance 2
@summary Повертає елемент з пісочниці, відповідний селектору
@desc Метод дуже схожий на {@link Seemple#selectAll}, але повертає лише один елемент або ``null``

> У метода є {@link Seemple.select статичний аналог}.

@param {string} selector - Селектор
@returns {node|null}
@example
this.bindNode('sandbox', '.app');
this.select('.my-element');
// те ж саме, що і
this.nodes.sandbox.querySelector('.my-element');
// те ж саме, що і
$('.app').find('.my-element')[0];
*/
