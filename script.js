"use strict";

/* =========================================================
   🍀 LUCKY CLICK — FULL SCRIPT
========================================================= */

const SAVE_KEY = "luckyClick_full_v1";


/* =========================================================
   GAME DATA
========================================================= */

let game = {

    balance: 0,

    level: 1,

    xp: 0,

    clickPower: 0.1,

    clickPrice: 100,

    totalClicks: 0,

    totalEarned: 0,

    doubleClick: false,

    doubleClickUntil: 0,

    luckyBoost: false,

    passiveIncome: false,

    inventory: [],

    quests: {

        firstClick: false,

        earn100: false,

        level5: false,

        casino: false

    },

    rouletteNumber: null,

    rouletteColor: null,

    diceNumber: null,

    ladder: {

        active: false,

        bet: 0,

        level: 0

    },

    mines: {

        active: false,

        bet: 0,

        multiplier: 1,

        opened: [],

        mines: []

    },

    crash: {

        active: false,

        bet: 0,

        multiplier: 1,

        interval: null,

        crashed: false

    }

};


/* =========================================================
   LOAD / SAVE
========================================================= */

function saveGame() {

    try {

        const safeGame = {

            ...game,

            crash: {

                ...game.crash,

                interval: null

            }

        };

        localStorage.setItem(

            SAVE_KEY,

            JSON.stringify(safeGame)

        );

    } catch (error) {

        console.error(
            "Ошибка сохранения:",
            error
        );

    }

}


function loadGame() {

    try {

        const saved =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!saved) return;

        const data =
            JSON.parse(saved);

        game = {

            ...game,

            ...data,

            quests: {

                ...game.quests,

                ...(data.quests || {})

            },

            ladder: {

                ...game.ladder,

                ...(data.ladder || {})

            },

            mines: {

                ...game.mines,

                ...(data.mines || {})

            },

            crash: {

                ...game.crash,

                ...(data.crash || {}),

                interval: null,

                active: false

            }

        };

    } catch (error) {

        console.error(
            "Ошибка загрузки:",
            error
        );

    }

}


/* =========================================================
   HELPERS
========================================================= */

function formatNumber(number) {

    return Number(number).toLocaleString(

        "ru-RU",

        {

            maximumFractionDigits: 2

        }

    );

}


function showMessage(

    text,

    type = "normal"

) {

    const message =
        document.getElementById(
            "gameMessage"
        );

    if (!message) return;

    message.textContent =
        text;

    message.className =
        "game-message " +
        type;

    requestAnimationFrame(() => {

        message.classList.add(
            "show"
        );

    });

    clearTimeout(
        showMessage.timer
    );

    showMessage.timer =
        setTimeout(() => {

            message.classList.remove(
                "show"
            );

        }, 2500);

}


function addCoins(amount) {

    game.balance +=
        Number(amount);

    if (amount > 0) {

        game.totalEarned +=
            Number(amount);

    }

    saveGame();

    updateUI();

}


function removeCoins(amount) {

    amount =
        Number(amount);

    if (

        !Number.isFinite(amount) ||

        amount <= 0

    ) {

        return false;

    }

    if (

        game.balance < amount

    ) {

        return false;

    }

    game.balance -=
        amount;

    saveGame();

    updateUI();

    return true;

}


function getXPNeeded() {

    return (

        100 +

        (game.level - 1) *

        50

    );

}


function addXP(amount) {

    game.xp +=
        Number(amount);

    while (

        game.level < 50 &&

        game.xp >=
        getXPNeeded()

    ) {

        game.xp -=
            getXPNeeded();

        game.level++;

        showMessage(

            "🎉 Новый уровень: " +
            game.level,

            "success"

        );

    }

    saveGame();

    updateUI();

}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add(
                "hidden"
            );

            page.classList.remove(
                "active"
            );

        });


    const page =
        document.getElementById(
            pageId
        );

    if (!page) return;


    page.classList.remove(
        "hidden"
    );

    page.classList.add(
        "active"
    );


    if (pageId === "cases") {

        updateCases();

    }


    if (pageId === "casino") {

        updateCasino();

    }


    if (pageId === "quests") {

        updateQuests();

    }


    if (pageId === "inventoryPage") {

        updateInventory();

    }

}


function setActiveNav(button) {

    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    if (button) {

        button.classList.add(
            "active"
        );

    }

}


function openGame(gameId) {

    if (game.level < 7) {

        showMessage(

            "🔒 Казино открывается с 7 уровня",

            "error"

        );

        return;

    }


    const casinoContent =
        document.getElementById(
            "casinoContent"
        );

    if (casinoContent) {

        casinoContent.classList.add(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );

        });


    const screen =
        document.getElementById(
            gameId
        );

    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }

}


function backToCasino() {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );

        });


    const casinoContent =
        document.getElementById(
            "casinoContent"
        );

    if (casinoContent) {

        casinoContent.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   CLICKER
========================================================= */

function clickCoin() {

    let reward =
        game.clickPower;


    if (

        game.doubleClick &&

        Date.now() <
        game.doubleClickUntil

    ) {

        reward *= 2;

    }


    if (game.luckyBoost) {

        if (
            Math.random() < 0.02
        ) {

            reward *= 10;

            showMessage(

                "🍀 LUCKY BONUS ×10!",

                "success"

            );

        }

    }


    game.balance +=
        reward;

    game.totalEarned +=
        reward;

    game.totalClicks++;


    addXP(1);


    createClickEffect(

        "+" +
        reward.toFixed(1)

    );


    saveGame();

    updateUI();

}


function createClickEffect(text) {

    const container =
        document.getElementById(
            "clickEffects"
        );

    if (!container) return;


    const effect =
        document.createElement(
            "div"
        );

    effect.className =
        "click-effect";

    effect.textContent =
        text +
        " 🪙";


    effect.style.left =

        (35 +
        Math.random() * 30) +

        "%";


    container.appendChild(
        effect
    );


    setTimeout(() => {

        effect.remove();

    }, 1000);

}


/* =========================================================
   UPGRADE
========================================================= */

function upgradeClick() {

    if (

        !removeCoins(
            game.clickPrice
        )

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    game.clickPower =

        Number(

            (

                game.clickPower +

                0.1

            ).toFixed(2)

        );


    game.clickPrice =

        Math.floor(

            game.clickPrice *

            2

        );


    addXP(25);


    showMessage(

        "⚡ Клик улучшен!",

        "success"

    );


    saveGame();

    updateUI();

}


/* =========================================================
   BOOSTERS
========================================================= */

function buyBooster(type) {

    if (type === "double") {

        if (

            !removeCoins(1000)

        ) {

            showMessage(

                "❌ Нужно 1 000 🪙",

                "error"

            );

            return;

        }


        game.doubleClick =
            true;

        game.doubleClickUntil =

            Date.now() +

            60000;


        showMessage(

            "✖️2 активно на 60 секунд!",

            "success"

        );

    }


    if (type === "lucky") {

        if (

            game.luckyBoost

        ) {

            showMessage(

                "🍀 Бустер уже активен",

                "error"

            );

            return;

        }


        if (

            !removeCoins(2500)

        ) {

            showMessage(

                "❌ Нужно 2 500 🪙",

                "error"

            );

            return;

        }


        game.luckyBoost =
            true;


        showMessage(

            "🍀 Lucky Boost активирован!",

            "success"

        );

    }


    saveGame();

    updateUI();

}


/* =========================================================
   PASSIVE INCOME
========================================================= */

function buyPassiveIncome() {

    if (

        game.passiveIncome

    ) {

        showMessage(

            "💰 Автодоход уже активен",

            "error"

        );

        return;

    }


    if (

        !removeCoins(10000)

    ) {

        showMessage(

            "❌ Нужно 10 000 🪙",

            "error"

        );

        return;

    }


    game.passiveIncome =
        true;


    showMessage(

        "💰 Автодоход активирован!",

        "success"

    );


    saveGame();

    updateUI();

}


/* =========================================================
   QUESTS
========================================================= */

function claimQuest(type) {

    if (

        game.quests[type]

    ) {

        showMessage(

            "✅ Награда уже получена",

            "error"

        );

        return;

    }


    let completed =
        false;

    let reward =
        0;


    if (

        type === "firstClick"

    ) {

        completed =
            game.totalClicks >= 1;

        reward =
            50;

    }


    if (

        type === "earn100"

    ) {

        completed =
            game.totalEarned >= 100;

        reward =
            100;

    }


    if (

        type === "level5"

    ) {

        completed =
            game.level >= 5;

        reward =
            1000;

    }


    if (

        type === "casino"

    ) {

        completed =
            game.level >= 7;

        reward =
            2500;

    }


    if (!completed) {

        showMessage(

            "❌ Задание ещё не выполнено",

            "error"

        );

        return;

    }


    game.quests[type] =
        true;


    addCoins(reward);

    addXP(50);


    showMessage(

        "🎁 +" +
        reward +
        " 🪙",

        "success"

    );


    updateQuests();

}


/* =========================================================
   CASES
========================================================= */

const caseSettings = {

    common: {

        price: 5000,

        rewards: [

            {
                name: "🎁 Обычный подарок",
                chance: 60,
                value: 2500
            },

            {
                name: "🪙 Монеты",
                chance: 30,
                value: 7500
            },

            {
                name: "💎 Редкий подарок",
                chance: 9,
                value: 15000
            },

            {
                name: "👑 Легендарный подарок",
                chance: 1,
                value: 50000
            }

        ]

    },


    rare: {

        price: 25000,

        rewards: [

            {
                name: "🪙 Монеты",
                chance: 50,
                value: 15000
            },

            {
                name: "💎 Редкий подарок",
                chance: 35,
                value: 35000
            },

            {
                name: "👑 Легендарный подарок",
                chance: 13,
                value: 100000
            },

            {
                name: "🌌 Мифический подарок",
                chance: 2,
                value: 250000
            }

        ]

    },


    legendary: {

        price: 100000,

        rewards: [

            {
                name: "🪙 Монеты",
                chance: 45,
                value: 50000
            },

            {
                name: "💎 Редкий подарок",
                chance: 30,
                value: 100000
            },

            {
                name: "👑 Легендарный подарок",
                chance: 20,
                value: 250000
            },

            {
                name: "🌌 Мифический подарок",
                chance: 5,
                value: 1000000
            }

        ]

    },


    mythical: {

        price: 500000,

        rewards: [

            {
                name: "🪙 Монеты",
                chance: 50,
                value: 250000
            },

            {
                name: "💎 Редкий подарок",
                chance: 30,
                value: 500000
            },

            {
                name: "👑 Легендарный подарок",
                chance: 15,
                value: 1000000
            },

            {
                name: "🌌 МИФИЧЕСКИЙ ПРИЗ",
                chance: 5,
                value: 5000000
            }

        ]

    }

};


function openCase(type) {

    if (

        game.level < 5

    ) {

        showMessage(

            "🔒 Кейсы открываются с 5 уровня",

            "error"

        );

        return;

    }


    const settings =
        caseSettings[type];

    if (!settings) return;


    if (

        !removeCoins(
            settings.price
        )

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    let random =
        Math.random() *
        100;

    let current =
        0;

    let reward =
        null;


    for (

        const item of
        settings.rewards

    ) {

        current +=
            item.chance;


        if (

            random <= current

        ) {

            reward =
                item;

            break;

        }

    }


    if (!reward) {

        reward =
            settings.rewards[
                settings.rewards.length - 1
            ];

    }


    addCoins(
        reward.value
    );


    game.inventory.push({

        name:
            reward.name,

        value:
            reward.value,

        date:
            new Date()
                .toLocaleDateString(
                    "ru-RU"
                )

    });


    addXP(100);


    const result =
        document.getElementById(
            "caseResult"
        );


    if (result) {

        result.innerHTML =

            "🎉 Ты получил: <b>" +

            reward.name +

            "</b><br><br>+" +

            formatNumber(
                reward.value
            ) +

            " 🪙";

    }


    showMessage(

        "🎁 Кейс открыт!",

        "success"

    );


    saveGame();

    updateUI();

}


/* =========================================================
   CASINO LOCK
========================================================= */

function updateCasino() {

    const locked =
        document.getElementById(
            "casinoLocked"
        );

    const content =
        document.getElementById(
            "casinoContent"
        );


    if (

        game.level >= 7

    ) {

        locked?.classList.add(
            "hidden"
        );

        content?.classList.remove(
            "hidden"
        );

    } else {

        locked?.classList.remove(
            "hidden"
        );

        content?.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   CASE LOCK
========================================================= */

function updateCases() {

    const locked =
        document.getElementById(
            "casesLocked"
        );

    const content =
        document.getElementById(
            "casesContent"
        );


    if (

        game.level >= 5

    ) {

        locked?.classList.add(
            "hidden"
        );

        content?.classList.remove(
            "hidden"
        );

    } else {

        locked?.classList.remove(
            "hidden"
        );

        content?.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   SLOT
========================================================= */

function playSlot() {

    const bet =
        Number(

            document
                .getElementById(
                    "slotBet"
                )
                ?.value

        );


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

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    const symbols = [

        "🍒",

        "🍋",

        "🍊",

        "🍇",

        "🍀",

        "💎",

        "7️⃣"

    ];


    let spins =
        0;


    const interval =

        setInterval(() => {

            [

                "slot1",

                "slot2",

                "slot3"

            ].forEach(id => {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.textContent =

                        symbols[

                            Math.floor(

                                Math.random() *

                                symbols.length

                            )

                        ];

                }

            });


            spins++;


            if (

                spins >= 15

            ) {

                clearInterval(
                    interval
                );

                finishSlot(
                    bet
                );

            }

        }, 100);

}


function finishSlot(bet) {

    const a =
        document.getElementById(
            "slot1"
        )?.textContent;

    const b =
        document.getElementById(
            "slot2"
        )?.textContent;

    const c =
        document.getElementById(
            "slot3"
        )?.textContent;


    let multiplier =
        0;


    if (

        a === b &&
        b === c

    ) {

        if (a === "7️⃣") {

            multiplier =
                20;

        } else if (
            a === "💎"
        ) {

            multiplier =
                15;

        } else if (
            a === "🍀"
        ) {

            multiplier =
                10;

        } else {

            multiplier =
                5;

        }

    } else if (

        a === b ||
        b === c ||
        a === c

    ) {

        multiplier =
            2;

    }


    if (

        multiplier > 0

    ) {

        const win =
            bet *
            multiplier;


        addCoins(win);

        addXP(50);


        showMessage(

            "🎉 Выигрыш ×" +
            multiplier +
            "! +" +
            formatNumber(win) +
            " 🪙",

            "success"

        );

    } else {

        showMessage(

            "😢 Не повезло",

            "error"

        );

    }

}


/* =========================================================
   ROULETTE
========================================================= */

function selectRouletteNumber(number) {

    game.rouletteNumber =
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


function selectRouletteColor(color) {

    game.rouletteColor =
        color;


    const names = {

        red:
            "🔴 Красное",

        black:
            "⚫ Чёрное",

        green:
            "🟢 Зелёное"

    };


    const element =
        document.getElementById(
            "selectedRouletteColor"
        );


    if (element) {

        element.textContent =

            "Выбран цвет: " +
            names[color];

    }

}


function getRouletteColor(number) {

    if (number === 0) {

        return "green";

    }


    const redNumbers = [

        1, 3, 5, 7, 9,

        12, 14, 16, 18,

        19, 21, 23, 25, 27,

        30, 32, 34, 36

    ];


    return redNumbers.includes(
        number
    )
        ? "red"
        : "black";

}


function playRoulette() {

    const bet =
        Number(

            document
                .getElementById(
                    "rouletteBet"
                )
                ?.value

        );


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

        game.rouletteNumber === null &&

        !game.rouletteColor

    ) {

        showMessage(

            "Выберите число или цвет",

            "error"

        );

        return;

    }


    if (

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    const result =

        Math.floor(

            Math.random() *

            37

        );


    const color =
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

    }


    let multiplier =
        0;


    if (

        game.rouletteNumber !== null &&

        game.rouletteNumber === result

    ) {

        multiplier =
            36;

    }


    if (

        game.rouletteColor === color

    ) {

        multiplier =

            Math.max(

                multiplier,

                color === "green"

                    ? 14

                    : 2

            );

    }


    if (

        multiplier > 0

    ) {

        const win =
            bet *
            multiplier;


        addCoins(win);

        addXP(50);


        showMessage(

            "🎉 Выпало " +
            result +
            "! +" +
            formatNumber(win) +
            " 🪙",

            "success"

        );

    } else {

        showMessage(

            "😢 Выпало " +
            result +
            ". Проигрыш",

            "error"

        );

    }

}


/* =========================================================
   DICE
========================================================= */

function selectDiceNumber(number) {

    game.diceNumber =
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


function playDice() {

    const bet =
        Number(

            document
                .getElementById(
                    "diceBet"
                )
                ?.value

        );


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

        !game.diceNumber

    ) {

        showMessage(

            "Выберите число",

            "error"

        );

        return;

    }


    if (

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    const result =

        Math.floor(

            Math.random() *

            6

        ) + 1;


    const dice =
        document.querySelector(
            ".dice-number"
        );


    if (dice) {

        dice.textContent =

            "🎲 " +
            result;

    }


    if (

        result ===
        game.diceNumber

    ) {

        const win =
            bet * 5;


        addCoins(win);

        addXP(40);


        showMessage(

            "🎉 Угадал! +" +
            win +
            " 🪙",

            "success"

        );

    } else {

        showMessage(

            "😢 Выпало " +
            result,

            "error"

        );

    }

}


/* =========================================================
   LADDER
========================================================= */

const ladderMultipliers = [

    1.00,

    1.35,

    1.70,

    2.05,

    2.40,

    2.75,

    3.10,

    3.45,

    3.80,

    4.15,

    4.50

];


function startLadder() {

    const bet =
        Number(

            document
                .getElementById(
                    "ladderBet"
                )
                ?.value

        );


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

        game.ladder.active

    ) {

        showMessage(

            "Игра уже начата",

            "error"

        );

        return;

    }


    if (

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    game.ladder = {

        active:
            true,

        bet:
            bet,

        level:
            0

    };


    updateLadder();

}


function ladderNext() {

    if (

        !game.ladder.active

    ) {

        showMessage(

            "Сначала начните игру",

            "error"

        );

        return;

    }


    const chance =

        Math.max(

            0.45,

            0.82 -

            game.ladder.level *

            0.035

        );


    if (

        Math.random() >
        chance

    ) {

        game.ladder.active =
            false;

        game.ladder.bet =
            0;

        game.ladder.level =
            0;


        updateLadder();


        showMessage(

            "💥 Ты проиграл!",

            "error"

        );

        return;

    }


    game.ladder.level++;


    updateLadder();


    showMessage(

        "⬆️ Уровень " +
        game.ladder.level,

        "success"

    );


    if (

        game.ladder.level >= 10

    ) {

        ladderCashout();

    }

}


function ladderCashout() {

    if (

        !game.ladder.active ||

        game.ladder.level <= 0

    ) {

        showMessage(

            "❌ Нечего забирать",

            "error"

        );

        return;

    }


    const multiplier =

        ladderMultipliers[

            game.ladder.level

        ];


    const win =

        Math.floor(

            game.ladder.bet *

            multiplier

        );


    addCoins(win);

    addXP(

        game.ladder.level *

        20

    );


    game.ladder = {

        active:
            false,

        bet:
            0,

        level:
            0

    };


    updateLadder();


    showMessage(

        "💰 Забрано " +
        formatNumber(win) +
        " 🪙",

        "success"

    );

}


function updateLadder() {

    const level =
        document.getElementById(
            "ladderLevel"
        );

    const multiplier =
        document.getElementById(
            "ladderMultiplier"
        );


    if (level) {

        level.textContent =

            "Уровень " +

            game.ladder.level +

            " / 10";

    }


    if (multiplier) {

        multiplier.textContent =

            "×" +

            ladderMultipliers[

                game.ladder.level

            ].toFixed(2);

    }

}


/* =========================================================
   MINES
========================================================= */

function startMines() {

    const bet =
        Number(

            document
                .getElementById(
                    "minesBet"
                )
                ?.value

        );


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

        game.mines.active

    ) {

        showMessage(

            "Игра уже идёт",

            "error"

        );

        return;

    }


    if (

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    const mines = [];


    while (

        mines.length < 4

    ) {

        const position =

            Math.floor(

                Math.random() *

                16

            );


        if (

            !mines.includes(
                position
            )

        ) {

            mines.push(
                position
            );

        }

    }


    game.mines = {

        active:
            true,

        bet:
            bet,

        multiplier:
            1,

        opened:
            [],

        mines:
            mines

    };


    createMinesBoard();

    updateMines();

}


function createMinesBoard() {

    const board =
        document.querySelector(
            ".mines-board"
        );


    if (!board) return;


    board.innerHTML =
        "";


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

            () =>
                openMineCell(i);


        board.appendChild(
            button
        );

    }

}


function openMineCell(index) {

    if (

        !game.mines.active

    ) return;


    if (

        game.mines.opened.includes(
            index
        )

    ) return;


    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );


    game.mines.opened.push(
        index
    );


    if (

        game.mines.mines.includes(
            index
        )

    ) {

        cells[index].textContent =
            "💣";


        game.mines.mines.forEach(
            mine => {

                cells[mine]
                    .textContent =
                    "💣";

            }
        );


        game.mines.active =
            false;


        showMessage(

            "💥 БУМ! Ты проиграл",

            "error"

        );

        return;

    }


    cells[index].textContent =
        "💎";


    game.mines.multiplier =

        Number(

            (

                game.mines.multiplier +

                0.25

            ).toFixed(2)

        );


    updateMines();


    showMessage(

        "💎 Отлично! ×" +
        game.mines.multiplier,

        "success"

    );

}


function cashoutMines() {

    if (

        !game.mines.active

    ) {

        showMessage(

            "❌ Нет активной игры",

            "error"

        );

        return;

    }


    if (

        game.mines.opened.length === 0

    ) {

        showMessage(

            "Открой клетку",

            "error"

        );

        return;

    }


    const win =

        Math.floor(

            game.mines.bet *

            game.mines.multiplier

        );


    addCoins(win);


    game.mines.active =
        false;


    showMessage(

        "💰 Забрано " +
        formatNumber(win) +
        " 🪙",

        "success"

    );

}


function updateMines() {

    const element =
        document.getElementById(
            "minesMultiplier"
        );


    if (element) {

        element.textContent =

            "×" +

            game.mines.multiplier
                .toFixed(2);

    }

}


/* =========================================================
   CRASH
========================================================= */

function startCrash() {

    if (

        game.crash.active

    ) {

        showMessage(

            "✈️ Самолёт уже летит",

            "error"

        );

        return;

    }


    const bet =
        Number(

            document
                .getElementById(
                    "crashBet"
                )
                ?.value

        );


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

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    game.crash = {

        active:
            true,

        bet:
            bet,

        multiplier:
            1,

        interval:
            null,

        crashed:
            false

    };


    const crashPoint =

        1.2 +

        Math.random() *

        8;


    game.crash.interval =

        setInterval(() => {

            game.crash.multiplier +=
                0.05;


            updateCrash();


            if (

                game.crash.multiplier >=
                crashPoint

            ) {

                crashGame();

            }

        }, 100);

}


function crashGame() {

    clearInterval(

        game.crash.interval

    );


    game.crash.active =
        false;

    game.crash.crashed =
        true;


    showMessage(

        "💥 CRASH! ×" +

        game.crash.multiplier
            .toFixed(2),

        "error"

    );


    updateCrash();

}


function cashoutCrash() {

    if (

        !game.crash.active

    ) {

        showMessage(

            "❌ Самолёт уже разбился",

            "error"

        );

        return;

    }


    clearInterval(

        game.crash.interval

    );


    const win =

        Math.floor(

            game.crash.bet *

            game.crash.multiplier

        );


    addCoins(win);

    addXP(50);


    game.crash.active =
        false;


    showMessage(

        "✈️ Забрано " +
        formatNumber(win) +
        " 🪙",

        "success"

    );


    updateCrash();

}


function updateCrash() {

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

            game.crash.multiplier
                .toFixed(2);

    }


    if (plane) {

        plane.style.left =

            Math.min(

                game.crash.multiplier *

                5,

                90

            ) +

            "%";

    }

}


/* =========================================================
   JACKPOT
========================================================= */

function playJackpot() {

    const bet =
        Number(

            document
                .getElementById(
                    "jackpotBet"
                )
                ?.value

        );


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

        !removeCoins(bet)

    ) {

        showMessage(

            "❌ Недостаточно монет",

            "error"

        );

        return;

    }


    const random =
        Math.random();


    let multiplier =
        0;


    if (random < 0.01) {

        multiplier =
            100;

    } else if (
        random < 0.05
    ) {

        multiplier =
            25;

    } else if (
        random < 0.15
    ) {

        multiplier =
            10;

    } else if (
        random < 0.35
    ) {

        multiplier =
            3;

    }


    if (

        multiplier > 0

    ) {

        const win =
            bet *
            multiplier;


        addCoins(win);

        addXP(100);


        showMessage(

            "💎 ДЖЕКПОТ ×" +
            multiplier +
            "! +" +
            formatNumber(win) +
            " 🪙",

            "success"

        );

    } else {

        showMessage(

            "😢 Джекпот не выпал",

            "error"

        );

    }

}


/* =========================================================
   INVENTORY
========================================================= */

function updateInventory() {

    const inventory =
        document.getElementById(
            "inventory"
        );


    if (!inventory) return;


    document
        .querySelectorAll(
            ".inventory-count"
        )
        .forEach(element => {

            element.textContent =
                game.inventory.length;

        });


    if (

        game.inventory.length === 0

    ) {

        inventory.innerHTML =

            "<p>🎒 Коллекция пока пуста</p>";

        return;

    }


    inventory.innerHTML =

        game.inventory
            .slice()
            .reverse()
            .map(item => `

                <div class="inventory-item">

                    <div>
                        ${item.name}
                    </div>

                    <small>
                        ${item.date}
                    </small>

                    <strong>
                        ${formatNumber(item.value)}
                        🪙
                    </strong>

                </div>

            `)
            .join("");

}


/* =========================================================
   QUESTS
========================================================= */

function updateQuests() {

    const list =
        document.getElementById(
            "questsList"
        );


    if (!list) return;


    const progress =
        list.querySelectorAll(
            ".quest-progress"
        );


    if (progress[0]) {

        progress[0].textContent =

            game.totalClicks >= 1

                ? "1 / 1"

                : "0 / 1";

    }


    if (progress[1]) {

        progress[1].textContent =

            Math.min(

                Math.floor(
                    game.totalEarned
                ),

                100

            ) +

            " / 100";

    }


    const types = [

        "firstClick",

        "earn100",

        "level5",

        "casino"

    ];


    const buttons =
        list.querySelectorAll(
            ".quest-card button"
        );


    buttons.forEach(

        (button, index) => {

            const type =
                types[index];


            if (

                game.quests[type]

            ) {

                button.textContent =
                    "✅ Получено";

                button.disabled =
                    true;

            }

        }

    );

}


/* =========================================================
   UI
========================================================= */

function updateUI() {

    document
        .querySelectorAll(
            ".balance"
        )
        .forEach(element => {

            element.textContent =

                formatNumber(
                    game.balance
                );

        });


    document
        .querySelectorAll(
            ".player-level"
        )
        .forEach(element => {

            element.textContent =
                game.level;

        });


    document
        .querySelectorAll(
            ".player-xp"
        )
        .forEach(element => {

            element.textContent =

                Math.floor(
                    game.xp
                );

        });


    document
        .querySelectorAll(
            ".xp-needed"
        )
        .forEach(element => {

            element.textContent =

                getXPNeeded();

        });


    document
        .querySelectorAll(
            ".total-clicks"
        )
        .forEach(element => {

            element.textContent =

                game.totalClicks;

        });


    document
        .querySelectorAll(
            ".click-power"
        )
        .forEach(element => {

            element.textContent =

                Number(
                    game.clickPower
                ).toFixed(1);

        });


    document
        .querySelectorAll(
            ".click-price"
        )
        .forEach(element => {

            element.textContent =

                formatNumber(
                    game.clickPrice
                ) +

                " 🪙";

        });


    const xpProgress =
        document.getElementById(
            "xpProgress"
        );


    if (xpProgress) {

        xpProgress.style.width =

            Math.min(

                (

                    game.xp /

                    getXPNeeded()

                ) * 100,

                100

            ) +

            "%";

    }


    updateCases();

    updateCasino();

    updateQuests();

    updateInventory();

    updateLadder();

    updateMines();

    updateCrash();

}


/* =========================================================
   PASSIVE INCOME
========================================================= */

setInterval(() => {

    if (

        game.passiveIncome

    ) {

        addCoins(100);

        showMessage(

            "💰 Автодоход: +100 🪙",

            "success"

        );

    }

}, 600000);


/* =========================================================
   BOOSTER TIMER
========================================================= */

setInterval(() => {

    if (

        game.doubleClick &&

        Date.now() >=
        game.doubleClickUntil

    ) {

        game.doubleClick =
            false;

        game.doubleClickUntil =
            0;

        saveGame();

        updateUI();

    }

}, 1000);


/* =========================================================
   TELEGRAM MINI APP
========================================================= */

function initTelegram() {

    if (

        window.Telegram &&

        window.Telegram.WebApp

    ) {

        const tg =
            window.Telegram.WebApp;


        tg.ready();

        tg.expand();


        if (

            tg.setHeaderColor

        ) {

            tg.setHeaderColor(
                "#080b12"
            );

        }


        if (

            tg.setBackgroundColor

        ) {

            tg.setBackgroundColor(
                "#080b12"
            );

        }

    }

}


/* =========================================================
   START
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadGame();

        initTelegram();

        updateUI();

        openPage(
            "home"
        );

    }

);