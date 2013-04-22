var Settings = new Class({
    initialize: function () {
        var username;
        var vertices;
        var level;
        var velocity;
    },

    // update spans to current values
    updateSpans: function () {
        document.getElementById("userName").innerHTML = this.username;
        document.getElementById("currentVelocity").innerHTML = Math.round(this.getValue("velocity") / 40) + 1 + '%';
        document.getElementById("currentVertices").innerHTML = this.getValue("vertices");
        document.getElementById("currentLevel").innerHTML = this.getValue("level");
    },

    // set iniital values
    init: function () {
        this.username = this.getLastUser();
        var tempUserName;
        if (this.username == null) {
            ((tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).",
                "Enter your username here!")) != null) ? this.newUser(tempUserName) : this.newUser("Anonym");
        }
        this.updateSpans();
    },

    // set cookie with new values
    setValues: function () {
        var exdays = 365;
        var date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        var values = escape(this.velocity) + "x" + escape(this.vertices) + "x" + escape(this.level);
        document.cookie = escape(this.username) + "=" + values + expires + "; path=/";
        this.updateSpans();
    },

    // changes the current user
    changeUser: function (user) {
        this.username = user;
        this.setLastUser();
        this.updateSpans();
    },

    // creates a new user
    newUser: function (user) {
        var create = true;
        var users = this.getAllUsers();
        for (var i = 0; i < users.length; i++) {
            if (user == users[i]) {
                alert("Dieser Benutzername ist leider schon vergeben");
                create = false;
            }
        }
        if (create) {
            this.username = user;
            this.setLastUser();
            this.velocity = 2000;
            this.vertices = 5;
            this.level = 3;
            this.setValues();
        }
    },

    // returns value of given string
    getValue: function (value) {
        if (value == "lastUser") {
            var cookieName = "lastUser=";
        } else {
            var cookieName = this.username + "=";
        }
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
            if (cookie.indexOf(cookieName) == 0 && value == "lastUser") {
                return cookie.substring(cookieName.length, cookie.length);
            } else if (cookie.indexOf(cookieName) == 0) {
                var values = cookie.substring(cookieName.length, cookie.length);
                var valueArray = values.split('x');
                switch (value) {
                    case "velocity":
                        return valueArray[0];
                        break;
                    case "vertices":
                        return valueArray[1];
                        break;
                    case "level":
                        return valueArray[2];
                        break;
                    default:
                        return null;
                }
            }
        }
        return null;
    },

    // returns last active user
    getLastUser: function () {
        return this.getValue("lastUser");
    },

    // sets last active user
    setLastUser: function () {
        var exdays = 365;
        var date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = "lastUser=" + escape(this.username) + expires + "; path=/";
    },

    // returns array with all users
    getAllUsers: function () {
        var cookieArray = document.cookie.split(';');
        var users = new Array(cookieArray.length - 1);
        var arrCount = 0;
        for (var i = 0; i < cookieArray.length; i++) {
            var uname = cookieArray[i].substring(0, cookieArray[i].indexOf('='));
            uname = uname.replace(/^\s+|\s+$/g, "");
            if (uname != "lastUser") {
                users[arrCount] = uname;
                arrCount++;
            }
        }
        return users;
    },

    // deletes User
    deleteUser: function (user) {
        var exdays = -1;
        var date = new Date();
        date.setTime(date.getTime() + exdays);
        var expires = "; expires=" + date.toGMTString();
        document.cookie = user + "=" + "" + expires + "; path=/";
    },

    // sets velocity
    setVelocity: function (value) {
        this.velocity = value;
    },

    // sets vertices
    setVertices: function (value) {
        this.vertices = value;
    },

    // sets level
    setLevel: function (value) {
        this.level = value;
    },

    // returns velocity
    getVelocity: function () {
        return parseInt(this.getValue("velocity"));
    },

    // returns vertices
    getVertices: function () {
        return parseInt(this.getValue("vertices"));
    },

    // returns level
    getLevel: function () {
        return parseInt(this.getValue("level"));
    }
});