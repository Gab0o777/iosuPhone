//# sourceURL=cronometro.js
class Cronometro {

    constructor(obj) {
        this.obj = obj;
        this.time = 0;
        this.interval = undefined;
    }

   
    actualizar() {
        for (var i = 0; i < this.obj.length; i++) {
            this.obj[i].html(this.parseTime());
        }
    }


    parseTime() {

        var str = this.time + "";
        return str.toHHMMSS();
    }

    start() {
        this.actualizar();
        var crono = this;
        this.interval = setInterval(function () {
            crono.time += 1;
            crono.actualizar();
        }, 1000);
    }

    stop() {
        this.pause();
        this.reset();
    }

    pause() {
        clearInterval(this.interval);
    }

    reset() {
        clearInterval(this.interval);
        this.time = 0;
        this.actualizar();
    }

    restart() {
        this.reset();
        this.start();
    }

}