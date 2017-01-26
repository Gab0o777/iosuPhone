//# sourceURL=phone.js


var ua = null;
var line1 = null;
var remoteView = document.getElementById('remoteview');
var selfView = document.getElementById('selfview');
var stun = "stun:stun.ucontactcloud.com";
var voice = "{ mandatory : { googEchoCancellation: true, googEchoCancellation2: true, googAutoGainControl: true, googNoiseSuppression: true, googHighpassFilter: true, googTypingNoiseDetection: true } }";
var video = false;
var lastvideovalue = false;
var videoenable = true;

var notification = '';
var notiCancel = false;
var redial = '';

var CDR = {};
CDR.calleridnum = '';
CDR.calleridname = '';
CDR.starttime = '';
CDR.date = null;
CDR.inbound = '';
CDR.duration = '';


var closedPhone = false;


var cronoPrincipal = new Cronometro([$("#timeinfo"),$("#cronfullscreen")]);

var historical = JSON.parse(localStorage.getItem("historical"));
if (historical === null) {
  historical = [];
} else {
    fillHistorical();
}

if(settings !== null) {
  startUA();
}


$("#btn_video").click(function () {

    if (videoenable) {
        if (line1 === null) {
            video = !video;
            lastvideovalue = video;
            changevideobutton();
        }
    }
});


function changevideobutton() {
     if (video) {
         $(".colvideo").addClass('activePhoneIcon');
    } else {
         $(".colvideo").removeClass('activePhoneIcon');
    }
}


function conferencia(num) {
    if (line1 !== null) {
        blindTransfer(num);
    } else {
        makeCall(num);
    }
}


$("#btn_conf").click(function () {
    if ($("#btn_conf_content").css("display") == "none") {
        $("#btn_conf_content").show();
    } else {
        $("#btn_conf_content").hide();
    }
});


$("#inputconf").keypress(function (e) {
    if (e.which == 13) {
        var val = $(this).val();
        conferencia("555" + val);
        $("#btn_conf_content").hide();
        $("#inputconf").val("");
    }
});


$('#reject_call').bind('click', hangUp);
$("#hangupfullscreen").bind('click', function () {
    $("#videoContainer").fullScreen(false);
    hangUp();
});
$('#place_call').bind('click', callHandler);

$('#answerButton').click(function () {
    answer();
});
$('#hangUpButton').click(function () {
    hangUp();
});

$('#btn_atransfer').click(function () {
    attendedTransfer("");
});
$('#btn_btransfer').click(function () {
    blindTransfer("");
});


var isInMute = false;
$('#btn_mute').click(function () {
    if (line1 !== null) {
        toggleMute(isInMute);
    }
});

$("#btnmutefullscreen").click(function () {
    if (line1 !== null) {
        toggleMute(isInMute);
    }
});


var isInHold = false;
$('#btn_hold').click(function () {
    if (line1 !== null) {
        toggleHold(isInHold);
    }
});

 $(".focusCall").click(function () {
     $("#output").focus();
 });

$('.digits').mousedown(function (e) {
    digit = e.currentTarget.childNodes[0].data;
    SendDTMF(digit);
    $('#output').val($('#output').val() + digit);
});

$('.digits').mouseup(function (e) {
    StopDTMF();
});

$('#output').keypress(function (e) {

     switch (e.which) {
        case 13:
            var hasEnter = $("#output").val();
            hasEnter = hasEnter.replace(/(\r\n|\n|\r)/gm, "");

            hasEnter = hasEnter.replace(/ /g, '').trim();
            hasEnter = hasEnter.replace(/\s+/g, "");
            $("#output").val(hasEnter);
            callHandler();
            break;
    }

    switch (String.fromCharCode(e.which)) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '*':
        case '#':
        case '+':
            SendDTMF(String.fromCharCode(e.which));
            break;
        default: return false;
    }


});

$('#output').keyup(function (e) {
    StopDTMF();
});


function startUA() {
    var configuration = {
        'ws_servers': 'wss://' + settings.host + ':8089/ws',
        'uri': 'sip:' + settings.callerid + '@' + settings.host,
        'password': settings.password,
        'session_timers': false,
        'realm': 'asterisk'
    };
    var defineUrl = "https:" + '//' + settings.host + ':' + location.port + '/Integra/resources/';

    if (settings.theme) {
        $("html").addClass('dark');
        $("#logo").attr('src', 'images/logo.svg');
    } else {
        $("html").removeClass('dark');
        $("#logo").attr('src', 'images/logoblack.svg');

    }

    defineRESTurl(defineUrl);
    ua = new JsSIP.UA(configuration);
    ua.start();
    attachUAEventHandlers();

}

function attachUAEventHandlers() {


    ua.on('registered', function (data) {
        $('#phonestatus').html('Registered...');
    });
    ua.on('connecting', function (data) {
        $('#phonestatus').html('Connecting...');
    });
    ua.on('connected', function (data) {
        $('#phonestatus').html('Connected...');
    });
    ua.on('disconnected', function (data) {
        console.log('Disconnected...'); //dont show
    });
    ua.on('unregistered', function (data) {
        $('#phonestatus').html('Unregistered...');
    });
    ua.on('registrationFailed', function (data) {
        $('#phonestatus').html('Registration Failed...');
    });
    ua.on('newRTCSession', function (data) {

 if (line1 === null) {
        CDR.starttime = new Date();

        if (data.originator == 'remote') {

                line1 = data.session;
                lastvideovalue = video;
                var aux = eval(data.request.getHeader('VIDEO'));
                if (typeof aux != 'undefined')
                    video = aux;
                else
                    video = false;
                changevideobutton();
                CDR.calleridnum = data.session.remote_identity.toString().substring(data.session.remote_identity.toString().indexOf(':') + 1, data.session.remote_identity.toString().indexOf("@"));
                CDR.calleridname = data.request.from.display_name;
                CDR.inbound = true;

                $('#phonestatus').html('Starting...');
                $('#inoutcall').html('<i class="fa fa-arrow-down"></i>');
                $('#callerinfo').html(CDR.calleridname);
                $('#output').val(CDR.calleridnum);
                StartRing();

                notifOutOfTheBrowser(CDR.calleridname, CDR.calleridnum);

                var aa = data.request.getHeader('P-Auto-Answer');
                if (typeof aa != 'undefined' && aa.indexOf('normal') != -1) {
                        answer();
                }


        } else {
            CDR.inbound = false;
            line1 = data.session;
            $('#phonestatus').html('Starting...');
            $('#inoutcall').html('<i class="fa fa-arrow-up"></i>');

        }
         attachCallEventHandlers();

    } else {
                data.session.terminate();
    }


    });
    ua.on('newMessage', function (data) {

        if (data.originator == "remote") {
            var remote = parseRemoteString(data.message.remote_identity.toString());
            var mensaje = JSON.parse(data.message.content);

            if (typeof mensaje.status != "undefined" && mensaje.status == "OFFLINE") {
                activeUser(false);
                return false;
            }
            else if (mensaje.type == "ChatMessageTyping") {
                if (mensaje.message == "typing") {
                    handleTyping(true, mensaje.source);
                } else {
                    handleTyping(false, mensaje.source);
                }
                activeUser(true);
            } else {
                activeUser(true);
                createNotification(mensaje.sourceagent, mensaje.message, "mensaje");

                recibeChat(mensaje, remote);

            }
        }

    });

}

function parseRemoteString(remote) {
    var start = remote.indexOf("<");
    var end = remote.indexOf(">");

    var adress = remote.substring(start + 1, end);
    start = adress.indexOf(":");
    end = adress.indexOf("@");

    var number = adress.substring(start + 1, end);
    return number;
}

function attachCallEventHandlers() {

    line1.on('peerconnection', function (data) {
        $('#phonestatus').html('Peerconnection...');
    });

    line1.on('connecting', function (data) {
        $('#phonestatus').html('Connecting...');
    });

    line1.on('sending', function (data) {
        $('#phonestatus').html('Sending...');
    });

    line1.on('progress', function (data) {

        $('#phonestatus').html('Ringing...');
        StartRing();
    });

    line1.on('accepted', function (data) {
        $('#phonestatus').html('Accepted...');
    });

    line1.on('confirmed', function (data) {
        selfView.src = window.URL.createObjectURL(line1.connection.getLocalStreams()[0]);
        $('#phonestatus').html('Confirmed...');
    });

    line1.on('ended', function (data) {

        finishcall('Ended - ' + data.cause);

    });

    line1.on('failed', function (data) {

        finishcall('Failed - ' + data.cause);

        if (!ua.isRegistered()) {
            if (data.message.reason_phrase !== null) {
                if (typeof data.message.reason_phrase != 'undefined') {
                    if (data.message.reason_phrase == "Forbidden") {
                            ua.stop();
                            startUA();
                    }
                }
            }

        }

    });

    line1.on('addstream', function (data) {
        remoteView.src = window.URL.createObjectURL(data.stream);
    });

    line1.on('removestream', function (data) {
        console.log('Removestream...');
    });

    line1.on('newDTMF', function (data) {
        console.log('NewDTMF...');
    });

    line1.on('hold', function (data) {
        $('#phonestatus').html('Hold...');
    });

    line1.on('unhold', function (data) {
        $('#phonestatus').html('Unhold...');
    });

    line1.on('muted', function (data) {
        $('#phonestatus').html('Muted...');
    });

    line1.on('unmuted', function (data) {
        $('#phonestatus').html('Unmuted...');
    });

    line1.on('reinvite', function (data) {
        console.log('Reinvite...');
    });

    line1.on('update', function (data) {
        console.log('Update...');
    });

    line1.on('refer', function (data) {
        console.log('Refer...');
    });

    line1.on('replaces', function (data) {
        console.log('Replaces...');
    });

    line1.on('iceconnectionstatechange', function (data) {
        if (data.state == 'connected') {
            startCall();
        }
    });

    line1.on('sdp', function (data) {

        //FIX FOR ISSUE ASTERISK
        if (!video) {
            indx = data.sdp.indexOf('m=video');
            if (indx > 0) {
                data.sdp = data.sdp.substring(0,indx-1) + "r\n";
            }
        }
    });


}

function makeCall(destination) {

    if (line1 === null) {

        var options = {
            'mediaConstraints': {'audio': voice, 'video': video},
            'extraHeaders': ['VIDEO : ' + video],
            'pcConfig': {
                'iceServers': [{'urls': [stun]}]
            }

        };

        CDR.calleridnum = destination;
        CDR.calleridname = '';
        redial = destination;
        ua.call('sip:' + destination + '@' + settings.host, options);

    }

}

function answer() {

    notiCancel = true;
     if (line1 !== null && line1.direction != 'outgoing') {
        var options = {
            'mediaConstraints': {'audio': voice, 'video': video},
            'pcConfig': {
                'iceServers': [{'urls': [stun]}]
            }
        };

        line1.answer(options);
    }

}

function hangUp() {

    if (line1 === null) {
        $('#output').val('');
        if (ua.isRegistered())
            $('#phonestatus').html('Registered...');
        else
            $('#phonestatus').html('Not Registered...');
    }
    $("#callerinfo").html("");
    ua.terminateSessions();
    line1 = null;

}

function SendDTMF(dtmfval) {

    PlayDTMF(dtmfval);

    if (line1 !== null) {
        if (line1.status != 2) {
            line1.sendDTMF(dtmfval);
        }

    }

}

function blindTransfer(destination) {

    if (line1 !== null) {
        if (destination === "") {
            line1.sendDTMF('##');
        }
        else {
            line1.sendDTMF('##' + destination);
        }
    }
}

function attendedTransfer(destination) {

    if (line1 !== null) {
        if (destination === "") {
            line1.sendDTMF('#0');
        } else {
            line1.sendDTMF('#0' + destination);
        }
    }

}

function hold() {

    if (line1 !== null) {
        line1.hold();
    }
}

function unhold() {

    if (line1 !== null) {
        line1.unhold();
    }
}

function mute() {

    if (line1 !== null) {
        line1.mute();
    }
}

function unmute() {

    if (line1 !== null) {
        line1.unmute();
    }
}

function SendMessage(destination, message) {

    ua.sendMessage('sip:' + destination + '@' + settings.host, message);

}


function emptyVideo() {
    remoteView.src = "";
    selfView.src = "";
}


function notifOutOfTheBrowser(title, body) {

    if (Notification.permission === "granted") {
        createNotification(title, body);
    } else {
        Notification.requestPermission(function (permission) {
            createNotification(title, body);
        });
    }
}
function createNotification(title, body, click) {
    var path = 'images/phoneicon.png';

    if (video) {
        path = 'images/videoicon.png';
    }
    var options = {
        dir: 'ltr',
        body: body,
        icon: path
    };

    notification = new Notification(title, options);

    if (typeof click == "undefined") {
        notification.onclick = function () {
            answer();
            notiCancel = true;
            notification.close();
        };

        notification.onclose = function () {
            if (!notiCancel) {
                hangUp();
            }
            notiCancel = false;
            notification = '';

        };
    } else {
        notification.onclick = function () {
            goToChatList();
            notiCancel = true;
            notification.close();
        };

        notification.onclose = function () {

            notiCancel = false;
            notification = '';

        };
    }

}


function finishcall(status) {

    video = lastvideovalue;
    changevideobutton();

    emptyVideo();
    StopRing();
    toggleHold(true);
    toggleMute(true);
    if (notification !== '')
        notification.close();
    $('#inoutcall').empty();
    $('#phonestatus').html(status);
    line1 = null;

    PlayHangup();
    if (CDR.date !== null)
        CDR.duration = Math.round(((new Date()) - CDR.date) / 1000);
    else
        CDR.duration = 0;

     historical.push(clone(CDR));
     addHistorical(CDR);
      if (historical.length > 100) {
           historical.shift();
      }
     localStorage.setItem("historical", JSON.stringify(historical));
     CDR.date = null;

    $("#videoContainer").slideUp();

     cronoPrincipal.stop();

     $("#timeinfo").html("");



}
function startCall() {

    StopRing();

    if (notification !== '')
        notification.close();
    $('#phonestatus').html('Speaking...');
    CDR.date = new Date();
    if (video) {
          $("#videoContainer").slideDown();
    }

     cronoPrincipal.start();

}
function callHandler() {

    if (line1 === null) {

        if ($('#output').val() === '') {
            $('#output').val(redial);
            return;
        }
        var num = $('#output').val().replace(/ /g, '');
        makeCall(num);

    } else {

        answer();
    }

}


function toggleMute(muted) {

    if (!muted) {
        mute();
        $(".colmute").addClass('activePhoneIcon');
        isInMute = true;

    } else {
        unmute();
        $(".colmute").removeClass('activePhoneIcon');
        isInMute = false;
    }
}
function toggleHold(holded) {
    if (!holded) {
        hold();
        $(".colhold").addClass('activePhoneIcon');
        isInHold = true;

    } else {
        unhold();
        $(".colhold").removeClass('activePhoneIcon');
        isInHold = false;
    }
}

function __isInCall() {
   return line1 !== null;
}
function __unregister() {
    if (ua !== null) ua.stop();
}

function __register() {
    __unregister();
    startUA();
}

function __hangUp() {
    if (ua !== null) ua.terminateSessions();
}


//Sounds
var context = new AudioContext();
var ringbackTone = new Tone(context, 440, 480);
var dtmf = new Tone(context, 350, 440);
var dtmfFrequencies = {
    "1": {f1: 697, f2: 1209},
    "2": {f1: 697, f2: 1336},
    "3": {f1: 697, f2: 1477},
    "4": {f1: 770, f2: 1209},
    "5": {f1: 770, f2: 1336},
    "6": {f1: 770, f2: 1477},
    "7": {f1: 852, f2: 1209},
    "8": {f1: 852, f2: 1336},
    "9": {f1: 852, f2: 1477},
    "*": {f1: 941, f2: 1209},
    "0": {f1: 941, f2: 1336},
    "#": {f1: 941, f2: 1477},
    "+": {f1: 941, f2: 1477}
};

Tone.prototype.setup = function () {
    this.osc1 = context.createOscillator();
    this.osc2 = context.createOscillator();
    this.osc1.frequency.value = this.freq1;
    this.osc2.frequency.value = this.freq2;

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.25;

    this.filter = this.context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency = 8000;

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.filter);
    this.filter.connect(context.destination);
};

Tone.prototype.start = function () {
    this.setup();
    this.osc1.start(0);
    this.osc2.start(0);
    this.status = 1;
};

Tone.prototype.stop = function () {
    this.osc1.stop(0);
    this.osc2.stop(0);
    this.status = 0;
};

Tone.prototype.createRingerLFO = function () {
    // Create an empty 3 second mono buffer at the
    // sample rate of the AudioContext
    var channels = 1;
    var sampleRate = this.context.sampleRate;
    var frameCount = sampleRate * 6;
    var arrayBuffer = this.context.createBuffer(channels, frameCount, sampleRate);

    // getChannelData allows us to access and edit the buffer data and change.
    var bufferData = arrayBuffer.getChannelData(0);
    for (var i = 0; i < frameCount; i++) {
        // if the sample lies between 0 and 0.4 seconds, or 0.6 and 1 second, we want it to be on.
        //if ((i/sampleRate > 0 && i/sampleRate < 0.4) || (i/sampleRate > 0.6 && i/sampleRate < 1.0)){
        if ((i / sampleRate > 0 && i / sampleRate < 2)) {
            bufferData[i] = 0.25;
        }
    }

    this.ringerLFOBuffer = arrayBuffer;
};

Tone.prototype.startRinging = function () {
    this.start();
    // set our gain node to 0, because the LFO is calibrated to this level
    this.gainNode.gain.value = 0;
    this.status = 1;

    this.createRingerLFO();

    this.ringerLFOSource = this.context.createBufferSource();
    this.ringerLFOSource.buffer = this.ringerLFOBuffer;
    this.ringerLFOSource.loop = true;
    // connect the ringerLFOSource to the gain Node audio param
    this.ringerLFOSource.connect(this.gainNode.gain);
    this.ringerLFOSource.start(0);
};

Tone.prototype.stopRinging = function () {
    this.stop();
    this.ringerLFOSource.stop(0);
};

function Tone(context, freq1, freq2) {
    this.context = context;
    this.status = 0;
    this.freq1 = freq1;
    this.freq2 = freq2;
}

function StartRing() {

    if (ringbackTone.status === 0)
        ringbackTone.startRinging();

}

function StopRing() {

    if (ringbackTone.status == 1)
        ringbackTone.stopRinging();

}

function PlayHangup() {
    var osc = context.createOscillator();
    var amp = context.createGain();

    osc.connect(amp);
    amp.connect(context.destination);
    amp.gain.value = 0.2;

    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.1);

    osc = context.createOscillator();
    amp = context.createGain();

    osc.connect(amp);
    amp.connect(context.destination);
    amp.gain.value = 0.2;

    osc.start(context.currentTime + 0.5);
    osc.stop(context.currentTime + 0.6);


}

function PlayAnswer() {
    var osc = context.createOscillator();
    var amp = context.createGain();

    osc.connect(amp);
    amp.connect(context.destination);
    amp.gain.value = 0.2;

    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.3);

}

function PlayDTMF(keyPressed) {

    var frequencyPair = dtmfFrequencies[keyPressed];

    dtmf.freq1 = frequencyPair.f1;
    dtmf.freq2 = frequencyPair.f2;

    if (dtmf.status === 0) {
        dtmf.start();
    }

}

function StopDTMF() {

    if (typeof dtmf !== "undefined" && dtmf.status) {
        dtmf.stop();
    }
}

function clone(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

window.onbeforeunload = function (e) {
    
    ua.terminateSessions();
    __unregister();
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var keycode = String.fromCharCode(evt.keyCode);

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        if (keycode == '#' || keycode == "*" || keycode == '+') {
            return true

        } else {
            return false;
        }

    }

    return true;
}
