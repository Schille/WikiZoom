var Settings = new Class({
    initialize: function () {
        var velocity;
        var vertices;
        var level;
    },

    updateVars: function () {
        this.setValue('vertices', this.vertices, 365);
        this.setValue('velocity', this.velocity, 365);
        this.setValue('level', this.level, 365);
        this.updateSpans();
    },

    updateSpans: function () {
        document.getElementById("verticesSaved").innerHTML = this.getValue("vertices");
        document.getElementById("levelSaved").innerHTML = this.getValue("level");
        document.getElementById("velocitySaved").innerHTML = Math.round(this.getValue("velocity") / 40) + 1 + '%';
    },

    getValue: function (cookieName) {
        var cookieName = cookieName + "=";
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
            if (cookie.indexOf(cookieName) == 0) return cookie.substring(cookieName.length, cookie.length);
        }
        return null; 
    },

    setValue: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    init: function () {
        var currentUser = this.getValue("username");
        var tempUserName;
        /* if (currentUser == null) {
        (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", "Enter your username here!")) != null ? currentUser = tempUserName : currentUser = "";
        this.setValue('username', currentUser, 365);
        }*/

        var tempLevel = this.getValue("level");
        var tempNode = this.getValue("vertices");
        var tempSpeed = this.getValue("velocity");
        if (tempLevel == null) {
            this.setValue("level", 3, 365);
        }
        if (tempNode == null) {
            this.setValue("vertices", 5, 365);
        }
        if (tempSpeed == null) {
            this.setValue("velocity", 2000, 365);
        }


        document.getElementById("userName").innerHTML = this.getValue("username");
        this.updateSpans();
    },

    changeUsername: function () {
        var currentUser = this.getValue("username");
        var tempUserName;
        if (currentUser == null) {
            (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", "Enter your username here!")) != null ? currentUser = tempUserName : currentUser = "";
        } else {
            (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", currentUser)) != null ? currentUser = tempUserName : "";
        }
        this.setValue('username', currentUser, 365);
        document.getElementById("userName").innerHTML = this.getValue("username");
    },

    setVelocity: function (value) {
        this.velocity = value;
    },

    setVertices: function (value) {
        this.vertices = value;
    },

    setLevel: function (value) {
        this.level = value;
    }
});