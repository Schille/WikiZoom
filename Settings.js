var Settings = new Class({
    initialize: function () {

    },
	
    updateVars: function () {
        if (document.getElementById("levelSettings").value != "" && !isNaN(document.getElementById("levelSettings").value)) {
            this.setCookie('Level', document.getElementById('levelSettings').value, 365);
        }
        if (document.getElementById("vertexSettings").value != "" && !isNaN(document.getElementById("vertexSettings").value)) {
            this.setCookie('Knoten', document.getElementById('vertexSettings').value, 365);
        }
        
        this.setCookie('Speed', $('speed_value').get('html'), 365);
        document.getElementById("nodes").innerHTML = this.getCookie("Knoten");
        document.getElementById("level").innerHTML = this.getCookie("Level");
        document.getElementById("speed").innerHTML = this.getCookie("Speed");
        document.getElementById("levelSettings").value = "";
        document.getElementById("vertexSettings").value = "";
        

    },
    getCookie: function (c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    },

    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    init: function () {
        var currentUser = this.getCookie("username");
        var tempUserName;
        if (currentUser == null) {
            (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", "Enter your username here!")) != null ? currentUser = tempUserName : currentUser = "";
            this.setCookie('username', currentUser, 365);
        }
        var tempLevel = this.getCookie("Level");
        var tempNode = this.getCookie("Knoten");
        var tempSpeed = this.getCookie("Speed");
        if (tempLevel == null) {
            this.setCookie("Level", 3, 365);
        }
        if (tempNode == null) {
            this.setCookie("Knoten", 5, 365);
        }
        if (tempSpeed == null) {
            this.setCookie("Speed", 50, 365);
        }
        
        
        document.getElementById("userName").innerHTML = this.getCookie("username");
        document.getElementById("nodes").innerHTML = this.getCookie("Knoten");
        document.getElementById("level").innerHTML = this.getCookie("Level");
        document.getElementById("speed").innerHTML = this.getCookie("Speed");
    },

    checkNumber: function (checkValue) {
        if (isNaN(document.getElementById(checkValue).value)) {
            document.getElementById(checkValue).value = "";
            document.getElementById(checkValue).focus();
            return false;
        }
    },

    changeUsername: function () {
        var currentUser = this.getCookie("username");
        var tempUserName;
        if (currentUser == null) {
            (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", "Enter your username here!")) != null ? currentUser = tempUserName : currentUser = "";
        } else {
            (tempUserName = prompt("Welcome to WikiZoom, please feel free to change settings =).", currentUser)) != null ? currentUser = tempUserName : "";
        }
        this.setCookie('username', currentUser, 365);
        document.getElementById("userName").innerHTML = this.getCookie("username");
    }
});