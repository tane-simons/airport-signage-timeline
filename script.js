'use strict'

var slides = [
    { title: "1930s Bespoke Systems", image: "imgs/1930.png" },
    { title: "1950s Intl Type Style", image: "imgs/1950.png" },
    { title: "1960s Split-Flap Displays", image: "imgs/1960.png" },
    { title: "1967 Schiphol Standard", image: "imgs/1967.png" },
    { title: "1974 AIGA/DOT Pictograms", image: "imgs/1974.png" },
    { title: "1994 Digital Info Displays", image: "imgs/1994.png" },
    { title: "2022 Parallel Reality", image: "imgs/2022.gif" },
    { title: "2030+ Augmented Reality", image: "imgs/2030.png" }
];

var currentIndex = 0;
var display;
var flapSound = new Audio('audio/click.mp3');

var CTR = CTR || {};
CTR.SOLARIVALUES = { 
    letter: " ,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,+,/".split(",") 
};

CTR.SolariSegment = function(b) {
    var l = 1.1 + 0.03 * Math.random(),
        a = 0,
        f = 0,
        h = 0,
        d = b.values,
        e = Date.now(),
        g, k, i, j, m;

    g = document.createElement("li");
    g.className = "segment";
    g.style.width = b.width + "vw";
    g.style.height = b.height + "px";

    k = document.createElement("div");
    k.className = "front";
    k.style.lineHeight = b.height + "px";

    i = document.createElement("div");
    i.className = "flip-front";
    i.style.transformOrigin = "0 " + 0.5 * b.height + "px";

    j = document.createElement("div");
    j.className = "flip-back";
    j.style.lineHeight = b.height + "px";
    j.style.transformOrigin = "0 " + 0.5 * b.height + "px";

    m = document.createElement("div");
    m.className = "back";

    g.appendChild(k);
    g.appendChild(i);
    g.appendChild(j);
    g.appendChild(m);

    return {
        getElement: function() { return g },
        setContent: function(a) {
            for (var b = 0; b < d.length; b++) if (d[b] == a) { h = b; return }
            h = 0
        },
        update: function() {
            if (f != h) {
                var c = Date.now();
                a += l * (c - e);
                e = c;
                if (a >= 180) {
                    m.textContent = d[f];
                    j.textContent = d[f];
                    f++;
                    f %= d.length;
                    k.textContent = d[f];
                    i.textContent = d[f];
                    a %= 180;
                }
            } else {
                var c = Date.now();
                a += l * (c - e);
                e = c;
                if (a >= 180) a = 180;
                k.textContent = d[f];
                i.textContent = d[f];
            }
            c = Math.abs(32 + 16 * Math.sin(a * Math.PI / 180)) | 0;
            i.style.transform = "rotateX(" + (180 - a) + "deg) translateY(" + 0.5 * b.height + "px) translateZ(.1px)";
            i.style.backgroundColor = "#111";
            c = 170 - 170 * a / 180 | 0;
            j.style.transform = "rotateX(-" + a + "deg)";
            j.style.color = "rgb(" + c + "," + c + "," + c + ")";
            c = 170 * a / 180 | 0;
            i.style.color = "#ccc";
            c = Math.abs(32 - 16 * Math.sin(a * Math.PI / 180)) | 0;
            j.style.backgroundColor = "rgb(" + c + "," + c + "," + c + ")";
        }
    }
};

CTR.SolariBoard = function(b) {
    function l() {
        window.requestAnimationFrame(l);
        for (var a = 0; a < h.length; a++) h[a].update();
    }

    var a = document.createElement("div"),
        f = document.createElement("ul"),
        h = [];

    a.className = "display";
    f.className = "segments";
    a.style.fontSize = b.fontSize + "px";

    for (var e = 0; e < b.format.length; e++) {
        var g = b.format[e],
            seg = new CTR.SolariSegment({
                width: b.segmentWidth,
                height: b.segmentHeight,
                values: g
            });
        h.push(seg);
        f.appendChild(seg.getElement());
    }

    a.appendChild(f);
    b.container.appendChild(a);
    l();

    return {
        getDisplay: function() { return f },
        setContent: function(text) {
            var arr = text.toUpperCase().split('');
            for (var e = 0; e < b.format.length; e++)
                h[e].setContent(arr[e] || ' ');
        }
    }
};

// Update both flap text + image
function updateSlide(index) {
    var img = document.getElementById('image');
    img.classList.add('fade-out');
    setTimeout(() => {
        display.setContent(slides[index].title);
        img.src = slides[index].image;
        img.alt = slides[index].title;
        img.classList.remove('fade-out');
    }, 400);
}

// Initialize board
window.addEventListener('load', function() {
    var formatArray = [];
    var numFlaps = 25;

    for (let i = 0; i < numFlaps; i++)
        formatArray.push(CTR.SOLARIVALUES.letter);

    display = new CTR.SolariBoard({
        container: document.getElementById('container'),
        format: formatArray,
        segmentWidth: 3.5,
        segmentHeight: 54,
        fontSize: 40
    });

    updateSlide(currentIndex); // Load first title + image
});

// Navigation buttons
document.getElementById('next').addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
});

document.getElementById('prev').addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
});