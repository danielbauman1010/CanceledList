Teachers = new Mongo.Collection('teachers');
Requests = new Mongo.Collection('requests');
if (Meteor.isClient) {
  Meteor.subscribe("teachers");
  Meteor.subscribe("requests");
  Session.set("notAdmin",true);
  Template.body.helpers({
    teachers: function() {
      return Teachers.find({});
    },
    notAdmin: function() {
      if(Session.get("notAdmin") == true) {
        return true;
      } else {
        return false;
      }
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
  Template.askToJoin.events({
    "submit .emailRequest": function(event) {
      event.preventDefault();
      var email = event.target.email.value;
      Meteor.call("addRequest", email);
    }
  });
}
Meteor.methods({
  addTeacher:   function (name) {
    Teachers.insert({name: name});
  },
  deleteTeacher: function(teacherId) {
    Teachers.remove(teacherId);
  },
  addRequest: function(email) {
    Requests.insert({email: email});
  },
  deleteRequest: function(requestId) {
    Requests.remove(requestId);
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("teachers", function() {
      return Teachers.find();
    });
    Meteor.publish("requests", function() {
      return Requests.find();
    });
  });
}
