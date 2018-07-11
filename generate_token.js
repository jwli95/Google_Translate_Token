var got = require('got');
var Configstore = require('configstore');
var config = new Configstore('google-translate-api');

var window = {
    TKK: config.get('TKK') || '0'
};
var er = null;


var cr = function (a) {
    return function () {
        return a;
    }
};

var dr = function (a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
};

var fr = function (a) {
    var b;
    if (null !== er)
        b = er;
    else{
        b = cr(String.fromCharCode(84));
        var c = cr(String.fromCharCode(75));
        b = [b(), b()];
        b[1] = c(); // b = ['T', 'K']
        b = (er = window[b.join(c())] || "") || "";
    }

    var d = cr(String.fromCharCode(116))
        , c = cr(String.fromCharCode(107))
        , d = [d(), d()];
    d[1] = c(); // d = ['t', 'k']
    c = "&" + d.join("") + "="; // c = "&tk="
    d = b.split("."); // d = ["TTK"]
    b = Number(d[0]) || 0;
    //

    a = "hello"; //a is the string to translated
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        //console.log(l);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }

    a = b;
    for (f = 0; f < e.length; f++) {
        a += e[f];
        a = dr(a, "+-a^+6");
    }

    a = dr(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    var res = c + (a.toString() + "." + (a ^ b));

    console.log(res);
};

function updateTKK() {
    return new Promise(function (resolve, reject) {
        var now = Math.floor(Date.now() / 3600000);

        if (Number(window.TKK.split('.')[0]) === now) {
            resolve();
        } else {
            got('https://translate.google.cn').then(function (res) {
                var code = res.body.match(/TKK=(.*?)\(\)\)'\);/g);
                console.log(res);
                if (code) {
                    eval(code[0]);
                    /* eslint-disable no-undef */
                    if (typeof TKK !== 'undefined') {
                        window.TKK = TKK;
                        config.set('TKK', TKK);
                    }
                    /* eslint-enable no-undef */
                }
                resolve();
            }).catch(function (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                e.message = err.message;
                reject(e);
            });
        }
    });
}

updateTKK();
fr("hello")

