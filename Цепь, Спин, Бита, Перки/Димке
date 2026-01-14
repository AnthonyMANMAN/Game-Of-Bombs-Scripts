/**
 * Combined Auto Chain + K-Stick + Skin Cycler Script (English + Russian Layout)
 * Auto Chain: Press 'J' (О) to toggle bomb placement automation
 * K-Stick: Press 'L' (Д) to toggle K key blocking
 * Skin Cycler: Press 'H' (Р) to toggle skin cycling
 */

// Global state variables for Auto Chain
let autoChain_active = false;
let autoChain_interval = null;

// Global state variables for K-Stick
let kStuck = false;
let preventKKeyUp = null;

// Global state variables for Skin Cycler
let skinCycler_active = false;
let skinCycler_interval = null;
let skinCycler_currentIndex = 0;
let skinCycler_skinsList = [];
const SKIN_CYCLE_SPEED = 100; // 100ms interval

// Logging function
function logActivity(message) {
    console.log(`[Combined Script] ${message}`);
}

// Key detection functions (English + Russian layout support)
function isKKey(event) {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    
    // English: K key
    if (key === 'k' || code === 'keyk') return true;
    if (event.code === 'KeyK') return true;
    
    // Russian: Л key (same physical key as K)
    if (key === 'л') return true;
    
    return false;
}

function isLKey(event) {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    
    // English: L key
    if (key === 'l' || code === 'keyl') return true;
    if (event.code === 'KeyL') return true;
    
    // Russian: Д key (same physical key as L)
    if (key === 'д') return true;
    
    return false;
}

function isJKey(event) {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    
    // English: J key
    if (key === 'j' || code === 'keyj') return true;
    if (event.code === 'KeyJ') return true;
    
    // Russian: О key (same physical key as J)
    if (key === 'о') return true;
    
    return false;
}

function isHKey(event) {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    
    // English: H key
    if (key === 'h' || code === 'keyh') return true;
    if (event.code === 'KeyH') return true;
    
    // Russian: Р key (same physical key as H)
    if (key === 'р') return true;
    
    return false;
}

// Auto Chain Functions
function autoChain_startSpamming() {
    // Stop any existing interval
    autoChain_stopSpamming();
    
    // Start rapid bomb placement
    autoChain_interval = setInterval(() => {
        if (autoChain_active) {
            // Simulate K keypress (bomb key)
            const keydownEvent = new KeyboardEvent("keydown", { 
                keyCode: 75, 
                key: "k",
                code: "KeyK",
                bubbles: true 
            });
            
            const keyupEvent = new KeyboardEvent("keyup", { 
                keyCode: 75, 
                key: "k",
                code: "KeyK",
                bubbles: true 
            });
            
            // Dispatch events
            document.dispatchEvent(keydownEvent);
            
            // Quick release for rapid fire
            setTimeout(() => {
                document.dispatchEvent(keyupEvent);
            }, 10);
        }
    }, 20); // 50 bombs per second
    
    logActivity("Auto Chain: Bomb spamming started (50/sec)");
}

function autoChain_stopSpamming() {
    if (autoChain_interval) {
        clearInterval(autoChain_interval);
        autoChain_interval = null;
        logActivity("Auto Chain: Bomb spamming stopped");
    }
}

function autoChain_toggle() {
    autoChain_active = !autoChain_active;
    
    if (autoChain_active) {
        logActivity("Auto Chain: ACTIVATED");
        autoChain_startSpamming();
    } else {
        logActivity("Auto Chain: DEACTIVATED");
        autoChain_stopSpamming();
    }
}

// K-Stick Functions
function kStick_toggle() {
    if (!kStuck) {
        preventKKeyUp = function(event) {
            if (isKKey(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        document.addEventListener('keyup', preventKKeyUp, true);
        kStuck = true;
        logActivity("K-Stick: K key BLOCKED");
    } else {
        if (preventKKeyUp) {
            document.removeEventListener('keyup', preventKKeyUp, true);
            preventKKeyUp = null;
        }
        kStuck = false;
        logActivity("K-Stick: K key UNBLOCKED");
    }
}

// Skin Cycler Functions
function skinCycler_initializeSkinsList() {
    const angular = window.angular;
    if (!angular) {
        logActivity("Skin Cycler: Angular not found");
        return false;
    }

    const skinsElement = document.querySelector('[ng-repeat*="skin in group.skins"]');
    if (!skinsElement) {
        logActivity("Skin Cycler: Skins element not found");
        return false;
    }

    const scope = angular.element(skinsElement).scope();
    if (!scope || !scope.$parent) {
        logActivity("Skin Cycler: Could not access scope");
        return false;
    }

    let parentScope = scope.$parent;
    while (parentScope && !parentScope.group) {
        parentScope = parentScope.$parent;
    }

    if (parentScope && parentScope.group && parentScope.group.skins) {
        skinCycler_skinsList = parentScope.group.skins;
        logActivity(`Skin Cycler: Found ${skinCycler_skinsList.length} skins`);
        return true;
    }

    logActivity("Skin Cycler: Could not find skins data");
    return false;
}

function skinCycler_activateSkin(skin) {
    const angular = window.angular;
    if (!angular) return false;

    // Optimized: Cache scope lookup
    const elements = document.querySelectorAll('[ng-click*="activateSkin"]');
    for (let elem of elements) {
        const scope = angular.element(elem).scope();
        if (scope && scope.activateSkin) {
            // Use single $apply call to minimize digest cycles
            scope.$apply(() => {
                if (scope.selectSkin) {
                    scope.selectSkin(skin);
                }
                scope.activateSkin(skin);
            });
            return true;
        }
    }

    // Fallback method
    const skinsElement = document.querySelector('[ng-repeat*="skin in group.skins"]');
    if (skinsElement) {
        const scope = angular.element(skinsElement).scope();
        let parentScope = scope.$parent;
        
        while (parentScope) {
            if (parentScope.activateSkin && parentScope.selectSkin) {
                parentScope.$apply(() => {
                    parentScope.selectSkin(skin);
                    parentScope.activateSkin(skin);
                });
                return true;
            }
            parentScope = parentScope.$parent;
        }
    }
    
    return false;
}

function skinCycler_cycleNext() {
    if (skinCycler_skinsList.length === 0) {
        if (!skinCycler_initializeSkinsList()) {
            logActivity("Skin Cycler: Failed to initialize skins list");
            skinCycler_stop();
            return;
        }
    }

    if (skinCycler_skinsList.length <= 1) {
        logActivity("Skin Cycler: Not enough skins to cycle");
        return;
    }

    skinCycler_currentIndex = skinCycler_currentIndex + 1;
    if (skinCycler_currentIndex >= skinCycler_skinsList.length) {
        skinCycler_currentIndex = 1; // Skip first skin
    }
    
    const skin = skinCycler_skinsList[skinCycler_currentIndex];
    skinCycler_activateSkin(skin);
}

function skinCycler_start() {
    if (skinCycler_active) return;
    
    if (!skinCycler_initializeSkinsList() || skinCycler_skinsList.length === 0) {
        logActivity("Skin Cycler: No skins found! Visit skins page first.");
        return;
    }
    
    skinCycler_active = true;
    logActivity(`Skin Cycler: STARTED (${skinCycler_skinsList.length} skins)`);
    skinCycler_interval = setInterval(skinCycler_cycleNext, SKIN_CYCLE_SPEED);
}

function skinCycler_stop() {
    if (!skinCycler_active) return;
    
    skinCycler_active = false;
    if (skinCycler_interval) {
        clearInterval(skinCycler_interval);
        skinCycler_interval = null;
    }
    logActivity("Skin Cycler: STOPPED");
}

function skinCycler_toggle() {
    if (skinCycler_active) {
        skinCycler_stop();
    } else {
        skinCycler_start();
    }
}

// Combined keyboard event listener
document.addEventListener("keydown", (event) => {
    // Auto Chain toggle - J key (О in Russian)
    if (isJKey(event)) {
        // Only toggle on initial press, ignore repeats
        if (!event.repeat) {
            autoChain_toggle();
        }
        
        // Prevent default if not in input field
        if (document.activeElement.tagName !== "INPUT" && 
            document.activeElement.tagName !== "TEXTAREA" &&
            !document.activeElement.isContentEditable) {
            event.preventDefault();
        }
    }
    
    // K-Stick toggle - L key (Д in Russian)
    if (isLKey(event) && !event.ctrlKey && !event.altKey && !event.metaKey) {
        if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
            event.preventDefault();
            kStick_toggle();
        }
    }
    
    // Skin Cycler toggle - H key (Р in Russian)
    if (isHKey(event) && !event.ctrlKey && !event.altKey && !event.metaKey) {
        if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
            if (!event.repeat) {
                event.preventDefault();
                skinCycler_toggle();
            }
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    autoChain_stopSpamming();
    skinCycler_stop();
    if (preventKKeyUp) {
        document.removeEventListener('keyup', preventKKeyUp, true);
    }
});

// Global functions for manual control
window.toggleAutoChain = function() {
    autoChain_toggle();
    return `Auto Chain is now ${autoChain_active ? 'ON' : 'OFF'}`;
};

window.toggleKStick = function() {
    kStick_toggle();
    return `K-Stick is now ${kStuck ? 'BLOCKED' : 'UNBLOCKED'}`;
};

window.toggleSkinCycler = function() {
    skinCycler_toggle();
    return `Skin Cycler is now ${skinCycler_active ? 'ON' : 'OFF'}`;
};

window.getStatus = function() {
    return {
        autoChain: autoChain_active ? 'ON' : 'OFF',
        kStick: kStuck ? 'BLOCKED' : 'UNBLOCKED',
        skinCycler: skinCycler_active ? 'ON' : 'OFF'
    };
};

// Success message
console.log('✅ Combined Script loaded successfully!');
console.log('📋 Controls (English/Russian):');
console.log('   • Press J (О) to toggle Auto Chain (bomb spamming)');
console.log('   • Press L (Д) to toggle K-Stick (K/Л key blocking)');
console.log('   • Press H (Р) to toggle Skin Cycler');
console.log('🔧 Manual functions: toggleAutoChain(), toggleKStick(), toggleSkinCycler(), getStatus()');
console.log('⚠️  Skin Cycler: Visit skins page once before using!');
