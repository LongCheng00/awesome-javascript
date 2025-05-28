function AddressBook() {
  this.contacts = [];
  this.initialComplete = false;
}

AddressBook.prototype.addContact = function(contact) {
  return this.contacts.push(contact);
}

AddressBook.prototype.getContact = function(index) {
  return this.contacts[index];
}

AddressBook.prototype.deleteContact = function(index) {
  return this.contacts.splice(index, 1);
}

AddressBook.prototype.getInitialContacts = function(cb) {
  var self = this;
  setTimeout(function() {
    self.initialComplete = true;
    if (cb) {
      return cb();
    }
  }, 3);
}