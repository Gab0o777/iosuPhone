/**
 * Created by santiagogoncalves on 30/8/16.
 */

var RESTurl = "";


var arrayMensajes = new Object();
$("#settingsHolder").load("settings.html");
$("#historyHolder").load("history.html");
$("#contactsHolder").load("contacts.html", function () {
    $(".add").click(function () {

        if ($("#addFormulario").css('display') == "none") {
            $("#addFormulario").show();
        } else {
            $("#addFormulario").hide();
        }

    });
    $(".headerContac").click(function () {
        if ($(this).children('i').hasClass('fa-plus')) {

            $(this).children('i').removeClass('fa-plus').addClass('fa-minus');
            $(this).next('div').slideDown();
        } else {
            $(this).children('i').removeClass('fa-minus').addClass('fa-plus');
            $(this).next('div').slideUp();
        }
    });

    $("#upload-contacts").bind('change', function (e) {

        var archivo = this.files[0];

        Papa.parse(archivo, {
            delimiter: ";",
            complete: function (results) {
                var csv = results.data;
                for (var i = 0; i < csv.length; i++) {
                    if (analizeName(csv[i][0]) && analizeNumber(csv[i][1])) {
                        addContact(csv[i][0], csv[i][1]);
                    }
                }
            }
        });

        $("#addFormulario").hide();


    });
});
$("#chatHolder").load("chat.html", function () {

    $("#chatText").keypress(function (e) {
        if (e.which == 13) {
            send($(this).val());
            return false;
        }

        if ($(this).val().length == 1 || $(this).val().length == 2 || $(this).val().length == 3) {
            sendTyping();
        } else if ($(this).val().length == 0) {
            stopSendTyping();
        }

    });

});

function send(message) {

    if (message) {
        var mensaje = new Object();
        mensaje.source = settings.callerid;
        mensaje.sourceagent = settings.callerid;
        mensaje.destination = destination;
        mensaje.message = message.trim();
        mensaje.type = "ChatMessage";

        stopSendTyping();
        SendMessage(destination, JSON.stringify(mensaje));
        var mensajesActual = arrayMensajes[destination];
        if (mensajesActual != undefined) {
            updateChatHistorySend(mensaje);
        } else {
            addToChatHistorySend(mensaje);
        }
        loadContactChatFinal();
        $("#chatText").val("");
    }
}

function sendTyping() {
    SendMessage(destination, createTypingMessage(true));
}

function stopSendTyping() {
    SendMessage(destination, createTypingMessage(false));
}

function createTypingMessage(param) {
    var obj = {};
    obj.source = settings.callerid;
    obj.sourceagent = destination
    obj.destination = this.number;
    if (param) obj.message = "typing";
    else obj.message = "nottyping";
    obj.type = "ChatMessageTyping";
    return JSON.stringify(obj);
}

$("#phoneHolder").load("phone.html");
var contactList = localStorage.getItem('contacts');
var activeTab = "phoneHolder";
addTabHandler();

function addTabHandler() {
    $(".tab").click(function () {
        var tab = $(this).attr('data-tab');
        $(".tab").removeClass("activeTab");
        $(this).addClass("activeTab");
        if (tab != activeTab) {
            $(".tabHolder").css('display', 'none');
            $("#" + tab).css('display', 'block');
            activeTab = tab;
        }
        if (tab == "contactsHolder") {
            getContacts();
        }
    });
}

function fillHistorical() {
    if (historical != []) {
        var tr = "";
        var tiempoCall;
        for (var i = historical.length -1; i >= 0; i--) {
            tr+=createTR(historical[i]);
        }
        $("#historical").html(tr);
    }
}

function createTR(cdr) {
  tiempoCall = cdr.duration;
  var claseTiempo;
  if (tiempoCall === 0) {
      claseTiempo = "redTime";
  } else {
      claseTiempo = "greenTime";
  }
  var arrow = '<i class="fa fa-arrow-up"></i>';
  if (cdr.inbound !== false) {
      arrow = '<i class="fa fa-arrow-down"></i>';
  }
    var objetoDiaLlamada = "";
    if (cdr.date != null) {
        objetoDiaLlamada = new Date(cdr.date);
        var day = objetoDiaLlamada.getDate();
        var monthIndex = objetoDiaLlamada.getMonth();
        var year = objetoDiaLlamada.getFullYear();

        var segundos = objetoDiaLlamada.getSeconds();
        var minutos = objetoDiaLlamada.getMinutes();
        var horas = objetoDiaLlamada.getHours();
        objetoDiaLlamada = (year + "-" + monthIndex + 1 + "-" + day + " " + horas + ":" + minutos + ":" + segundos);


    }

    return '<div onclick="clickHistorico(' + cdr.calleridnum + ')" class="historyDiv"> <label class="numberHistory">' + cdr.calleridnum + '</label><label class="nameHistory">' + arrow + '</label> <label class="date">' + objetoDiaLlamada + '</label> <label class="timeHistory ' + claseTiempo + '">' + tiempoCall.toString().toHHMMSS() + '</label> </div>';

}
function addHistorical(cdr) {

  $('#historical').prepend(createTR(cdr));

}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
};


function clickHistorico(numero) {
    $(".tabHolder").css('display', 'none');
    $("#phoneHolder").css('display', 'block');
    activeTab = "phoneHolder";
    $("#output").val(numero);
    makeCall(numero);
}


function createTrContactOnline(contact) {
    if (contact.objectName.split("-")[0] != settings.callerid) {
        return '<div class="contact">' +
            '<img src="' + rutaImagen(contact.description.split("-")[0]) + '" class="imgContacts"/>' +
            '<div class="holderContactLbl"><label class="lblContacts">' + contact.description.split("-")[0] + '</label>' +
            '<label class="lblContactNumber"><i class="fa fa-phone "></i> ' + contact.objectName.split("-")[0] + '</label> ' +
            '<label class="lblContactActions"><i data-data="' + contact.objectName + '" data-name="' + contact.description.split('-')[0] + '" onclick="clickChat(this)" class="fa fa-comment iconContact1 iconC"></i>' +
            '<i onclick="clickHistorico(' + contact.objectName.split("-")[0] + ')"  class="fa fa-phone iconContact iconC"></i>' +
            '<i class="fa fa-circle-o iconOnline"></i>' +
            '</label>' +
            '</div>' +
            '</div>'

    } else {
        return "";
    }
}

function createTrOffline(contact) {
    if (contact.objectName.split("-")[0] != settings.callerid) {

        return '<div class="contact"><img src="' + rutaImagen(contact.description.split("-")[0]) + '" class="imgContacts"/><div class="holderContactLbl"><label class="lblContacts">' + contact.description.split("-")[0] + '</label><label class="lblContactNumber"><i class="fa fa-phone "></i> ' + contact.objectName.split("-")[0] + '</label> <label class="lblContactActions"><i data-data="' + contact.objectName + '" data-name="' + contact.description.split('-')[0] + '" onclick="clickChat(this)" class="fa fa-comment iconContact1 iconC"></i><i class="fa fa-circle-o iconOffline"></i></label></div></div>'
    } else {
        return "";
    }

}

function defineRESTurl(url) {
    RESTurl = url;
    getContacts();
    if (contactList != null && typeof contactList != "object") {
        contactList = JSON.parse(contactList);
        showLocalContacts();
    } else {
        contactList = new Array();
    }


}


function getContacts() {
    $.ajax({
        type: "POST",
        url: RESTurl + "auth/getcontactlist",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "text",
        success: function (resp) {

            var object = JSON.parse(resp);
            var trOnline = "";
            var trNoline = "";
            for (var i = 0; i < object.length - 1; i++) {


                if (typeof object[i].status != "undefined" && object[i].status.indexOf("OK") != -1 && object[i].dynamic == true) {
                    trOnline += createTrContactOnline(object[i]);
                } else if (!isNaN(object[i].objectName) && object[i].dynamic == true) {
                    trNoline += createTrOffline(object[i]);
                }
            }

            if (trNoline != "") {
                $("#onlineUsers").html(trOnline);

            } else {
                $("#onlineUsers").html("No users online");

            }

            if (trNoline != "") {
                $("#offlineUsers").html(trNoline);
            } else {
                $("#offlineUsers").html("No users offline");

            }


            $("#btn-add-contact").click(function () {
                var nombre = $("#name").val();
                var numero = $("#phoneNumber").val();
                addContact(nombre, numero);
                $("#addFormulario").hide();
            });

            $(".chatTab").click(function () {

                var dataTab = $(this).attr('data-tab');
                $(".active").removeClass('active');
                $(this).addClass('active');
                if (dataTab == "conversations") {

                    $("#chatsContainer").show();
                    hideLocalChatThings();

                } else {
                    $("#chatsContainer").hide();
                }
            });
        },
        error: function (e) {

        }
    });
}

function addContact(nombre, numero) {

    if (nombre != "" && numero != "") {
        var contacto = new Object();
        contacto.nombre = nombre;
        contacto.numero = numero;
        var esta = false;
        for (var i = 0; i < contactList.length; i++) {
            if (contactList[i].numero == contacto.numero) {
                esta = true;
            }
        }
        if (esta == false) {
            contactList.push(contacto);
            localStorage.setItem('contacts', JSON.stringify(contactList));
            showLocalContacts();
        }
    }
}

function showLocalContacts() {

    if (contactList != null) {
        var tr = "";
        for (var i = 0; i < contactList.length; i++) {
            tr += '<div class="contact">' +
                '<img src="' + rutaImagenDefault() + '" class="imgContacts"/>' +
                '<div class="holderContactLbl">' +
                '<label class="lblContacts">' + contactList[i].nombre + '</label>' +
                '<label class="lblContactNumber">' +
                '<i class="fa fa-phone "></i> ' + contactList[i].numero + '</label>' +
                ' <label class="lblContactActions">' +
                '<i onclick="clickHistorico(' + contactList[i].numero + ')" class="fa fa-phone iconContact iconC"></i>' +
                '<i onclick="deleteLocalContact(' + contactList[i].numero + ')" class="fa fa-times iconC iconDelete"></i>' +
                '</label>' +
                '</div' +
                '></div>'
        }
        $("#ownUsers").html(tr);
    }

}


function deleteLocalContact(numero) {
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].numero == numero) {
            contactList.splice(i, 1);
        }
    }
    showLocalContacts();

}

function rutaImagen(agente) {
    return "https:" + '//' + settings.host + ':' + location.port + '/images/' + agente.replace(/ /g, '') + ".jpg";
}
function rutaImagenDefault() {
    return "https:" + '//' + settings.host + ':' + location.port + '/images/default.jpg';
}


function addChatTr(numero, nombre) {

    $("#chatsContainer").prepend('<div class="contact" onclick="loadContactChat(this)" data-chat="' + numero + '" ><img class="imgChats" src="' + rutaImagen(nombre) + '"><div class="holderContactLbl"><label class="lblContacts">' + nombre + '</label><label class="lblWriting">...</label> <i onclick="deleteChat(this)" class="fa fa-trash deleteChat" style="color: #ff4d5c;"></i></div></div>');


}
var destination = "";
function loadContactChat(esto) {
    destination = $(esto).attr('data-chat');
    var mensajesActual = arrayMensajes[$(esto).attr('data-chat')];
    var nombre = $(esto).children('div').children('.lblContacts').html().trim();

    var tr = "";
    if (mensajesActual != undefined) {
        for (var i = 0; i < mensajesActual.length; i++) {
            if (mensajesActual[i].source == settings.callerid) {
                tr += "<p class='triangle-isosceles right'>" + mensajesActual[i].message + "</p>";

            } else {
                tr += "<p class='triangle-isosceles left'><img src='' class='img-agent'/>" + mensajesActual[i].message + "</p>";
            }
        }
    }
    $("#activeState").hide();
    $("#actualagent>.imgAgent").attr('src', rutaImagen(nombre));
    $("#actualChatAgent").html(nombre);
    $("#chatContainer").html(tr);
    $("#ventanaMensajes").click();
    showLocalChatThings();
}


function recibeChat(remote, mensaje) {
    var remitente = remote.source;
    var agente = remote.sourceagent;
    if ($("#chatsContainer").find("[data-chat='" + remitente + "']").length == 0) {
        addChatTr(remitente, agente);
        addToChatHistory(remote);

    }
    else {
        updateChatHistory(remote);
    }
    loadContactChatFinal();
}

function loadContactChatFinal() {
    var mensajesActual = arrayMensajes[destination];
    var tr = "";
    if (mensajesActual != undefined) {
        for (var i = 0; i < mensajesActual.length; i++) {
            if (mensajesActual[i].source == settings.callerid) {
                tr += "<p class='triangle-isosceles right'>" + mensajesActual[i].message + "</p>";

            } else {
                tr += "<p class='triangle-isosceles left'><img src='' class='img-agent'/>" + mensajesActual[i].message + "</p>";
            }
        }
    }
    $("#chatContainer").html(tr);

    var objDiv = document.getElementById("chatContainer");
    objDiv.scrollTop = objDiv.scrollHeight;
    $("#ventanaMensajes").click();
}

function addToChatHistory(objMensaje) {
    arrayMensajes[objMensaje.source] = new Array();
    arrayMensajes[objMensaje.source].push(objMensaje);
}

function addToChatHistorySend(objMensaje) {
    arrayMensajes[objMensaje.destination] = new Array();
    arrayMensajes[objMensaje.destination].push(objMensaje);
}
function updateChatHistorySend(objMensaje) {
    arrayMensajes[objMensaje.destination].push(objMensaje);
}
function updateChatHistory(objMensaje) {
    arrayMensajes[objMensaje.source].push(objMensaje);
}

function handleTyping(show, source) {
    if ($("#chatsContainer").find("[data-chat='" + source + "']").length == 0) {
    } else {
        if (show) {
            $("#chatsContainer").find("[data-chat='" + source + "']").children('div').children('.lblWriting').html("Typing...");
            if (destination == source) $("#typingdivhide").show()
        } else {
            $("#chatsContainer").find("[data-chat='" + source + "']").children('div').children('.lblWriting').html("");
            if (destination == source) $("#typingdivhide").hide()
        }
    }
}


function clickChat(objeto) {
    console.log(objeto);
    var remitente = $(objeto).attr('data-data');
    var agente = $(objeto).attr('data-name');
    if ($("#chatsContainer").find("[data-chat='" + remitente + "']").length == 0) {
        addChatTr(remitente, agente);
        loadChat(remitente);
    }
    else {
        loadChat(remitente);
    }

}

function showLocalChatThings() {
    $("#chatContainer").show();
    $("#holderInput").show();
    $("#actualagent").show();
}

function hideLocalChatThings() {
    $("#chatContainer").hide();
    $("#holderInput").hide();
    $("#actualagent").hide();
}

function loadChat(remitente) {


    $("[data-tab='chatHolder']").click();
    $("#chatsContainer >.contact").each(function () {
        var contacto = $(this).attr('data-chat');
        if (contacto == remitente) {
            $(this).click();
            return false;
        }

        showLocalChatThings();
    });
}

function goToChatList() {
    var tab = "chatHolder";
    $(".tab").removeClass("activeTab");
    $("#" + tab).addClass("activeTab");
    activeTab = tab;
}
function activeUser(bool) {
    $("#activeState").show();

    if (bool) {
        $("#activeState").removeClass('iconOffline');
        $("#activeState").addClass('iconOnline');
    } else {

        $("#activeState").removeClass('iconOnline');
        $("#activeState").addClass('iconOffline');
    }
}

function deleteChat(esto) {
    $(esto).parent().parent().remove();

    setTimeout(function () {
        $("#chatLIST").click()
    }, 1);
}


function analizeName(name) {
    if (name && name.length > 1) return true;
    else return false;
}
function analizeNumber(tel) {
    var reg = new RegExp("\\+?[0-9]{6,}");
    var res = reg.exec(tel);
    if (res == null) return false;
    if (tel.length < 2) return false;
    if (res[0].length == tel.length) return true;
    else return false;
}

