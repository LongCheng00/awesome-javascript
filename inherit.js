
function inheritPrototype(Child, Parent) { 
  const prototype = Object.create(Parent.prototype)
  prototype.constructor = Child
  Child.prototype = prototype
}

function Parent(name) {
  this.name = name
}
Parent.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
}
function Child(name, age) {
  Parent.call(this, name) // Call Parent constructor with Child context
  this.age = age
}
inheritPrototype(Child, Parent)
Child.prototype.sayAge = function() {
  console.log(`I am ${this.age} years old`);
}

// Example usage
const child = new Child('Alice', 10);
child.sayHello(); // Hello, my name is Alice
child.sayAge(); // I am 10 years old
// Example usage
const parent = new Parent('Bob');
parent.sayHello(); // Hello, my name is Bob
// parent.sayAge(); // Error: parent.sayAge is not a function 