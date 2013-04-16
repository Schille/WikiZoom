var Settings = new Class({

    initialize: function () {

    },

    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },

    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    checkCookie: function () {
        var knoten = getCookie("Knoten");
        var level = getCookie("Level");
        if (knoten != null && knoten != "" && level != null && level != "") {
            alert(" Du hast so viele Knoten eingestellt: " + knoten + " Und Level: " + level);
        }
        else {
            alert("Hallo, du hast noch keine Einstellungen gespeichert und jetzt die Möglichkeit dazu! Viel Spaß!");
        }
    },

    setLevelCookie: function () {
        var newLevel = document.getElementById('newLevel').value;
        if (newLevel != null && newLevel != "") {
            setCookie("Level", newKnoten, 365);
        }
    },

    setKnotenCookie: function () {
        var newKnoten = document.getElementById('newKnoten').value;
        if (newKnoten != null && newKnoten != "") {
            setCookie("Knoten", newKnoten, 365);
        }

    },

    setBeideCookie: function () {
        var newKnoten = document.getElementById('newKnoten').value;
        setCookie("Knoten", newKnoten, 365);
        var newLevel = document.getElementById('newLevel').value;
        setCookie("Level", newLevel, 365);
    },

    checkNumberLevel: function () {
        if (document.getElementById('newLevel').value < "0" || "9" < document.getElementById('newLevel').value) {
            document.getElementById('newLevel').value = "";
            document.getElementById('newLevel').focus();
            return false;
        }
    },

    checkNumberKnoten: function () {
        if (document.getElementById('newKnoten').value < "0" || "9" < document.getElementById('newKnoten').value) {
            document.getElementById('newKnoten').value = "";
            document.getElementById('newKnoten').focus();
            return false;
        }
    },

    test: function () {
        alert("Hallo");
    }


});