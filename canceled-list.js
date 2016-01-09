Teachers = new Mongo.Collection('teachers');
if (Meteor.isClient) {
  // counter starts at 0
  Session.set("notAdmin",true);
  Template.body.helpers({
    teachers: function() {
      return Teachers.find({});
    }

  });
  Template.addTeacher.events({
    "submit .new-teacher": function (event) {
      if(!Session.get("notAdmin")) {
        event.preventDefault();

        var text = event.target.text.value;

        Meteor.call("addTeacher", text);

        event.target.text.value = "";
    }
    }
  });
  Template.addTeacher.helpers({
    notAdmin: function() {
      if(Session.get("notAdmin") == true) {
        return true;
      } else {
        return false;
      }
    }
  });
  Template.teacher.events({
    "click .delete": function() {
      if(!Session.get("notAdmin")) {
        Meteor.call("deleteTeacher", this._id);
      }

    }
  });

  Template.teacher.helpers({
    notAdmin: function() {
      if(Session.get("notAdmin") == true) {
        return true;
      } else {
        return false;
      }
    }
  });

  Template.adminCheck.events({
    "submit .admin-password": function(event) {
      event.preventDefault();
      var password = event.target.password.value;
      if(password === "adminpassword202020") {
        Session.set("notAdmin", false);
      }
      event.target.password.value = "";
    }
  });
  Template.adminCheck.helpers({
    notAdmin: function() {
      if(Session.get("notAdmin") == true) {
        return true;
      } else {
        return false;
      }
    }
  });
}
Meteor.methods({
  addTeacher:   function (name) {
    Teachers.insert({name: name});
  },
  deleteTeacher: function(teacherId) {
    Teachers.remove(teacherId);
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
