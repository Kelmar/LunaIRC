const ko = require('knockout');

const log = require('./logging.js');

class Target
{
    constructor(name)
    {
        this.name = ko.observable(name);
        this.lines = ko.observableArray();
    }
}

class User extends Target
{
    constructor(name)
    {
        super(name);
    }
}

class Group extends Target
{
    constructor()
    {
        super(name);
    }
}

module.exports.Target = Target;
module.exports.User = User;
module.exports.Group = Group;