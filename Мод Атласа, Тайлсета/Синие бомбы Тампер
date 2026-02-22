// ==UserScript==
// @name         GOB Atlas Swap
// @match        *://gameofbombs.com/*
// @run-at       document-start
// @description    idk
// @version       0.1
// ==/UserScript==




var replacement2 = "https://raw.githubusercontent.com/AnthonyMANMAN/Scripts/refs/heads/main/atlas7.png";

var desc2 = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(val2) {
        if (val2 && val2.includes("atlas")) {
            desc2.set.call(this, replacement2);
        } else {
            desc2.set.call(this, val2);
        }
    },
    get: function() {
        return desc2.get.call(this);
    }
});
