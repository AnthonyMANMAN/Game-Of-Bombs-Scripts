// ==UserScript==
// @name         Ф-Stick for Game of Bombs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press Й to toggle Ф key blocking on Game of Bombs
// @author       You
// @match        *://gameofbombs.com/*
// @match        *://*.gameofbombs.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let fStuck = false;
    let preventFKeyUp = null;

    function logActivity(message) {
        console.log(`[Ф-Stick] ${message}`);
    }

    function isFKey(event) {
        return (
            event.key === 'ф' ||
            event.key === 'Ф' ||
            event.code === 'KeyA'
        );
    }

    function isYKey(event) {
        return (
            event.key === 'й' ||
            event.key === 'Й' ||
            event.code === 'KeyQ'
        );
    }

    function fStick_toggle() {
        if (!fStuck) {
            preventFKeyUp = function (event) {
                if (isFKey(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            };

            document.addEventListener('keyup', preventFKeyUp, true);

            fStuck = true;
            logActivity('Ф key BLOCKED');
        } else {
            if (preventFKeyUp) {
                document.removeEventListener('keyup', preventFKeyUp, true);
                preventFKeyUp = null;
            }

            fStuck = false;
            logActivity('Ф key UNBLOCKED');
        }
    }

    document.addEventListener(
        'keydown',
        function (event) {
            if (
                isYKey(event) &&
                !event.ctrlKey &&
                !event.altKey &&
                !event.metaKey
            ) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                fStick_toggle();
            }
        },
        true
    );

    window.addEventListener('beforeunload', () => {
        if (preventFKeyUp) {
            document.removeEventListener('keyup', preventFKeyUp, true);
        }
    });

    window.toggleFStick = function () {
        fStick_toggle();
        return `Ф-Stick is now ${fStuck ? 'BLOCKED' : 'UNBLOCKED'}`;
    };

    console.log('✅ Ф-Stick loaded on Game of Bombs');
})();
