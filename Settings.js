/**
 * @author Alina Fleckenstein
 */
var Settings = new Class({
     /**
	 * @constructor Initializing Settings
	 */
    initialize: function () {
        var username;
        var vertices;
        var level;
        var velocity;
    },

	/**
	 * The updateSpans function updates the <span> fields in the html page. 
  	 */
    updateSpans: function () {
        document.getElementById("userName").innerHTML = this.username;
        document.getElementById("currentVelocity").innerHTML = Math.round( (4000 - this.getValue("velocity")) / 40) + '%';
        document.getElementById("currentVertices").innerHTML = this.getValue("vertices");
        document.getElementById("currentLevel").innerHTML = this.getValue("level");
    },

	/**
	 * The init function check, whether a user has already signed up before, 
     * if not, user has to type in new user name
  	 */
    init: function () {
        this.username = this.getLastUser();
        var tempUserName;
        if (this.username == null) {
            ((tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).",
                "Enter your username here!")) != null) ? this.newUser(tempUserName) : this.newUser("Anonym");
        }
        this.updateSpans();
    },

	/**
	 * The setValues function creates a Cookie, which expires 365 days after being set. 
     * The cookie is named after current User and has the values of user's velocity, vertices and level. 
  	 */
    setValues: function () {
        var exdays = 365;
        var date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        // "x" to separate values
        var values = escape(this.velocity) + "x" + escape(this.vertices) + "x" + escape(this.level);
        document.cookie = escape(this.username) + "=" + values + expires + "; path=/";
        this.updateSpans();
    },

	/**
	 * The changeUser function changes the current user. cookie lastUser is set and spans are updatet
  	 * @param user The new user
  	 */
    changeUser: function (user) {
        this.username = user;
        this.setLastUser();
        this.updateSpans();
    },

	/**
	 * The newUser function creates a new user in system.
     * Function checks a number of rules, if all rules are obeyed: 
     * Update username, set lastUser cookie, set values for velocity, vertices and level, create user's cookie
  	 * @param user The new user to sign in.
  	 */
    newUser: function (user) {
        var create = true;
        var users = this.getAllUsers();
        // to ensure that no browser overwrites any cookie, there are only 5 usercookies + 1 lastUser cookie allowed. 
        if (users.length >= 5) {
            alert("Es dürfen maximal 5 User gespeichert werden");
            create = false;
        }
        else for (var i = 0; i < users.length; i++) {
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

	/**
	 * The getValue function extracts a certain value from user's cookie
  	 * @param value The value you want to know. i.e. velocity, vertices or level 
  	 */
    getValue: function (value) {
        if (value == "lastUser") {
            var cookieName = "lastUser=";
        } else {
            var cookieName = this.username + "=";
        }
        // split all cookies, save cookies in cookieArray
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
            if (cookie.indexOf(cookieName) == 0 && value == "lastUser") {
                return cookie.substring(cookieName.length, cookie.length);
            } else if (cookie.indexOf(cookieName) == 0) {
                var values = cookie.substring(cookieName.length, cookie.length);
                // split current user's cookie to get values, save values in valueArray
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

	/**
	 * The getLastUser function returns last user logged into system to update user's settings
  	 */
    getLastUser: function () {
        return this.getValue("lastUser");
    },

	/**
	 * The setLastUser function creates cookie to save current user as last user logged into system
  	 */
    setLastUser: function () {
        var exdays = 365;
        var date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = "lastUser=" + escape(this.username) + expires + "; path=/";
    },

	/**
	 * The getAllUser function extracts all saved usernames from cookies
  	 */
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

	/**
	 * The deleteUser function deletes user's cookie through setting a negative expiredate 
  	 * @param user The user you want to delete from system 
  	 */
    deleteUser: function (user) {
        var exdays = -1;
        var date = new Date();
        date.setTime(date.getTime() + exdays);
        var expires = "; expires=" + date.toGMTString();
        document.cookie = user + "=" + "" + expires + "; path=/";
    },

	/**
	 * The setVelocity function sets current velocity value
  	 * @param value The value you want to save 
  	 */
    setVelocity: function (value) {
        this.velocity = value;
    },

	/**
	 * The setVertices function sets current vertices value
  	 * @param value The value you want to save 
  	 */
    setVertices: function (value) {
        this.vertices = value;
    },

	/**
	 * The setLevel function sets current level value
  	 * @param value The value you want to save 
  	 */
    setLevel: function (value) {
        this.level = value;
    },

	/**
	 * The getVelocity function returns current velocity value
  	 * @return velocity value
  	 */
    getVelocity: function () {
        return parseInt(this.getValue("velocity"));
    },

	/**
	 * The getVertices function returns current vertices value
  	 * @return vertices value
  	 */
    getVertices: function () {
        return parseInt(this.getValue("vertices"));
    },

	/**
	 * The getLevel function returns current level value
  	 * @return level value
  	 */
    getLevel: function () {
        return parseInt(this.getValue("level"));
    }
});