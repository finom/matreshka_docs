/**
@method Seemple#once
@importance 2
@fires addevent
@fires addevent:NAME
@summary Додає обробник подій, який може бути викликаний один раз
@desc Метод працює так само, як і {@link Seemple#on} але переданий обробник може бути викликаний тільки один раз.

> Зверніть увагу, що у метода є {@link Seemple.once статичний аналог}

@see {@link Seemple#on}
@see {@link Seemple#off}
@see {@link Seemple#onDebounce}
@see {@link Seemple#trigger}
@param {eventNames} names - Ім'я події або кілька імен, розділених пробілом (наприклад, <code>"change:x ajaxcomplete change:y" </code>)
@param {eventHandler} callback - Функція, яка викликається за подією
@param {object} [context] - Контекст обробника
@returns {object} self
@example
this.x = 1;

this.once('change:x', () => {
	alert('x is changed');
});

this.x = 2; // виводить 'x is changed'

this.x = 3; // нічого не робить
*/


/**
@method Seemple#once
@importance 2
@variation 2
@since 1.1
@summary Альтернативний синтаксис: пари "подія-обробник"
@desc У метод {@link Seemple#once} можна передати об'єкт з парами подія-обробник, щоб уникнути багаторазового виклику методу і скоротити код.
@see {@link Seemple#on(2)}
@param {object} evtnameHandlerObject - Об'єкт з подіями
@param {object} [context] - Контекст обробників
@returns {object} self
@example
this.once({
	'custom': evt => { ... },
	'click::x': evt => { ... },
	'change:y': evt => { ... }
});
*/
