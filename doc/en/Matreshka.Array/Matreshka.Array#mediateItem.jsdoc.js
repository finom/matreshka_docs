/**
@method Seemple.Array#mediateItem
@importance 2
@since 0.1
@see {@link Seemple.Array#Model}
@see {@link Seemple#mediate}
@summary Transforms an item value
@desc This method is used to transform ``Seemple.Array`` items. Note that calling of this method overrides the {@link Seemple.Array#Model} property.
@param {function} mediator - A function which should return transformed value of an item
@example
// all the array items are integers
this.mediateItem(item => parseInt(item) || 0);
@example
this.push(1, 2, 3, 4, 5);

// all the array items are strings
this.mediateItem(String);

this.push(6, 7);

this.unshift(true, {});

// ["true", "[object Object]", "1", "2", "3", "4", "5", "6", "7"]
console.log(seempleArray.toJSON());
@example
this.mediateItem(item => {
	if(item.something) {
		return new FirstModel(item);
	} else {
		return new SecondModel(item);
	}
});
*/
