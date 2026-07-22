/* =========================================================
   🍀 LUCKY CLICK — FULL SCRIPT.JS
   ========================================================= */

"use strict";

/* =========================================================
   TELEGRAM
========================================================= */

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

/* =========================================================
   GAME STATE
========================================================= */

const defaultState = {
    balance: 0,
    clickPower: 0.5,
    clickPrice: 100,
    totalClicks: 0,

    level: 1,
    xp: 0,
    xpNeeded: 100,

    inventory: [],

    stats: {
        games: 0,
        wins: 0,
        losses: 0
    },

    boosters: {
        double: 0,
        lucky: 0,
        passive: false,
        megaClick: 0,
        superClick: 0,
        luck: 0,
        vip: false,
        autoClick: false
    },

    promoUsed: [],

    quests: {
        firstClick: false,
        earn100: false,
        level5: false,
        casino: false
    }
};

let state = loadState();

/* =========================================================
   GAME VARIABLES
========================================================= */

let selectedRouletteColor = null;
let selectedRouletteNumber = null;
let selectedDice = null;

let ladderActive = false;
let ladderLevel = 0;
let ladderBet = 0;
let ladderMultiplier = 1;

let minesActive = false;
let minesBet = 0;
let minesMultiplier = 1;
let minesBombs = [];
let minesOpened = [];

let crashActive = false;
let crashBet = 0;
let crashMultiplier = 1;
let crashInterval = null;
let crashPoint = 0;

let soundEnabled = true;

let currentCaseType = null;
let caseOpeningRunning = false;

/* =========================================================
   SOUND SYSTEM
========================================================= */

const sounds = {
    click: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
    win: "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg",
    lose: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    coin: "https://actions.google.com/sounds/v1/foley/coins_rattling.ogg",
    dice: "https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg",
    roulette: "https://actions.google.com/sounds/v1/foley/rolling_dice.ogg",
    slot: "https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum.ogg",
    crash: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
    jackpot: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    case: "https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg"
};

function playSound(name) {
    if (!soundEnabled) return;

    try {
        const audio = new Audio(sounds[name]);

        audio.volume = 0.35;

        audio.play().catch(() => {});
    } catch (e) {}
}

function toggleSound() {
    soundEnabled = !soundEnabled;

    showMessage(
        soundEnabled
            ? "🔊 Звук включён"
            : "🔇 Звук выключен",
        soundEnabled ? "success" : "error"
    );
}

/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadState() {

    try {

        const saved = localStorage.getItem("luckyClickSave");

        if (!saved) {
            return structuredClone(defaultState);
        }

        const parsed = JSON.parse(saved);

        return {
            ...structuredClone(defaultState),
            ...parsed,

            stats: {
                ...defaultState.stats,
                ...(parsed.stats || {})
            },

            boosters: {
                ...defaultState.boosters,
                ...(parsed.boosters || {})
            },

            quests: {
                ...defaultState.quests,
                ...(parsed.quests || {})
            }
        };

    } catch (e) {

        console.error("Ошибка загрузки:", e);

        return structuredClone(defaultState);
    }
}

function saveState() {

    localStorage.setItem(
        "luckyClickSave",
        JSON.stringify(state)
    );
}

/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(number) {

    return Number(number || 0).toLocaleString(
        "ru-RU",
        {
            maximumFractionDigits: 2
        }
    );
}

/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    document
        .querySelectorAll(".balance")
        .forEach(el => {

            el.textContent =
                formatNumber(state.balance);

        });

    document
        .querySelectorAll(".click-power")
        .forEach(el => {

            el.textContent =
                formatNumber(state.clickPower);

        });

    document
        .querySelectorAll(".click-price")
        .forEach(el => {

            el.textContent =
                formatNumber(state.clickPrice) +
                " 🪙";

        });

    document
        .querySelectorAll(".total-clicks")
        .forEach(el => {

            el.textContent =
                formatNumber(state.totalClicks);

        });

    document
        .querySelectorAll(".player-level")
        .forEach(el => {

            el.textContent =
                state.level;

        });

    document
        .querySelectorAll(".player-xp")
        .forEach(el => {

            el.textContent =
                Math.floor(state.xp);

        });

    document
        .querySelectorAll(".xp-needed")
        .forEach(el => {

            el.textContent =
                state.xpNeeded;

        });

    const xpProgress =
        document.getElementById("xpProgress");

    if (xpProgress) {

        const percent =
            Math.min(
                100,
                (state.xp / state.xpNeeded) * 100
            );

        xpProgress.style.width =
            percent + "%";

    }

    updateInventory();

    updateHomeInventory();

    updateCasesAccess();

    updateCasinoAccess();

    updateQuestUI();

    saveState();
}

/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");
            page.classList.remove("active");

        });

    const page =
        document.getElementById(pageId);

    if (page) {

        page.classList.remove("hidden");
        page.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    document
        .querySelectorAll(".game-screen")
        .forEach(game => {

            game.classList.add("hidden");

        });
}

function setActiveNav(button) {

    document
        .querySelectorAll(".nav-button")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    if (button) {

        button.classList.add("active");

    }
}

/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "success"
) {

    const element =
        document.getElementById("gameMessage");

    if (!element) return;

    element.textContent =
        message;

    element.className =
        "game-message show " +
        type;

    setTimeout(() => {

        element.classList.remove("show");

    }, 2500);
}

/* =========================================================
   CLICKER
========================================================= */

function clickCoin() {

    let amount =
        state.clickPower;

    if (state.boosters.double > Date.now()) {

        amount *= 2;

    }

    if (state.boosters.lucky > Date.now()) {

        if (Math.random() < 0.15) {

            amount *= 10;

            showMessage(
                "🍀 LUCKY BONUS ×10!",
                "success"
            );

        }

    }

    if (state.boosters.luck > 0) {

        const chance =
            Math.min(
                0.5,
                0.05 +
                state.boosters.luck * 0.02
            );

        if (Math.random() < chance) {

            amount *= 3;

            showMessage(
                "💎 Lucky Chance ×3!",
                "success"
            );

        }

    }

    state.balance += amount;

    state.totalClicks++;

    addXP(1);

    playSound("click");

    createClickEffect(
        "+" +
        formatNumber(amount)
    );

    updateUI();
}

/* =========================================================
   CLICK EFFECT
========================================================= */

function createClickEffect(text) {

    const container =
        document.getElementById("clickEffects");

    if (!container) return;

    const element =
        document.createElement("div");

    element.className =
        "click-effect";

    element.textContent =
        text +
        " 🪙";

    element.style.left =
        (40 + Math.random() * 20) +
        "%";

    element.style.top =
        (45 + Math.random() * 10) +
        "%";

    container.appendChild(element);

    setTimeout(() => {

        element.remove();

    }, 1000);
}

/* =========================================================
   XP / LEVEL
========================================================= */

function addXP(amount) {

    state.xp += amount;

    while (
        state.xp >=
        state.xpNeeded
    ) {

        state.xp -=
            state.xpNeeded;

        state.level++;

        state.xpNeeded =
            Math.floor(
                state.xpNeeded * 1.35
            );

        showMessage(
            "⭐ Новый уровень: " +
            state.level,
            "success"
        );

        playSound("win");
    }

    updateCasesAccess();

    updateCasinoAccess();
}

/* =========================================================
   UPGRADE CLICK
========================================================= */

function upgradeClick() {

    if (
        state.balance <
        state.clickPrice
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;
    }

    state.balance -=
        state.clickPrice;

    state.clickPower += 0.5;

    state.clickPrice *= 2;

    showMessage(
        "⚡ Клик улучшен!",
        "success"
    );

    playSound("coin");

    updateUI();
}

/* =========================================================
   SHOP
========================================================= */

function buyBooster(type) {

    if (type === "double") {

        const price = 1000;

        if (!spendCoins(price)) return;

        state.boosters.double =
            Date.now() +
            60000;

        showMessage(
            "⚡ Double Click активирован на 60 секунд",
            "success"
        );

    }

    if (type === "lucky") {

        const price = 2500;

        if (!spendCoins(price)) return;

        state.boosters.lucky =
            Date.now() +
            60000;

        showMessage(
            "🍀 Lucky Boost активирован!",
            "success"
        );

    }

    updateUI();
}

function buyPassiveIncome() {

    const price = 10000;

    if (
        state.boosters.passive
    ) {

        showMessage(
            "💰 Автодоход уже куплен",
            "error"
        );

        return;
    }

    if (!spendCoins(price)) return;

    state.boosters.passive =
        true;

    showMessage(
        "💰 Автодоход активирован!",
        "success"
    );

    updateUI();
}

function buyShopItem(item) {

    const prices = {

        megaClick: 5000,

        superClick: 25000,

        luck: 15000,

        vip: 100000,

        autoClick: 50000

    };

    const price =
        prices[item];

    if (!price) return;

    if (
        item === "vip" &&
        state.boosters.vip
    ) {

        showMessage(
            "👑 VIP уже активирован",
            "error"
        );

        return;
    }

    if (
        item === "autoClick" &&
        state.boosters.autoClick
    ) {

        showMessage(
            "🤖 Автокликер уже активирован",
            "error"
        );

        return;
    }

    if (!spendCoins(price)) return;

    switch (item) {

        case "megaClick":

            state.clickPower += 1;

            break;

        case "superClick":

            state.clickPower += 5;

            break;

        case "luck":

            state.boosters.luck++;

            break;

        case "vip":

            state.boosters.vip =
                true;

            state.clickPower += 1;

            break;

        case "autoClick":

            state.boosters.autoClick =
                true;

            startAutoClick();

            break;

    }

    showMessage(
        "🛍️ Покупка успешно совершена!",
        "success"
    );

    updateUI();
}

function spendCoins(amount) {

    if (
        state.balance <
        amount
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        playSound("lose");

        return false;
    }

    state.balance -=
        amount;

    return true;
}

/* =========================================================
   AUTO CLICK
========================================================= */

function startAutoClick() {

    if (
        window.autoClickInterval
    ) return;

    window.autoClickInterval =
        setInterval(() => {

            if (
                state.boosters.autoClick
            ) {

                clickCoin();

            }

        }, 3000);
}

/* =========================================================
   PASSIVE INCOME
========================================================= */

setInterval(() => {

    if (
        state.boosters.passive
    ) {

        state.balance += 100;

        showMessage(
            "💰 Автодоход +100 🪙",
            "success"
        );

        updateUI();

    }

}, 600000);

/* =========================================================
   PROMOCODES
========================================================= */

const promoCodes = {

    "LUCKY": 1000,

    "LUCKY100": 100,

    "LUCKY500": 500,

    "WELCOME": 500,

    "BONUS": 2500,

    "LUCKY2026": 5000,

    "CASINO": 10000,

    "JACKPOT": 50000

};

function activatePromo() {

    const input =
        document.getElementById(
            "promoInput"
        );

    const message =
        document.getElementById(
            "promoMessage"
        );

    if (!input) return;

    const code =
        input.value
            .trim()
            .toUpperCase();

    if (!code) {

        message.textContent =
            "Введите промокод";

        return;
    }

    if (
        state.promoUsed.includes(code)
    ) {

        message.textContent =
            "❌ Этот промокод уже использован";

        return;
    }

    if (
        promoCodes[code] === undefined
    ) {

        message.textContent =
            "❌ Промокод не найден";

        playSound("lose");

        return;
    }

    const reward =
        promoCodes[code];

    state.balance +=
        reward;

    state.promoUsed.push(code);

    message.textContent =
        "🎉 Получено +" +
        formatNumber(reward) +
        " 🪙";

    playSound("win");

    input.value = "";

    updateUI();
}

/* =========================================================
   CASE ACCESS
========================================================= */

function updateCasesAccess() {

    const locked =
        document.getElementById(
            "casesLocked"
        );

    const content =
        document.getElementById(
            "casesContent"
        );

    if (!locked || !content) return;

    if (state.level >= 5) {

        locked.classList.add("hidden");

        content.classList.remove("hidden");

    } else {

        locked.classList.remove("hidden");

        content.classList.add("hidden");

    }
}

/* =========================================================
   CASES
========================================================= */

const caseItems = {

    common: [

        {
            name: "Обычная монета",
            icon: "🪙",
            value: 1000,
            rarity: "common"
        },

        {
            name: "Серебряный жетон",
            icon: "⚪",
            value: 2500,
            rarity: "common"
        },

        {
            name: "Золотой жетон",
            icon: "🟡",
            value: 5000,
            rarity: "rare"
        },

        {
            name: "Алмаз",
            icon: "💎",
            value: 10000,
            rarity: "rare"
        }

    ],

    rare: [

        {
            name: "Сапфир",
            icon: "🔷",
            value: 10000,
            rarity: "rare"
        },

        {
            name: "Рубин",
            icon: "🔴",
            value: 25000,
            rarity: "rare"
        },

        {
            name: "Изумруд",
            icon: "💚",
            value: 50000,
            rarity: "legendary"
        },

        {
            name: "Корона",
            icon: "👑",
            value: 100000,
            rarity: "legendary"
        }

    ],

    legendary: [

        {
            name: "Королевский алмаз",
            icon: "💎",
            value: 100000,
            rarity: "legendary"
        },

        {
            name: "Золотая корона",
            icon: "👑",
            value: 250000,
            rarity: "legendary"
        },

        {
            name: "Мифический кристалл",
            icon: "🔮",
            value: 500000,
            rarity: "mythical"
        },

        {
            name: "JACKPOT",
            icon: "💰",
            value: 1000000,
            rarity: "mythical"
        }

    ],

    mythical: [

        {
            name: "Мифический кристалл",
            icon: "🔮",
            value: 500000,
            rarity: "mythical"
        },

        {
            name: "Звезда удачи",
            icon: "🌟",
            value: 1000000,
            rarity: "mythical"
        },

        {
            name: "Космический алмаз",
            icon: "💠",
            value: 2500000,
            rarity: "mythical"
        },

        {
            name: "MEGA JACKPOT",
            icon: "💎",
            value: 5000000,
            rarity: "mythical"
        }

    ]

};

const casePrices = {

    common: 5000,

    rare: 25000,

    legendary: 100000,

    mythical: 500000

};

function getRandomCaseItem(type) {

    const items =
        caseItems[type];

    const roll =
        Math.random();

    if (
        type === "common"
    ) {

        if (roll < 0.65)
            return items[0];

        if (roll < 0.9)
            return items[1];

        if (roll < 0.98)
            return items[2];

        return items[3];
    }

    if (
        type === "rare"
    ) {

        if (roll < 0.5)
            return items[0];

        if (roll < 0.8)
            return items[1];

        if (roll < 0.97)
            return items[2];

        return items[3];
    }

    if (
        type === "legendary"
    ) {

        if (roll < 0.55)
            return items[0];

        if (roll < 0.85)
            return items[1];

        if (roll < 0.98)
            return items[2];

        return items[3];
    }

    return items[
        Math.floor(
            Math.random() *
            items.length
        )
    ];
}

function openCase(type) {

    if (caseOpeningRunning)
        return;

    const price =
        casePrices[type];

    if (!spendCoins(price))
        return;

    currentCaseType =
        type;

    caseOpeningRunning =
        true;

    playSound("case");

    const modal =
        document.getElementById(
            "caseOpening"
        );

    const track =
        document.getElementById(
            "caseTrackItems"
        );

    const result =
        document.getElementById(
            "caseOpeningResult"
        );

    if (!modal || !track)
        return;

    modal.classList.add("active");

    track.innerHTML = "";

    result.textContent =
        "Прокрутка...";

    const winningItem =
        getRandomCaseItem(type);

    const items = [];

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        items.push(
            getRandomCaseItem(type)
        );

    }

    items[27] =
        winningItem;

    items.forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "case-track-item";

        div.innerHTML =

            `<div>${item.icon}</div>
             <span>${item.name}</span>
             <small>${formatNumber(item.value)} 🪙</small>`;

        track.appendChild(div);

    });

    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0px)";

    setTimeout(() => {

        const itemWidth =
            115;

        const centerOffset =
            (modal.clientWidth / 2) -
            (itemWidth / 2);

        const target =
            -(27 * itemWidth) +
            centerOffset;

        track.style.transition =
            "transform 5s cubic-bezier(.12,.8,.18,1)";

        track.style.transform =
            `translateX(${target}px)`;

    }, 100);

    setTimeout(() => {

        finishCase(winningItem);

    }, 5400);

    updateUI();
}

function finishCase(item) {

    addInventoryItem(item);

    const result =
        document.getElementById(
            "caseOpeningResult"
        );

    if (result) {

        result.innerHTML =

            `🎉 Выпало: <strong>
            ${item.icon}
            ${item.name}
            </strong><br>
            💰 Цена: ${formatNumber(item.value)} 🪙`;

    }

    playSound("win");

    caseOpeningRunning =
        false;

    updateUI();
}

function closeCaseOpening() {

    const modal =
        document.getElementById(
            "caseOpening"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }
}

/* =========================================================
   INVENTORY
========================================================= */

function addInventoryItem(item) {

    state.inventory.push({

        id:
            Date.now() +
            Math.random(),

        name:
            item.name,

        icon:
            item.icon,

        value:
            item.value,

        rarity:
            item.rarity

    });

}

function updateInventory() {

    const inventory =
        document.getElementById(
            "inventory"
        );

    const count =
        document.querySelector(
            ".inventory-count"
        );

    if (count) {

        count.textContent =
            state.inventory.length;

    }

    if (!inventory)
        return;

    if (
        state.inventory.length === 0
    ) {

        inventory.innerHTML =

            `<div class="empty-inventory">
                🎒
                <p>Инвентарь пуст</p>
            </div>`;

        return;
    }

    inventory.innerHTML = "";

    state.inventory.forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "inventory-item";

        div.innerHTML =

            `<div style="font-size:42px">
                ${item.icon}
            </div>

            <strong>
                ${item.name}
            </strong>

            <p>
                ${formatNumber(item.value)} 🪙
            </p>

            <button
                onclick="sellItem('${item.id}')"
            >
                💰 Продать
            </button>`;

        inventory.appendChild(div);

    });
}

function updateHomeInventory() {

    const container =
        document.getElementById(
            "homeInventory"
        );

    if (!container)
        return;

    if (
        state.inventory.length === 0
    ) {

        container.innerHTML =

            `<div class="empty-inventory">
                🎒
                <p>Открывай кейсы, чтобы получать предметы</p>
            </div>`;

        return;
    }

    container.innerHTML = "";

    state.inventory
        .slice(-4)
        .reverse()
        .forEach(item => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "inventory-item";

            div.innerHTML =

                `<div style="font-size:35px">
                    ${item.icon}
                </div>

                <strong>
                    ${item.name}
                </strong>

                <small>
                    ${formatNumber(item.value)} 🪙
                </small>

                <button
                    onclick="sellItem('${item.id}')"
                >
                    Продать
                </button>`;

            container.appendChild(div);

        });
}

function sellItem(id) {

    const index =
        state.inventory.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );

    if (index === -1)
        return;

    const item =
        state.inventory[index];

    const sellPrice =
        Math.floor(
            item.value * 0.7
        );

    state.balance +=
        sellPrice;

    state.inventory.splice(
        index,
        1
    );

    showMessage(
        `💰 ${item.name} продан за ${formatNumber(sellPrice)} 🪙`,
        "success"
    );

    playSound("coin");

    updateUI();
}

/* =========================================================
   CASINO ACCESS
========================================================= */

function updateCasinoAccess() {

    const locked =
        document.getElementById(
            "casinoLocked"
        );

    const content =
        document.getElementById(
            "casinoContent"
        );

    if (!locked || !content)
        return;

    if (state.level >= 7) {

        locked.classList.add(
            "hidden"
        );

        content.classList.remove(
            "hidden"
        );

    } else {

        locked.classList.remove(
            "hidden"
        );

        content.classList.add(
            "hidden"
        );

    }
}

/* =========================================================
   OPEN GAME
========================================================= */

function openGame(gameId) {

    document
        .querySelectorAll(".game-screen")
        .forEach(game => {

            game.classList.add(
                "hidden"
            );

        });

    const game =
        document.getElementById(
            gameId
        );

    if (game) {

        game.classList.remove(
            "hidden"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
}

function backToCasino() {

    document
        .querySelectorAll(".game-screen")
        .forEach(game => {

            game.classList.add(
                "hidden"
            );

        });

}

/* =========================================================
   SLOT
========================================================= */

const slotSymbols = [
    "🍒",
    "🍋",
    "🍊",
    "🍉",
    "⭐",
    "💎",
    "7️⃣"
];

function playSlot() {

    const input =
        document.getElementById(
            "slotBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    state.stats.games++;

    const reels = [

        document.getElementById(
            "slot1"
        ),

        document.getElementById(
            "slot2"
        ),

        document.getElementById(
            "slot3"
        )

    ];

    reels.forEach(
        reel => {

            if (reel) {

                reel.classList.add(
                    "spinning"
                );

            }

        }
    );

    playSound("slot");

    let counter = 0;

    const interval =
        setInterval(() => {

            reels.forEach(
                reel => {

                    if (reel) {

                        reel.textContent =
                            slotSymbols[
                                Math.floor(
                                    Math.random() *
                                    slotSymbols.length
                                )
                            ];

                    }

                }
            );

            counter++;

            if (
                counter >= 20
            ) {

                clearInterval(
                    interval
                );

                reels.forEach(
                    reel => {

                        if (reel) {

                            reel.classList.remove(
                                "spinning"
                            );

                        }

                    }
                );

                finishSlot(
                    reels,
                    bet
                );

            }

        }, 100);

}

function finishSlot(
    reels,
    bet
) {

    const result = [

        slotSymbols[
            Math.floor(
                Math.random() *
                slotSymbols.length
            )
        ],

        slotSymbols[
            Math.floor(
                Math.random() *
                slotSymbols.length
            )
        ],

        slotSymbols[
            Math.floor(
                Math.random() *
                slotSymbols.length
            )
        ]

    ];

    if (
        Math.random() < 0.08
    ) {

        result[1] =
            result[0];

        result[2] =
            result[0];

    }

    reels.forEach(
        (reel, index) => {

            if (reel) {

                reel.textContent =
                    result[index];

            }

        }
    );

    let multiplier = 0;

    if (
        result[0] ===
        result[1] &&
        result[1] ===
        result[2]
    ) {

        multiplier =
            result[0] ===
            "7️⃣"
                ? 25
                : 10;

    } else if (
        result[0] ===
        result[1] ||
        result[1] ===
        result[2] ||
        result[0] ===
        result[2]
    ) {

        multiplier = 2;

    }

    if (multiplier > 0) {

        const win =
            bet * multiplier;

        state.balance +=
            win;

        state.stats.wins++;

        showMessage(
            `🎰 Выигрыш ×${multiplier}: +${formatNumber(win)} 🪙`,
            "success"
        );

        playSound("win");

    } else {

        state.stats.losses++;

        showMessage(
            "🎰 Не повезло!",
            "error"
        );

        playSound("lose");

    }

    updateUI();
}

/* =========================================================
   ROULETTE
========================================================= */

const redNumbers = [

    1, 3, 5, 7, 9,

    12, 14, 16, 18,

    19, 21, 23, 25, 27,

    30, 32, 34, 36

];

function getRouletteColor(number) {

    if (number === 0)
        return "green";

    return redNumbers.includes(
        number
    )
        ? "red"
        : "black";
}

function selectRouletteColor(color) {

    selectedRouletteColor =
        color;

    const element =
        document.getElementById(
            "selectedRouletteColor"
        );

    if (element) {

        const names = {

            red: "🔴 Красное ×2",

            black: "⚫ Чёрное ×2",

            green: "🟢 Зелёное ×14"

        };

        element.textContent =
            names[color];

    }

}

function selectRouletteNumber(number) {

    selectedRouletteNumber =
        number;

    const element =
        document.getElementById(
            "selectedRouletteNumber"
        );

    if (element) {

        element.textContent =
            "🎯 Число: " +
            number;

    }

}

function playRoulette() {

    const input =
        document.getElementById(
            "rouletteBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (
        !selectedRouletteColor &&
        selectedRouletteNumber === null
    ) {

        showMessage(
            "Выберите цвет или число",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    state.stats.games++;

    const wheel =
        document.getElementById(
            "rouletteWheel"
        );

    playSound("roulette");

    if (wheel) {

        wheel.classList.add(
            "spinning"
        );

        setTimeout(() => {

            wheel.classList.remove(
                "spinning"
            );

        }, 4000);

    }

    const result =
        Math.floor(
            Math.random() * 37
        );

    setTimeout(() => {

        const resultColor =
            getRouletteColor(
                result
            );

        const resultElement =
            document.getElementById(
                "rouletteNumber"
            );

        if (resultElement) {

            resultElement.textContent =
                result;

            resultElement.style.color =

                resultColor === "red"
                    ? "#ff4057"
                    : resultColor === "black"
                        ? "#ffffff"
                        : "#53ffad";

        }

        let multiplier = 0;

        if (
            selectedRouletteNumber !== null &&
            selectedRouletteNumber === result
        ) {

            multiplier =
                result === 0
                    ? 14
                    : 36;

        } else if (
            selectedRouletteColor &&
            selectedRouletteColor ===
            resultColor
        ) {

            multiplier =
                resultColor === "green"
                    ? 14
                    : 2;

        }

        if (multiplier > 0) {

            const win =
                bet * multiplier;

            state.balance +=
                win;

            state.stats.wins++;

            showMessage(
                `🎉 Рулетка: ${result} ${resultColor} — выигрыш ${formatNumber(win)} 🪙`,
                "success"
            );

            playSound("win");

        } else {

            state.stats.losses++;

            showMessage(
                `🎡 Выпало ${result}. Ставка проиграна.`,
                "error"
            );

            playSound("lose");

        }

        selectedRouletteColor =
            null;

        selectedRouletteNumber =
            null;

        updateUI();

    }, 4000);
}

/* =========================================================
   DICE
========================================================= */

function selectDiceNumber(number) {

    selectedDice =
        number;

    const element =
        document.getElementById(
            "selectedDiceNumber"
        );

    if (element) {

        element.textContent =
            "🎯 Выбрано число: " +
            number;

    }

}

function playDice() {

    const input =
        document.getElementById(
            "diceBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!selectedDice) {

        showMessage(
            "Выберите число",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    const dice =
        document.querySelector(
            ".dice-number"
        );

    if (dice) {

        dice.classList.add(
            "rolling"
        );

    }

    playSound("dice");

    let counter = 0;

    const interval =
        setInterval(() => {

            const temp =
                Math.floor(
                    Math.random() * 6
                ) + 1;

            if (dice) {

                dice.textContent =
                    ["⚀","⚁","⚂","⚃","⚄","⚅"][
                        temp - 1
                    ];

            }

            counter++;

            if (
                counter >= 10
            ) {

                clearInterval(
                    interval
                );

                finishDice(
                    dice,
                    bet
                );

            }

        }, 100);

}

function finishDice(
    dice,
    bet
) {

    if (dice) {

        dice.classList.remove(
            "rolling"
        );

    }

    const result =
        Math.floor(
            Math.random() * 6
        ) + 1;

    const faces =
        [
            "⚀",
            "⚁",
            "⚂",
            "⚃",
            "⚄",
            "⚅"
        ];

    if (dice) {

        dice.textContent =
            faces[result - 1];

    }

    if (
        result === selectedDice
    ) {

        const win =
            bet * 5;

        state.balance +=
            win;

        state.stats.wins++;

        showMessage(
            `🎲 Выпало ${result}! +${formatNumber(win)} 🪙`,
            "success"
        );

        playSound("win");

    } else {

        state.stats.losses++;

        showMessage(
            `🎲 Выпало ${result}. Не угадал!`,
            "error"
        );

        playSound("lose");

    }

    updateUI();
}

/* =========================================================
   LADDER
========================================================= */

function startLadder() {

    const input =
        document.getElementById(
            "ladderBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    ladderActive =
        true;

    ladderLevel =
        0;

    ladderBet =
        bet;

    ladderMultiplier =
        1;

    updateLadder();

    showMessage(
        "📈 Лесенка началась!",
        "success"
    );

}

function updateLadder() {

    const multiplier =
        document.getElementById(
            "ladderMultiplier"
        );

    const level =
        document.getElementById(
            "ladderLevel"
        );

    const board =
        document.getElementById(
            "ladderBoard"
        );

    if (multiplier) {

        multiplier.textContent =
            "×" +
            ladderMultiplier.toFixed(2);

    }

    if (level) {

        level.textContent =
            `Уровень ${ladderLevel} / 10`;

    }

    if (board) {

        board.innerHTML = "";

        for (
            let i = 10;
            i >= 1;
            i--
        ) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "ladder-step";

            if (
                i <= ladderLevel
            ) {

                div.classList.add(
                    "active"
                );

            }

            div.textContent =
                `Уровень ${i}`;

            board.appendChild(div);

        }

    }

}

function ladderNext() {

    if (!ladderActive) {

        showMessage(
            "Сначала начните игру",
            "error"
        );

        return;
    }

    const chance =
        0.82 -
        ladderLevel * 0.045;

    if (
        Math.random() > chance
    ) {

        ladderActive =
            false;

        state.stats.losses++;

        showMessage(
            "💥 Лесенка сломалась!",
            "error"
        );

        playSound("lose");

        updateUI();

        return;
    }

    ladderLevel++;

    ladderMultiplier *=
        1.35;

    playSound("coin");

    updateLadder();

    if (
        ladderLevel >= 10
    ) {

        ladderCashout();

    }

}

function ladderCashout() {

    if (
        !ladderActive
    ) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;
    }

    const win =
        Math.floor(
            ladderBet *
            ladderMultiplier
        );

    state.balance +=
        win;

    ladderActive =
        false;

    state.stats.wins++;

    showMessage(
        `💰 Забрано ${formatNumber(win)} 🪙`,
        "success"
    );

    playSound("win");

    updateUI();

}

/* =========================================================
   MINES
========================================================= */

function startMines() {

    const input =
        document.getElementById(
            "minesBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    minesActive =
        true;

    minesBet =
        bet;

    minesMultiplier =
        1;

    minesOpened =
        [];

    minesBombs =
        [];

    while (
        minesBombs.length < 5
    ) {

        const bomb =
            Math.floor(
                Math.random() * 16
            );

        if (
            !minesBombs.includes(
                bomb
            )
        ) {

            minesBombs.push(
                bomb
            );

        }

    }

    renderMines();

}

function renderMines() {

    const board =
        document.querySelector(
            ".mines-board"
        );

    if (!board)
        return;

    board.innerHTML = "";

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "mine-cell";

        button.textContent =
            "❓";

        button.onclick =
            () => openMine(i);

        board.appendChild(
            button
        );

    }

    updateMinesMultiplier();
}

function openMine(index) {

    if (!minesActive)
        return;

    if (
        minesOpened.includes(
            index
        )
    ) return;

    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );

    if (
        minesBombs.includes(
            index
        )
    ) {

        cells[index].textContent =
            "💣";

        cells[index].classList.add(
            "mine-danger"
        );

        minesActive =
            false;

        state.stats.losses++;

        showMessage(
            "💥 БУМ! Ты попал на мину!",
            "error"
        );

        playSound("lose");

        return;
    }

    minesOpened.push(
        index
    );

    cells[index].textContent =
        "💎";

    cells[index].classList.add(
        "mine-safe"
    );

    minesMultiplier *=
        1.18;

    playSound("coin");

    updateMinesMultiplier();
}

function updateMinesMultiplier() {

    const element =
        document.getElementById(
            "minesMultiplier"
        );

    if (element) {

        element.textContent =
            "×" +
            minesMultiplier.toFixed(2);

    }

}

function cashoutMines() {

    if (!minesActive) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;
    }

    const win =
        Math.floor(
            minesBet *
            minesMultiplier
        );

    state.balance +=
        win;

    minesActive =
        false;

    state.stats.wins++;

    showMessage(
        `💰 Выигрыш ${formatNumber(win)} 🪙`,
        "success"
    );

    playSound("win");

    updateUI();
}

/* =========================================================
   CRASH
========================================================= */

function startCrash() {

    if (crashActive) {

        showMessage(
            "Игра уже идёт",
            "error"
        );

        return;
    }

    const input =
        document.getElementById(
            "crashBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    crashBet =
        bet;

    crashMultiplier =
        1;

    crashActive =
        true;

    crashPoint =
        1.1 +
        Math.random() *
        Math.random() *
        12;

    const plane =
        document.getElementById(
            "crashPlane"
        );

    playSound("crash");

    let startTime =
        Date.now();

    crashInterval =
        setInterval(() => {

            const elapsed =
                (Date.now() -
                    startTime) /
                1000;

            crashMultiplier =
                1 +
                elapsed *
                0.35;

            updateCrashUI();

            if (
                crashMultiplier >=
                crashPoint
            ) {

                crash();

            }

        }, 100);

}

function updateCrashUI() {

    const multiplier =
        document.getElementById(
            "crashMultiplier"
        );

    const plane =
        document.getElementById(
            "crashPlane"
        );

    if (multiplier) {

        multiplier.textContent =
            "×" +
            crashMultiplier.toFixed(2);

    }

    if (plane) {

        const progress =
            Math.min(
                90,
                5 +
                (crashMultiplier - 1) *
                8
            );

        plane.style.left =
            progress + "%";

        plane.style.top =
            Math.max(
                10,
                55 -
                (crashMultiplier - 1) *
                4
            ) + "%";

    }

}

function crash() {

    if (!crashActive)
        return;

    clearInterval(
        crashInterval
    );

    crashActive =
        false;

    state.stats.losses++;

    showMessage(
        `💥 Crash на ×${crashPoint.toFixed(2)}`,
        "error"
    );

    playSound("lose");

}

function cashoutCrash() {

    if (!crashActive) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;
    }

    clearInterval(
        crashInterval
    );

    crashActive =
        false;

    const win =
        Math.floor(
            crashBet *
            crashMultiplier
        );

    state.balance +=
        win;

    state.stats.wins++;

    showMessage(
        `✈️ Забрал на ×${crashMultiplier.toFixed(2)} — ${formatNumber(win)} 🪙`,
        "success"
    );

    playSound("win");

    updateUI();
}

/* =========================================================
   JACKPOT
========================================================= */

function playJackpot() {

    const input =
        document.getElementById(
            "jackpotBet"
        );

    const bet =
        Number(input?.value);

    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;
    }

    if (!spendCoins(bet))
        return;

    playSound("jackpot");

    const roll =
        Math.random();

    let multiplier;

    if (
        roll < 0.001
    ) {

        multiplier =
            1000;

    } else if (
        roll < 0.01
    ) {

        multiplier =
            100;

    } else if (
        roll < 0.1
    ) {

        multiplier =
            10;

    } else if (
        roll < 0.3
    ) {

        multiplier =
            2;

    } else {

        multiplier =
            0;

    }

    if (
        multiplier > 0
    ) {

        const win =
            bet *
            multiplier;

        state.balance +=
            win;

        state.stats.wins++;

        showMessage(
            `💎 JACKPOT ×${multiplier}! +${formatNumber(win)} 🪙`,
            "success"
        );

        playSound("win");

    } else {

        state.stats.losses++;

        showMessage(
            "💎 JACKPOT не сработал",
            "error"
        );

        playSound("lose");

    }

    updateUI();
}

/* =========================================================
   QUESTS
========================================================= */

function updateQuestUI() {

    const quests =
        state.quests;

    const first =
        document.querySelector(
            "#questsList .quest-card:nth-child(1) .quest-progress"
        );

    if (first) {

        first.textContent =
            state.totalClicks >= 1
                ? "1 / 1"
                : "0 / 1";

    }

    const second =
        document.querySelector(
            "#questsList .quest-card:nth-child(2) .quest-progress"
        );

    if (second) {

        second.textContent =
            Math.min(
                100,
                Math.floor(
                    state.totalClicks *
                    state.clickPower
                )
            ) +
            " / 100";

    }

    const third =
        document.querySelector(
            "#questsList .quest-card:nth-child(3) .quest-progress"
        );

    if (third) {

        third.textContent =
            `Уровень ${state.level} / 5`;

    }

    const fourth =
        document.querySelector(
            "#questsList .quest-card:nth-child(4) .quest-progress"
        );

    if (fourth) {

        fourth.textContent =
            `Уровень ${state.level} / 7`;

    }

}

function claimQuest(type) {

    if (
        state.quests[type]
    ) {

        showMessage(
            "🎁 Награда уже получена",
            "error"
        );

        return;
    }

    let reward = 0;

    if (
        type === "firstClick"
    ) {

        if (
            state.totalClicks < 1
        ) {

            showMessage(
                "Сначала сделай клик",
                "error"
            );

            return;
        }

        reward = 50;

    }

    if (
        type === "earn100"
    ) {

        if (
            state.balance < 100
        ) {

            showMessage(
                "Нужно заработать 100 монет",
                "error"
            );

            return;
        }

        reward = 100;

    }

    if (
        type === "level5"
    ) {

        if (
            state.level < 5
        ) {

            showMessage(
                "Нужен 5 уровень",
                "error"
            );

            return;
        }

        reward = 1000;

    }

    if (
        type === "casino"
    ) {

        if (
            state.level < 7
        ) {

            showMessage(
                "Нужен 7 уровень",
                "error"
            );

            return;
        }

        reward = 2500;

    }

    state.balance +=
        reward;

    state.quests[type] =
        true;

    showMessage(
        `🎁 Получено ${formatNumber(reward)} 🪙`,
        "success"
    );

    playSound("win");

    updateUI();
}

/* =========================================================
   SOUND BUTTON
========================================================= */

function createSoundButton() {

    const header =
        document.querySelector(
            ".top-header"
        );

    if (!header)
        return;

    if (
        document.getElementById(
            "soundToggle"
        )
    ) return;

    const button =
        document.createElement(
            "button"
        );

    button.id =
        "soundToggle";

    button.className =
        "sound-toggle";

    button.textContent =
        "🔊";

    button.onclick =
        toggleSound;

    header.insertBefore(
        button,
        header.lastElementChild
    );
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createSoundButton();

        updateUI();

        if (
            state.boosters.autoClick
        ) {

            startAutoClick();

        }

    }
);

/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.openPage =
    openPage;

window.setActiveNav =
    setActiveNav;

window.clickCoin =
    clickCoin;

window.upgradeClick =
    upgradeClick;

window.buyBooster =
    buyBooster;

window.buyPassiveIncome =
    buyPassiveIncome;

window.buyShopItem =
    buyShopItem;

window.activatePromo =
    activatePromo;

window.openCase =
    openCase;

window.closeCaseOpening =
    closeCaseOpening;

window.sellItem =
    sellItem;

window.openGame =
    openGame;

window.backToCasino =
    backToCasino;

window.playSlot =
    playSlot;

window.selectRouletteColor =
    selectRouletteColor;

window.selectRouletteNumber =
    selectRouletteNumber;

window.playRoulette =
    playRoulette;

window.selectDiceNumber =
    selectDiceNumber;

window.playDice =
    playDice;

window.startLadder =
    startLadder;

window.ladderNext =
    ladderNext;

window.ladderCashout =
    ladderCashout;

window.startMines =
    startMines;

window.cashoutMines =
    cashoutMines;

window.startCrash =
    startCrash;

window.cashoutCrash =
    cashoutCrash;

window.playJackpot =
    playJackpot;

window.claimQuest =
    claimQuest;

window.toggleSound =
    toggleSound;