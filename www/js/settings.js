//# sourceURL=settings.js

var settings = JSON.parse(localStorage.getItem("settings"));

if (settings !== null) {
  $('#Sserver').val(settings.host);
  $('#Scallerid').val(settings.callerid );
  $('#SPassword').val(settings.password);
  $("#Sdark").attr('checked', settings.theme);
}


$("#saveSettings").click(function () {
    var val;
    var obj = JSON.parse(localStorage.getItem('settings'));
    if (obj && obj.theme) {
        val = true;
    } else {
        val = false;
    }
   settings = {};
   settings.host = $('#Sserver').val();
   settings.callerid = $('#Scallerid').val();
   settings.password = $('#SPassword').val();
    settings.theme = val;
   localStorage.setItem("settings", JSON.stringify(settings));

    console.log(settings.theme);
   if (ua !== null) {
     ua.stop();
   }
   startUA();

});

$('#Sdark').change(function () {

    var val = $(this).is(':checked');
    var obj;
    if (localStorage.getItem('settings')) {
        obj = JSON.parse(localStorage.getItem('settings'));
    } else {
        obj = {};
    }

    obj.theme = val;
    localStorage.setItem('settings', JSON.stringify(obj));

    if (val) {
        $("html").addClass('dark');
        $("#logo").attr('src', 'images/logo.svg');
    } else {
        $("html").removeClass('dark');
        $("#logo").attr('src', 'images/logoblack.svg');

    }
});
