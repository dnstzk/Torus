(function() {

    var animation = undefined;
    var PI = Math.PI;
    var frame = 0;
    var totalFrames = 400;

    var cos = function(x) {
        return Math.cos(x);
    };

    var sin = function(x) {
        return Math.sin(x);
    };

    var addVectors = function(u, v) {
        return [
            u[0] + v[0],
            u[1] + v[1],
            u[2] + v[2]
        ];
    };

    var scaleVector = function(scalar, vector) {
        return [
            scalar*vector[0],
            scalar*vector[1],
            scalar*vector[2]
        ];
    };

    var rotateVectorAroundXAxis = function(point, Beta) {
        return [
            point[0],
            cos(Beta)*point[1] - sin(Beta)*point[2],
            sin(Beta)*point[1] + cos(Beta)*point[2]
        ];
    };

    var rotateVectorAroundYAxis = function(point, Gamma) {
        return [
            cos(Gamma)*point[0] - sin(Gamma)*point[2],
            point[1],
            sin(Gamma)*point[0] + cos(Gamma)*point[2]
        ];
    };

    var rotateVectorAroundZAxis = function(point, Angle) {
        return [
            cos(Angle)*point[0] - sin(Angle)*point[1],
            sin(Angle)*point[0] + cos(Angle)*point[1],
            point[2]
        ];
    };

    var scaleSet = function(scalar, set) {
        var scaledSet = [];
        for (vector in set) {
            var scaledVector = scaleVector(scalar, set[vector]);
            scaledSet.push(scaledVector);
        }
        return scaledSet;
    };

    var rotateSetAroundXAxis = function(set, angle) {
        var rotatedSet = [];
        for(let vector of set) {
            var rotatedVector = rotateVectorAroundXAxis(vector, angle);
            rotatedSet.push(rotatedVector);
        }
        return rotatedSet;
    };

    var rotateSetAroundYAxis = function(set, angle) {
        var rotatedSet = [];
        for(vector in set) {
            var rotatedVector = rotateVectorAroundYAxis(set[vector], angle);
            rotatedSet.push(rotatedVector);
        }
        return rotatedSet;
    };

    var rotateSetAroundZAxis = function(set, angle) {
        var rotatedSet = [];
        for(vector in set) {
            var rotatedVector = rotateVectorAroundZAxis(set[vector], angle);
            rotatedSet.push(rotatedVector);
        }
        return rotatedSet;
    };

    var getCycle = function() {
        var cycle = [];
        var lastVectorID = 100;
        for (vectorID=0; vectorID<lastVectorID; vectorID++) {
            var angle = (2*PI)*(vectorID/lastVectorID);
            var point = [cos(angle), 0, sin(angle)];
            point = scaleVector(4, point);
            point = addVectors(point, [15, 0, 0]);
            cycle.push(point);
        }
        return cycle;
    };

    var getTorus = function() {
        var torus = [];
        var lastCycleID = 100;
        for (cycleID=0; cycleID < lastCycleID; cycleID++) {
            var cycle = getCycle();
            var rotationAngle = (2*PI)*(cycleID/lastCycleID);
            var rotatedCycle = rotateSetAroundZAxis(cycle, rotationAngle);
            torus = torus.concat(rotatedCycle);
        }
        return torus;
    };

    var clearScreen = function() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = 1920;
        ctx.canvas.height = 1920;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);
    }

    var drawVector = function(point) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        var x = point[0];
        var y = point[1];
        ctx.fillStyle = 'cyan';
        ctx.fillRect(x+(w/2), y+(h/2), 2, 2);
    };

    var drawSet = function(set) {
        for (point in set) {
            drawVector(set[point], 0);
        }
    };

    var canvasframe = function() {
        clearScreen();
        var torus = getTorus();
        var rotateAngle = (2*PI)*(frame/totalFrames);
        torus = rotateSetAroundYAxis(torus, rotateAngle);
        var torus2 = scaleSet(40, torus);
        drawSet(torus2);

        frame = (frame + 1)%totalFrames;
    };

    window.present = function() {
        if (animation == undefined) {
            animation = setInterval(canvasframe, 30);
        } else {
            clearInterval(animation);
            animation = undefined;
        }
    };

})();

present();
