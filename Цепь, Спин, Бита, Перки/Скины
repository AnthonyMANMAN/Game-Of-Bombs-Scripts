// Lightweight Skin Cycler - Optimized for performance
// Paste this into your browser console while on the game page

(function() {
    let cycling = false;
    let intervalId = null;
    let currentIndex = 0;
    let cycleSpeed = 100;
    let skinsList = [];
    let selectedIndices = new Set();

    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'skinCycler';
        ui.innerHTML = `
            <style>
                #skinCycler {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.85);
                    color: #fff;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 999999;
                    max-width: 300px;
                    will-change: transform;
                }
                #skinCycler button {
                    background: #333;
                    border: 1px solid #555;
                    color: #fff;
                    padding: 4px 8px;
                    margin: 2px;
                    cursor: pointer;
                    font-size: 11px;
                    border-radius: 2px;
                }
                #skinCycler button:hover {
                    background: #444;
                }
                #skinCycler button.active {
                    background: #4a4;
                    border-color: #6c6;
                }
                #skinCycler button.current {
                    background: #44a;
                    border-color: #66c;
                }
                #skinCycler input[type="number"] {
                    width: 60px;
                    background: #222;
                    border: 1px solid #555;
                    color: #fff;
                    padding: 2px 4px;
                    font-size: 11px;
                }
                .sc-row {
                    margin: 4px 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex-wrap: wrap;
                }
                .sc-label {
                    font-size: 10px;
                    opacity: 0.7;
                    min-width: 40px;
                }
                #scButtons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2px;
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 4px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 2px;
                }
                #scButtons button {
                    min-width: 32px;
                    padding: 3px 6px;
                    margin: 0;
                }
            </style>
            <div class="sc-row">
                <button id="scToggle">START</button>
                <span id="scStatus">0/0</span>
            </div>
            <div class="sc-row">
                <span class="sc-label">Speed:</span>
                <input type="number" id="scSpeed" value="100" min="10" max="5000" step="10">
                <span style="font-size:10px">ms</span>
            </div>
            <div class="sc-row">
                <button id="scAll">ALL</button>
                <button id="scNone">NONE</button>
                <button id="scReload">RELOAD</button>
            </div>
            <div id="scButtons"></div>
        `;
        
        document.body.appendChild(ui);
        
        document.getElementById('scToggle').onclick = toggleCycling;
        document.getElementById('scSpeed').onchange = (e) => {
            const v = parseInt(e.target.value);
            if (v >= 10 && v <= 5000) {
                const wasRunning = cycling;
                if (wasRunning) stopCycling();
                cycleSpeed = v;
                if (wasRunning) startCycling();
            }
        };
        document.getElementById('scAll').onclick = () => {
            for (let i = 1; i < skinsList.length; i++) {
                selectedIndices.add(i);
            }
            updateUI();
        };
        document.getElementById('scNone').onclick = () => {
            selectedIndices.clear();
            updateUI();
        };
        document.getElementById('scReload').onclick = () => {
            initializeSkinsList();
            renderButtons();
            updateUI();
        };
    }

    function renderButtons() {
        const container = document.getElementById('scButtons');
        container.innerHTML = '';
        
        for (let i = 1; i < skinsList.length; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.dataset.idx = i;
            btn.onclick = () => {
                if (selectedIndices.has(i)) {
                    selectedIndices.delete(i);
                    btn.classList.remove('active');
                } else {
                    selectedIndices.add(i);
                    btn.classList.add('active');
                }
                updateUI();
            };
            if (selectedIndices.has(i)) {
                btn.classList.add('active');
            }
            container.appendChild(btn);
        }
    }

    function updateUI() {
        const status = document.getElementById('scStatus');
        const toggle = document.getElementById('scToggle');
        if (status) status.textContent = `${selectedIndices.size}/${skinsList.length - 1}`;
        if (toggle) {
            toggle.textContent = cycling ? 'STOP' : 'START';
            toggle.classList.toggle('active', cycling);
        }
        
        // Update current skin highlight
        const buttons = document.querySelectorAll('#scButtons button');
        buttons.forEach(btn => btn.classList.remove('current'));
        if (cycling && currentIndex >= 0) {
            const selectedArray = Array.from(selectedIndices);
            const skinIdx = selectedArray[currentIndex];
            const currentBtn = document.querySelector(`#scButtons button[data-idx="${skinIdx}"]`);
            if (currentBtn) currentBtn.classList.add('current');
        }
    }

    function initializeSkinsList() {
        const angular = window.angular;
        if (!angular) return false;

        const skinsElement = document.querySelector('[ng-repeat*="skin in group.skins"]');
        if (!skinsElement) return false;

        const scope = angular.element(skinsElement).scope();
        if (!scope || !scope.$parent) return false;

        let parentScope = scope.$parent;
        while (parentScope && !parentScope.group) {
            parentScope = parentScope.$parent;
        }

        if (parentScope && parentScope.group && parentScope.group.skins) {
            skinsList = parentScope.group.skins;
            // Select all by default
            selectedIndices.clear();
            for (let i = 1; i < skinsList.length; i++) {
                selectedIndices.add(i);
            }
            return true;
        }
        return false;
    }

    function activateSkinDirectly(skin) {
        const angular = window.angular;
        if (!angular) return false;

        const skinsElement = document.querySelector('[ng-repeat*="skin in group.skins"]');
        if (!skinsElement) return false;

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
        return false;
    }

    function cycleNext() {
        if (selectedIndices.size === 0) {
            stopCycling();
            return;
        }
        const selectedArray = Array.from(selectedIndices);
        currentIndex = (currentIndex + 1) % selectedArray.length;
        const skinIdx = selectedArray[currentIndex];
        activateSkinDirectly(skinsList[skinIdx]);
        updateUI();
    }

    function startCycling() {
        if (cycling || selectedIndices.size === 0) return;
        cycling = true;
        currentIndex = -1;
        intervalId = setInterval(cycleNext, cycleSpeed);
        updateUI();
    }

    function stopCycling() {
        if (!cycling) return;
        cycling = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        updateUI();
    }

    function toggleCycling() {
        cycling ? stopCycling() : startCycling();
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleCycling();
        }
    });

    createUI();
    if (initializeSkinsList()) {
        renderButtons();
        updateUI();
        console.log(`Skin Cycler loaded. ${skinsList.length - 1} skins found. Ctrl+K to toggle.`);
    } else {
        console.log('Visit skins page, then click RELOAD');
    }
})();
