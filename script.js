/* =========================================================
🍀 LUCKY CLICK — SCRIPT.JS
Версия для твоего текущего index.html
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
GAME DATA
========================================================= */

let game = JSON.parse(localStorage.getItem("luckyClickSave")) || {

    balance: 0,

    clickPower: 0.5,

    clickPrice: 100,

    totalClicks: 0,

    level: 1,

    xp: 0,

    xpNeeded: 100,

    inventory: [],

    promoUsed: [],

    quests: [],

    luckyChance: 0,

    vip: false,

    autoClick: false,

    doubleBoost: false,

    luckyBoost: false,

    passiveIncome: false,

    casinoUnlocked: false,

    casesUnlocked: false

};

/* =========================================================
TEMPORARY GAME VARIABLES
========================================================= */

let selectedRouletteColor = null;
let selectedRouletteNumber = null;

let selectedDiceNumber = null;

let ladderActive = false;
let ladderLevel = 0;
let ladderBet = 0;
let ladderMultiplier = 1;

let minesActive = false;
let minesBet = 0;
let minesMultiplier = 1;
let minesRevealed = [];
let minePosition = 0;

let crashActive = false;
let crashBet = 0;
let crashMultiplier = 1;
let crashInterval = null;
let crashCrashPoint = 0;

let caseOpeningInProgress = false;

let currentGame = null;

/* =========================================================
SAVE
========================================================= */

function saveGame() {

    localStorage.setItem(
        "luckyClickSave",
        JSON.stringify(game)
    );

}

/* =========================================================
FORMAT NUMBER
========================================================= */

function formatNumber(number) {

    return Number(number || 0).toLocaleString("ru-RU", {
        maximumFractionDigits: 2
    });

}

/* =========================================================
MESSAGE
========================================================= */

function showMessage(text, type = "success") {

    const message = document.getElementById("gameMessage");

    if (!message) return;

    message.textContent = text;

    message.className =
        "game-message show " + type;

    clearTimeout(window.messageTimer);

    window.messageTimer = setTimeout(() => {

        message.className =
            "game-message";

    }, 2500);

}

/* =========================================================
UPDATE UI
========================================================= */

function updateUI() {

    document.querySelectorAll(".balance").forEach(el => {

        el.textContent =
            formatNumber(game.balance);

    });


    document.querySelectorAll(".click-power").forEach(el => {

        el.textContent =
            formatNumber(game.clickPower);

    });


    document.querySelectorAll(".click-price").forEach(el => {

        el.textContent =
            formatNumber(game.clickPrice) + " 🪙";

    });


    document.querySelectorAll(".total-clicks").forEach(el => {

        el.textContent =
            formatNumber(game.totalClicks);

    });


    document.querySelectorAll(".player-level").forEach(el => {

        el.textContent =
            game.level;

    });


    document.querySelectorAll(".player-xp").forEach(el => {

        el.textContent =
            formatNumber(game.xp);

    });


    document.querySelectorAll(".xp-needed").forEach(el => {

        el.textContent =
            formatNumber(game.xpNeeded);

    });


    const xpProgress =
        document.getElementById("xpProgress");

    if (xpProgress) {

        xpProgress.style.width =
            Math.min(
                100,
                (game.xp / game.xpNeeded) * 100
            ) + "%";

    }


    updateUnlocks();

    updateInventory();

    updateHomeInventory();

    saveGame();

}

/* =========================================================
CLICKER
========================================================= */

function clickCoin() {

    let reward = game.clickPower;

    game.totalClicks++;

    /* DOUBLE BOOST */

    if (game.doubleBoost) {

        reward *= 2;

    }

    /* LUCKY BONUS */

    let luckyChance =
        0.02 + (game.luckyChance / 100);

    if (game.luckyBoost) {

        luckyChance += 0.10;

    }

    if (Math.random() < luckyChance) {

        reward *= 10;

        showMessage(
            "🍀 LUCKY BONUS! ×10",
            "success"
        );

    }

    game.balance += reward;

    addXP(1);

    createClickEffect(
        "+" + formatNumber(reward)
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

    const effect =
        document.createElement("div");

    effect.className =
        "click-effect";

    effect.textContent =
        text + " 🪙";

    effect.style.left =
        (50 + (Math.random() * 30 - 15)) + "%";

    effect.style.top =
        "45%";

    container.appendChild(effect);

    setTimeout(() => {

        effect.remove();

    }, 1000);

}

/* =========================================================
XP / LEVEL
========================================================= */

function addXP(amount) {

    game.xp += amount;

    while (game.xp >= game.xpNeeded) {

        game.xp -= game.xpNeeded;

        game.level++;

        game.xpNeeded =
            Math.floor(
                game.xpNeeded * 1.5
            );

        showMessage(
            "🎉 Новый уровень: " +
            game.level,
            "success"
        );

    }

    updateUnlocks();

}

/* =========================================================
UPGRADE CLICK
========================================================= */

function upgradeClick() {

    if (game.balance < game.clickPrice) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    game.balance -=
        game.clickPrice;

    game.clickPower += 0.5;

    game.clickPrice *= 2;

    showMessage(
        "⚡ Клик улучшен! +" +
        formatNumber(game.clickPower),
        "success"
    );

    updateUI();

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

    if (!page) return;

    page.classList.remove("hidden");

    page.classList.add("active");


    /* CLOSE GAMES */

    document
        .querySelectorAll(".game-screen")
        .forEach(gameScreen => {

            gameScreen.classList.add("hidden");

        });


    if (pageId === "cases") {

        updateUnlocks();

    }


    if (pageId === "casino") {

        updateUnlocks();

    }

}

/* =========================================================
BOTTOM NAV
========================================================= */

function setActiveNav(button) {

    document
        .querySelectorAll(".nav-button")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

}

/* =========================================================
UNLOCKS
========================================================= */

function updateUnlocks() {

    const casesLocked =
        document.getElementById("casesLocked");

    const casesContent =
        document.getElementById("casesContent");


    if (game.level >= 5) {

        if (casesLocked)
            casesLocked.classList.add("hidden");

        if (casesContent)
            casesContent.classList.remove("hidden");

        game.casesUnlocked = true;

    } else {

        if (casesLocked)
            casesLocked.classList.remove("hidden");

        if (casesContent)
            casesContent.classList.add("hidden");

    }


    const casinoLocked =
        document.getElementById("casinoLocked");

    const casinoContent =
        document.getElementById("casinoContent");


    if (game.level >= 7) {

        if (casinoLocked)
            casinoLocked.classList.add("hidden");

        if (casinoContent)
            casinoContent.classList.remove("hidden");

        game.casinoUnlocked = true;

    } else {

        if (casinoLocked)
            casinoLocked.classList.remove("hidden");

        if (casinoContent)
            casinoContent.classList.add("hidden");

    }

}

/* =========================================================
PROMOCODES
========================================================= */

const PROMOCODES = {

    "LUCKY": 1000,

    "WELCOME": 5000,

    "BONUS": 10000,

    "VIP": 50000,

    "LUCKY2026": 100000

};


function activatePromo() {

    const input =
        document.getElementById("promoInput");

    const message =
        document.getElementById("promoMessage");

    if (!input) return;

    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        showPromoMessage(
            "Введите промокод",
            true
        );

        return;

    }


    if (!PROMOCODES[code]) {

        showPromoMessage(
            "❌ Промокод не найден",
            true
        );

        return;

    }


    if (game.promoUsed.includes(code)) {

        showPromoMessage(
            "❌ Этот промокод уже использован",
            true
        );

        return;

    }


    const reward =
        PROMOCODES[code];

    game.balance += reward;

    game.promoUsed.push(code);

    input.value = "";

    showPromoMessage(
        "🎉 Получено " +
        formatNumber(reward) +
        " 🪙",
        false
    );

    updateUI();

}


function showPromoMessage(text, error) {

    const message =
        document.getElementById("promoMessage");

    if (!message) return;

    message.textContent =
        text;

    message.style.color =
        error
            ? "#ff4757"
            : "#53ffad";

}

/* =========================================================
SHOP — BOOSTERS
========================================================= */

function buyBooster(type) {

    if (type === "double") {

        if (!pay(1000)) return;

        game.doubleBoost = true;

        showMessage(
            "⚡ Double Click активирован на 60 секунд"
        );

        setTimeout(() => {

            game.doubleBoost = false;

            showMessage(
                "⚡ Double Click закончился"
            );

        }, 60000);

    }


    if (type === "lucky") {

        if (!pay(2500)) return;

        game.luckyBoost = true;

        showMessage(
            "🍀 Lucky Boost активирован на 60 секунд"
        );

        setTimeout(() => {

            game.luckyBoost = false;

        }, 60000);

    }

    updateUI();

}

/* =========================================================
PASSIVE INCOME
========================================================= */

function buyPassiveIncome() {

    if (game.passiveIncome) {

        showMessage(
            "💰 Автодоход уже куплен",
            "error"
        );

        return;

    }


    if (!pay(10000)) return;

    game.passiveIncome = true;

    showMessage(
        "💰 Автодоход активирован!"
    );

    updateUI();

}

/* =========================================================
SHOP ITEMS
========================================================= */

function buyShopItem(item) {

    const items = {

        megaClick: {
            price: 5000,
            action: () => {
                game.clickPower += 1;
            }
        },

        superClick: {
            price: 25000,
            action: () => {
                game.clickPower += 5;
            }
        },

        luck: {
            price: 15000,
            action: () => {
                game.luckyChance += 5;
            }
        },

        vip: {
            price: 100000,
            action: () => {
                game.vip = true;
            }
        },

        autoClick: {
            price: 50000,
            action: () => {

                if (game.autoClick) {

                    showMessage(
                        "🤖 Автокликер уже куплен",
                        "error"
                    );

                    return false;

                }

                game.autoClick = true;

                startAutoClick();

                return true;

            }
        }

    };


    const selected =
        items[item];

    if (!selected) return;


    if (item === "autoClick" && game.autoClick) {

        showMessage(
            "🤖 Автокликер уже куплен",
            "error"
        );

        return;

    }


    if (!pay(selected.price)) return;


    selected.action();

    showMessage(
        "✅ Покупка успешно совершена!"
    );

    updateUI();

}

/* =========================================================
PAY
========================================================= */

function pay(amount) {

    if (game.balance < amount) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return false;

    }

    game.balance -= amount;

    return true;

}

/* =========================================================
AUTO CLICK
========================================================= */

function startAutoClick() {

    if (!game.autoClick) return;

    setInterval(() => {

        clickCoin();

    }, 1000);

}

/* =========================================================
PASSIVE INCOME
========================================================= */

setInterval(() => {

    if (game.passiveIncome) {

        game.balance += 100;

        updateUI();

    }

}, 600000);

/* =========================================================
CASES
========================================================= */

const CASES = {

    common: {

        price: 5000,

        items: [

            {
                name: "Обычная монета",
                icon: "🪙",
                rarity: "common",
                value: 1000,
                chance: 45
            },

            {
                name: "Серебряный сундук",
                icon: "📦",
                rarity: "common",
                value: 3000,
                chance: 30
            },

            {
                name: "Редкий кристалл",
                icon: "💎",
                rarity: "rare",
                value: 10000,
                chance: 15
            },

            {
                name: "Золотая корона",
                icon: "👑",
                rarity: "legendary",
                value: 50000,
                chance: 8
            },

            {
                name: "Мифический артефакт",
                icon: "🌌",
                rarity: "mythical",
                value: 250000,
                chance: 2
            }

        ]

    },


    rare: {

        price: 25000,

        items: [

            {
                name: "Синий кристалл",
                icon: "💎",
                rarity: "rare",
                value: 15000,
                chance: 40
            },

            {
                name: "Золотой сундук",
                icon: "🧰",
                rarity: "rare",
                value: 30000,
                chance: 30
            },

            {
                name: "Корона",
                icon: "👑",
                rarity: "legendary",
                value: 100000,
                chance: 20
            },

            {
                name: "Алмазный артефакт",
                icon: "💠",
                rarity: "mythical",
                value: 500000,
                chance: 8
            },

            {
                name: "Золотой Lucky",
                icon: "🍀",
                rarity: "legendary",
                value: 1000000,
                chance: 2
            }

        ]

    },


    legendary: {

        price: 100000,

        items: [

            {
                name: "Большой кристалл",
                icon: "💎",
                rarity: "rare",
                value: 50000,
                chance: 30
            },

            {
                name: "Королевская корона",
                icon: "👑",
                rarity: "legendary",
                value: 250000,
                chance: 30
            },

            {
                name: "Золотой Lucky",
                icon: "🍀",
                rarity: "legendary",
                value: 500000,
                chance: 25
            },

            {
                name: "Мифический камень",
                icon: "🔮",
                rarity: "mythical",
                value: 1000000,
                chance: 14
            },

            {
                name: "JACKPOT GEM",
                icon: "💎",
                rarity: "mythical",
                value: 5000000,
                chance: 1
            }

        ]

    },


    mythical: {

        price: 500000,

        items: [

            {
                name: "Мифический кристалл",
                icon: "🔮",
                rarity: "mythical",
                value: 1000000,
                chance: 35
            },

            {
                name: "Космическая корона",
                icon: "👑",
                rarity: "mythical",
                value: 2500000,
                chance: 30
            },

            {
                name: "Lucky Galaxy",
                icon: "🌌",
                rarity: "mythical",
                value: 5000000,
                chance: 20
            },

            {
                name: "Золотой Lucky",
                icon: "🍀",
                rarity: "legendary",
                value: 10000000,
                chance: 14
            },

            {
                name: "ULTRA JACKPOT",
                icon: "💎",
                rarity: "mythical",
                value: 50000000,
                chance: 1
            }

        ]

    }

};

/* =========================================================
RANDOM CASE ITEM
========================================================= */

function getRandomCaseItem(items) {

    const total =
        items.reduce(
            (sum, item) =>
                sum + item.chance,
            0
        );

    let random =
        Math.random() * total;


    for (const item of items) {

        random -= item.chance;

        if (random <= 0) {

            return item;

        }

    }

    return items[0];

}

/* =========================================================
OPEN CASE
========================================================= */

function openCase(type) {

    if (!game.casesUnlocked) {

        showMessage(
            "🔒 Кейсы открываются с 5 уровня",
            "error"
        );

        return;

    }


    if (caseOpeningInProgress) {

        return;

    }


    const caseData =
        CASES[type];

    if (!caseData) return;


    if (!pay(caseData.price)) {

        return;

    }


    caseOpeningInProgress = true;


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


    track.innerHTML = "";

    result.textContent =
        "Прокрутка...";


    modal.classList.add("active");


    /* WINNER */

    const winner =
        getRandomCaseItem(
            caseData.items
        );


    /* CREATE REALISTIC ROLL */

    const rollItems = [];


    for (let i = 0; i < 35; i++) {

        rollItems.push(
            getRandomCaseItem(
                caseData.items
            )
        );

    }


    /* WINNER NEAR END */

    rollItems[30] =
        winner;


    rollItems[31] =
        winner;


    rollItems[32] =
        winner;


    rollItems.forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "case-track-item";

        div.innerHTML = `

            <div>
                ${item.icon}
            </div>

            <span>
                ${item.name}
            </span>

        `;

        track.appendChild(div);

    });


    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0)";


    setTimeout(() => {

        const itemWidth =
            115;

        const target =
            -(30 * itemWidth) +
            120;


        track.style.transition =
            "transform 5s cubic-bezier(.08,.75,.12,1)";

        track.style.transform =
            `translateX(${target}px)`;


    }, 100);


    setTimeout(() => {

        addInventoryItem(
            winner
        );


        result.innerHTML = `

            🎉 Вы выиграли!

            <br>

            <strong>
                ${winner.icon}
                ${winner.name}
            </strong>

            <br>

            💰 Цена продажи:
            ${formatNumber(winner.value)} 🪙

        `;


        caseOpeningInProgress =
            false;


        updateUI();

    }, 5300);

}

/* =========================================================
CLOSE CASE
========================================================= */

function closeCaseOpening() {

    if (caseOpeningInProgress) {

        showMessage(
            "⏳ Дождись окончания прокрутки",
            "error"
        );

        return;

    }


    const modal =
        document.getElementById(
            "caseOpening"
        );

    modal.classList.remove(
        "active"
    );

}

/* =========================================================
INVENTORY
========================================================= */

function addInventoryItem(item) {

    game.inventory.push({

        id:
            Date.now() +
            Math.random(),

        name:
            item.name,

        icon:
            item.icon,

        rarity:
            item.rarity,

        value:
            item.value

    });

    updateInventory();

}

/* =========================================================
UPDATE INVENTORY
========================================================= */

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
            game.inventory.length;

    }


    if (!inventory) return;


    if (
        game.inventory.length === 0
    ) {

        inventory.innerHTML = `

            <div class="empty-inventory">

                🎒

                <p>
                    Инвентарь пуст
                </p>

            </div>

        `;

        return;

    }


    inventory.innerHTML =
        game.inventory
            .map(item => `

                <div
                    class="inventory-item"
                    onclick="showInventoryItem('${item.id}')"
                >

                    <div class="inventory-icon">
                        ${item.icon}
                    </div>

                    <strong>
                        ${item.name}
                    </strong>

                    <small>
                        ${getRarityName(item.rarity)}
                    </small>

                </div>

            `)
            .join("");

}

/* =========================================================
HOME INVENTORY
========================================================= */

function updateHomeInventory() {

    const container =
        document.getElementById(
            "homeInventory"
        );

    if (!container) return;


    if (
        game.inventory.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-inventory">

                🎒

                <p>
                    Открывай кейсы,
                    чтобы получать предметы
                </p>

            </div>

        `;

        return;

    }


    const items =
        game.inventory
            .slice(-4)
            .reverse();


    container.innerHTML =
        items.map(item => `

            <div
                class="inventory-item"
                onclick="showInventoryItem('${item.id}')"
            >

                <div class="inventory-icon">
                    ${item.icon}
                </div>

                <strong>
                    ${item.name}
                </strong>

            </div>

        `)
        .join("");

}

/* =========================================================
INVENTORY ITEM
========================================================= */

function showInventoryItem(id) {

    const item =
        game.inventory.find(
            x => String(x.id) === String(id)
        );


    if (!item) return;


    const sell =
        confirm(

            `${item.icon} ${item.name}\n\n` +

            `Редкость: ${getRarityName(item.rarity)}\n` +

            `Цена продажи: ${formatNumber(item.value)} 🪙\n\n` +

            `Продать предмет?`

        );


    if (!sell) return;


    game.balance +=
        item.value;


    game.inventory =
        game.inventory.filter(
            x =>
                String(x.id) !==
                String(id)
        );


    showMessage(
        "💰 Предмет продан за " +
        formatNumber(item.value) +
        " 🪙"
    );


    updateUI();

}

/* =========================================================
RARITY
========================================================= */

function getRarityName(rarity) {

    const names = {

        common: "Обычный",

        rare: "Редкий",

        legendary: "Легендарный",

        mythical: "Мифический"

    };


    return names[rarity] ||
        "Неизвестный";

}

/* =========================================================
CASINO GAME NAVIGATION
========================================================= */

function openGame(gameId) {

    if (!game.casinoUnlocked) {

        showMessage(
            "🔒 Казино открывается с 7 уровня",
            "error"
        );

        return;

    }


    document
        .querySelectorAll(".game-screen")
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );

        });


    const gameScreen =
        document.getElementById(
            gameId
        );


    if (!gameScreen) return;


    gameScreen.classList.remove(
        "hidden"
    );


    currentGame =
        gameId;

}


function backToCasino() {

    document
        .querySelectorAll(".game-screen")
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );

        });


    currentGame = null;

}

/* =========================================================
SLOT
========================================================= */

const SLOT_SYMBOLS = [

    "🍒",

    "🍋",

    "🍊",

    "🍇",

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


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    const reels = [

        document.getElementById("slot1"),

        document.getElementById("slot2"),

        document.getElementById("slot3")

    ];


    reels.forEach(reel => {

        reel.classList.add(
            "spinning"
        );

    });


    let spins = 0;


    const interval =
        setInterval(() => {

            reels.forEach(reel => {

                reel.textContent =
                    SLOT_SYMBOLS[
                        Math.floor(
                            Math.random() *
                            SLOT_SYMBOLS.length
                        )
                    ];

            });


            spins++;

            if (spins >= 20) {

                clearInterval(interval);


                reels.forEach(reel => {

                    reel.classList.remove(
                        "spinning"
                    );

                });


                const result =
                    [

                        randomSlot(),

                        randomSlot(),

                        randomSlot()

                    ];


                reels.forEach(
                    (reel, index) => {

                        reel.textContent =
                            result[index];

                    }
                );


                finishSlot(
                    result,
                    bet
                );

            }

        }, 100);

}

/* =========================================================
SLOT RANDOM
========================================================= */

function randomSlot() {

    return SLOT_SYMBOLS[
        Math.floor(
            Math.random() *
            SLOT_SYMBOLS.length
        )
    ];

}

/* =========================================================
SLOT RESULT
========================================================= */

function finishSlot(result, bet) {

    let multiplier = 0;


    if (
        result[0] === result[1] &&
        result[1] === result[2]
    ) {

        if (result[0] === "7️⃣") {

            multiplier = 50;

        } else if (
            result[0] === "💎"
        ) {

            multiplier = 25;

        } else {

            multiplier = 10;

        }

    } else if (
        result[0] === result[1] ||
        result[1] === result[2] ||
        result[0] === result[2]
    ) {

        multiplier = 2;

    }


    if (multiplier > 0) {

        const win =
            bet * multiplier;

        game.balance += win;

        showMessage(
            "🎉 Выигрыш " +
            formatNumber(win) +
            " 🪙"
        );

    } else {

        showMessage(
            "😢 Не повезло",
            "error"
        );

    }


    updateUI();

}

/* =========================================================
ROULETTE SELECT COLOR
========================================================= */

function selectRouletteColor(color) {

    selectedRouletteColor =
        color;


    const element =
        document.getElementById(
            "selectedRouletteColor"
        );


    if (!element) return;


    const names = {

        red: "🔴 Красное",

        black: "⚫ Чёрное",

        green: "🟢 Зелёное"

    };


    element.textContent =
        names[color];

}

/* =========================================================
ROULETTE SELECT NUMBER
========================================================= */

function selectRouletteNumber(number) {

    selectedRouletteNumber =
        number;


    const element =
        document.getElementById(
            "selectedRouletteNumber"
        );


    if (element) {

        element.textContent =
            "Выбрано число: " +
            number;

    }

}

/* =========================================================
ROULETTE PLAY
========================================================= */

function playRoulette() {

    const bet =
        Number(
            document.getElementById(
                "rouletteBet"
            )?.value
        );


    if (!bet || bet <= 0) {

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


    if (!pay(bet)) return;


    const wheel =
        document.getElementById(
            "rouletteWheel"
        );


    wheel.classList.add(
        "spinning"
    );


    const result =
        Math.floor(
            Math.random() * 37
        );


    setTimeout(() => {

        wheel.classList.remove(
            "spinning"
        );


        const numberElement =
            document.getElementById(
                "rouletteNumber"
            );


        if (numberElement) {

            numberElement.textContent =
                result;

            numberElement.className =
                "roulette-result " +
                getRouletteColor(result);

        }


        const color =
            getRouletteColor(result);


        let win = 0;


        /* NUMBER BET */

        if (
            selectedRouletteNumber !== null &&
            selectedRouletteNumber === result
        ) {

            win +=
                bet * 35;

        }


        /* COLOR BET */

        if (
            selectedRouletteColor === color
        ) {

            if (color === "green") {

                win +=
                    bet * 14;

            } else {

                win +=
                    bet * 2;

            }

        }


        if (win > 0) {

            game.balance +=
                win;

            showMessage(
                "🎉 Рулетка! Вы выиграли " +
                formatNumber(win) +
                " 🪙"
            );

        } else {

            showMessage(
                "😢 Рулетка: проигрыш",
                "error"
            );

        }


        updateUI();

    }, 4000);

}

/* =========================================================
ROULETTE COLORS
Европейская рулетка
========================================================= */

function getRouletteColor(number) {

    if (number === 0) {

        return "green";

    }


    const redNumbers = [

        1, 3, 5, 7, 9,

        12, 14, 16, 18,

        19, 21, 23, 25,

        27, 30, 32, 34, 36

    ];


    return redNumbers.includes(number)
        ? "red"
        : "black";

}

/* =========================================================
DICE SELECT
========================================================= */

function selectDiceNumber(number) {

    selectedDiceNumber =
        number;


    const element =
        document.getElementById(
            "selectedDiceNumber"
        );


    if (element) {

        element.textContent =
            "Выбрано число: " +
            number;

    }

}

/* =========================================================
DICE
========================================================= */

function playDice() {

    const bet =
        Number(
            document.getElementById(
                "diceBet"
            )?.value
        );


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!selectedDiceNumber) {

        showMessage(
            "Выберите число",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    const dice =
        document.querySelector(
            ".dice-number"
        );


    dice.classList.add(
        "rolling"
    );


    let count = 0;


    const interval =
        setInterval(() => {

            dice.textContent =
                "🎲 " +
                (Math.floor(
                    Math.random() * 6
                ) + 1);


            count++;


            if (count >= 12) {

                clearInterval(interval);

                dice.classList.remove(
                    "rolling"
                );


                const result =
                    Math.floor(
                        Math.random() * 6
                    ) + 1;


                dice.textContent =
                    "🎲 " +
                    result;


                if (
                    result ===
                    selectedDiceNumber
                ) {

                    const win =
                        bet * 6;

                    game.balance +=
                        win;

                    showMessage(
                        "🎉 Вы угадали! +" +
                        formatNumber(win) +
                        " 🪙"
                    );

                } else {

                    showMessage(
                        "😢 Выпало " +
                        result,
                        "error"
                    );

                }


                updateUI();

            }

        }, 100);

}

/* =========================================================
LADDER START
========================================================= */

function startLadder() {

    const bet =
        Number(
            document.getElementById(
                "ladderBet"
            )?.value
        );


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    ladderActive = true;

    ladderLevel = 0;

    ladderBet = bet;

    ladderMultiplier = 1;


    updateLadder();


    showMessage(
        "📈 Лесенка началась!"
    );

}

/* =========================================================
LADDER NEXT
========================================================= */

function ladderNext() {

    if (!ladderActive) {

        showMessage(
            "Сначала начните игру",
            "error"
        );

        return;

    }


    const success =
        Math.random() < 0.65;


    if (!success) {

        ladderActive = false;

        ladderLevel = 0;

        ladderMultiplier = 1;

        showMessage(
            "💥 Вы упали с лесенки!",
            "error"
        );

        updateLadder();

        return;

    }


    ladderLevel++;

    ladderMultiplier *=
        1.5;


    if (ladderLevel >= 10) {

        ladderCashout();

        return;

    }


    updateLadder();


    showMessage(
        "⬆️ Уровень " +
        ladderLevel +
        "!"
    );

}

/* =========================================================
LADDER CASHOUT
========================================================= */

function ladderCashout() {

    if (!ladderActive) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;

    }


    const win =
        ladderBet *
        ladderMultiplier;


    game.balance +=
        win;


    ladderActive = false;


    showMessage(
        "💰 Забрано " +
        formatNumber(win) +
        " 🪙"
    );


    ladderLevel = 0;

    ladderMultiplier = 1;


    updateLadder();

    updateUI();

}

/* =========================================================
UPDATE LADDER
========================================================= */

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
            "Уровень " +
            ladderLevel +
            " / 10";

    }


    if (board) {

        board.innerHTML = "";

        for (
            let i = 10;
            i >= 1;
            i--
        ) {

            const step =
                document.createElement(
                    "div"
                );

            step.className =
                "ladder-step";

            if (
                i <= ladderLevel
            ) {

                step.classList.add(
                    "active"
                );

            }

            step.textContent =
                "Уровень " +
                i +
                " — ×" +
                Math.pow(
                    1.5,
                    i
                ).toFixed(2);

            board.appendChild(
                step
            );

        }

    }

}

/* =========================================================
MINES START
========================================================= */

function startMines() {

    const bet =
        Number(
            document.getElementById(
                "minesBet"
            )?.value
        );


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    minesActive = true;

    minesBet = bet;

    minesMultiplier = 1;

    minesRevealed = [];


    minePosition =
        Math.floor(
            Math.random() * 16
        );


    createMinesBoard();


    updateMines();

}

/* =========================================================
MINES BOARD
========================================================= */

function createMinesBoard() {

    const board =
        document.querySelector(
            ".mines-board"
        );


    if (!board) return;


    board.innerHTML = "";


    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const cell =
            document.createElement(
                "button"
            );


        cell.className =
            "mine-cell";


        cell.textContent =
            "❓";


        cell.onclick =
            () => revealMine(i);


        board.appendChild(
            cell
        );

    }

}

/* =========================================================
REVEAL MINE
========================================================= */

function revealMine(index) {

    if (!minesActive) return;


    if (
        minesRevealed.includes(index)
    ) {

        return;

    }


    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );


    minesRevealed.push(index);


    if (
        index === minePosition
    ) {

        cells[index].textContent =
            "💣";

        cells[index].classList.add(
            "mine-danger"
        );


        minesActive = false;


        showMessage(
            "💥 Мина! Вы проиграли",
            "error"
        );


        return;

    }


    cells[index].textContent =
        "💎";

    cells[index].classList.add(
        "mine-safe"
    );


    minesMultiplier *=
        1.3;


    updateMines();

}

/* =========================================================
MINES UPDATE
========================================================= */

function updateMines() {

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

/* =========================================================
MINES CASHOUT
========================================================= */

function cashoutMines() {

    if (!minesActive) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;

    }


    const win =
        minesBet *
        minesMultiplier;


    game.balance +=
        win;


    minesActive = false;


    showMessage(
        "💰 Выигрыш " +
        formatNumber(win) +
        " 🪙"
    );


    updateUI();

}

/* =========================================================
CRASH START
========================================================= */

function startCrash() {

    if (crashActive) {

        showMessage(
            "Игра уже идёт",
            "error"
        );

        return;

    }


    const bet =
        Number(
            document.getElementById(
                "crashBet"
            )?.value
        );


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    crashActive = true;

    crashBet = bet;

    crashMultiplier = 1;


    crashCrashPoint =
        1.1 +
        Math.random() * 8;


    const multiplier =
        document.getElementById(
            "crashMultiplier"
        );


    const plane =
        document.getElementById(
            "crashPlane"
        );


    let startTime =
        Date.now();


    crashInterval =
        setInterval(() => {

            const elapsed =
                (Date.now() -
                startTime) / 1000;


            crashMultiplier =
                1 +
                elapsed * 0.5 +
                elapsed *
                elapsed *
                0.03;


            if (multiplier) {

                multiplier.textContent =
                    "×" +
                    crashMultiplier.toFixed(2);

            }


            if (plane) {

                plane.style.left =
                    Math.min(
                        90,
                        5 +
                        elapsed * 8
                    ) + "%";

                plane.style.top =
                    Math.max(
                        15,
                        55 -
                        elapsed * 4
                    ) + "%";

            }


            if (
                crashMultiplier >=
                crashCrashPoint
            ) {

                crashEnd();

            }

        }, 100);

}

/* =========================================================
CRASH CASHOUT
========================================================= */

function cashoutCrash() {

    if (!crashActive) {

        showMessage(
            "Нет активной игры",
            "error"
        );

        return;

    }


    const win =
        crashBet *
        crashMultiplier;


    game.balance +=
        win;


    clearInterval(
        crashInterval
    );


    crashActive = false;


    showMessage(
        "✈️ Забрано на ×" +
        crashMultiplier.toFixed(2) +
        "! +" +
        formatNumber(win) +
        " 🪙"
    );


    updateUI();

}

/* =========================================================
CRASH END
========================================================= */

function crashEnd() {

    clearInterval(
        crashInterval
    );


    crashActive = false;


    const multiplier =
        document.getElementById(
            "crashMultiplier"
        );


    if (multiplier) {

        multiplier.textContent =
            "💥 CRASH ×" +
            crashCrashPoint.toFixed(2);

    }


    showMessage(
        "💥 Crash! Вы не успели забрать выигрыш",
        "error"
    );

}

/* =========================================================
JACKPOT
========================================================= */

function playJackpot() {

    const bet =
        Number(
            document.getElementById(
                "jackpotBet"
            )?.value
        );


    if (!bet || bet <= 0) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (!pay(bet)) return;


    const chance =
        Math.random();


    let multiplier = 0;


    if (chance < 0.001) {

        multiplier = 1000;

    } else if (chance < 0.01) {

        multiplier = 100;

    } else if (chance < 0.05) {

        multiplier = 20;

    } else if (chance < 0.2) {

        multiplier = 5;

    } else if (chance < 0.5) {

        multiplier = 2;

    }


    if (multiplier > 0) {

        const win =
            bet * multiplier;


        game.balance +=
            win;


        showMessage(
            "💎 JACKPOT! ×" +
            multiplier +
            " +" +
            formatNumber(win) +
            " 🪙"
        );

    } else {

        showMessage(
            "😢 Jackpot не сработал",
            "error"
        );

    }


    updateUI();

}

/* =========================================================
QUESTS
========================================================= */

function claimQuest(type) {

    if (
        game.quests.includes(type)
    ) {

        showMessage(
            "❌ Награда уже получена",
            "error"
        );

        return;

    }


    let reward = 0;

    let completed = false;


    if (
        type === "firstClick"
    ) {

        completed =
            game.totalClicks >= 1;

        reward = 50;

    }


    if (
        type === "earn100"
    ) {

        completed =
            game.balance >= 100;

        reward = 100;

    }


    if (
        type === "level5"
    ) {

        completed =
            game.level >= 5;

        reward = 1000;

    }


    if (
        type === "casino"
    ) {

        completed =
            game.level >= 7;

        reward = 2500;

    }


    if (!completed) {

        showMessage(
            "❌ Задание ещё не выполнено",
            "error"
        );

        return;

    }


    game.balance +=
        reward;


    game.quests.push(
        type
    );


    showMessage(
        "🎁 Получено " +
        formatNumber(reward) +
        " 🪙"
    );


    updateUI();

}

/* =========================================================
INITIALIZE
========================================================= */

function initializeGame() {

    updateUI();

    updateLadder();

    updateMines();

    /* AUTCLICK */

    if (game.autoClick) {

        startAutoClick();

    }


    /* CASES */

    updateUnlocks();

}

/* =========================================================
START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);