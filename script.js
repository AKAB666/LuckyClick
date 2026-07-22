"use strict";

/* =========================================================
   🍀 LUCKY CLICK — SCRIPT.JS
   Telegram Mini App
   ========================================================= */

const SAVE_KEY = "lucky_click_save_v3";

/* =========================================================
   💾 СОСТОЯНИЕ ИГРЫ
   ========================================================= */

let game = {
    balance: 0,
    level: 1,
    xp: 0,

    clickPower: 0.5,
    clickPrice: 100,
    totalClicks: 0,
    totalEarned: 0,

    doubleClickUntil: 0,
    luckyBoost: false,
    passiveIncome: false,

    rouletteColor: null,
    rouletteNumber: null,
    diceNumber: null,

    promoUsed: [],

    inventory: [],

    quests: {
        firstClick: false,
        earn100: false,
        level5: false,
        casino: false
    },

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
        crashPoint: 0,
        interval: null
    }
};


/* =========================================================
   💾 СОХРАНЕНИЕ
   ========================================================= */

function saveGame() {
    try {
        const data = {
            ...game,
            crash: {
                active: false,
                bet: 0,
                multiplier: 1,
                crashPoint: 0,
                interval: null
            }
        };

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {
        console.error("Ошибка сохранения:", error);
    }
}


/* =========================================================
   📥 ЗАГРУЗКА
   ========================================================= */

function loadGame() {

    try {

        const saved =
            localStorage.getItem(SAVE_KEY);

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
                active: false,
                interval: null
            }
        };

    } catch (error) {

        console.error(
            "Ошибка загрузки игры:",
            error
        );

    }

}


/* =========================================================
   🔢 ФОРМАТ ЧИСЕЛ
   ========================================================= */

function formatNumber(number) {

    return Number(number).toLocaleString(
        "ru-RU",
        {
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   💬 СООБЩЕНИЯ
   ========================================================= */

function showMessage(
    text,
    type = "normal"
) {

    let message =
        document.getElementById(
            "gameMessage"
        );

    if (!message) {

        message =
            document.createElement(
                "div"
            );

        message.id =
            "gameMessage";

        message.className =
            "game-message";

        document.body.appendChild(
            message
        );

    }

    message.textContent =
        text;

    message.className =
        "game-message " +
        type +
        " show";

    clearTimeout(
        window.messageTimer
    );

    window.messageTimer =
        setTimeout(
            () => {

                message.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   🪙 МОНЕТЫ
   ========================================================= */

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


/* =========================================================
   ⭐ XP И УРОВЕНЬ
   ========================================================= */

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
   🧭 НАВИГАЦИЯ
   ========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.add(
                    "hidden"
                );

                page.classList.remove(
                    "active"
                );

            }
        );


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


    updateUI();

}


function openGame(gameId) {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            screen => {

                screen.classList.add(
                    "hidden"
                );

            }
        );


    const casino =
        document.getElementById(
            "casinoContent"
        );

    if (casino) {

        casino.classList.add(
            "hidden"
        );

    }


    const gameScreen =
        document.getElementById(
            gameId
        );

    if (gameScreen) {

        gameScreen.classList.remove(
            "hidden"
        );

    }

}


function backToCasino() {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            screen => {

                screen.classList.add(
                    "hidden"
                );

            }
        );


    const casino =
        document.getElementById(
            "casinoContent"
        );

    if (casino) {

        casino.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   🪙 КЛИКЕР
   ========================================================= */

function clickCoin() {

    let reward =
        game.clickPower;


    if (
        Date.now() <
        game.doubleClickUntil
    ) {

        reward *= 2;

    }


    if (
        game.luckyBoost &&
        Math.random() < 0.05
    ) {

        reward *= 5;

        showMessage(
            "🍀 Счастливый клик ×5!",
            "success"
        );

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
        (
            35 +
            Math.random() *
            30
        ) +
        "%";


    container.appendChild(
        effect
    );


    setTimeout(
        () => {

            effect.remove();

        },
        1000
    );

}


/* =========================================================
   ⚡ УЛУЧШЕНИЕ КЛИКА
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
   🚀 БУСТЕР ×2
   ========================================================= */

function buyDoubleClick() {

    if (
        !removeCoins(1000)
    ) {

        showMessage(
            "❌ Нужно 1 000 🪙",
            "error"
        );

        return;

    }


    game.doubleClickUntil =
        Date.now() +
        60000;


    showMessage(
        "🚀 ×2 на 60 секунд!",
        "success"
    );


    saveGame();

}


/* =========================================================
   🍀 БУСТЕР УДАЧИ
   ========================================================= */

function buyLuckyBoost() {

    if (
        game.luckyBoost
    ) {

        showMessage(
            "🍀 Бустер уже активирован",
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
        "🍀 Удача увеличена!",
        "success"
    );


    saveGame();

}


/* =========================================================
   💰 ПАССИВНЫЙ ДОХОД
   ========================================================= */

function buyPassiveIncome() {

    if (
        game.passiveIncome
    ) {

        showMessage(
            "💰 Автодоход уже куплен",
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

}


/* =========================================================
   🎁 КЕЙСЫ
   ========================================================= */

const cases = {

    common: {
        price: 5000,
        name: "Обычный кейс",
        rewards: [
            [2500, 60],
            [7500, 30],
            [15000, 9],
            [50000, 1]
        ]
    },

    rare: {
        price: 25000,
        name: "Редкий кейс",
        rewards: [
            [15000, 50],
            [35000, 35],
            [100000, 13],
            [250000, 2]
        ]
    },

    legendary: {
        price: 100000,
        name: "Легендарный кейс",
        rewards: [
            [50000, 45],
            [100000, 30],
            [250000, 20],
            [1000000, 5]
        ]
    },

    mythical: {
        price: 500000,
        name: "Мифический кейс",
        rewards: [
            [250000, 50],
            [500000, 30],
            [1000000, 15],
            [5000000, 5]
        ]
    }

};


function openCase(type) {

    const box =
        cases[type];

    if (!box) return;


    if (
        game.level < 5
    ) {

        showMessage(
            "🔒 Кейсы открываются с 5 уровня",
            "error"
        );

        return;

    }


    if (
        !removeCoins(
            box.price
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

    let reward = 0;


    for (
        const item of box.rewards
    ) {

        random -=
            item[1];

        if (
            random <= 0
        ) {

            reward =
                item[0];

            break;

        }

    }


    addCoins(
        reward
    );

    addXP(100);


    game.inventory.push({

        type: box.name,

        reward: reward,

        date:
            new Date()
                .toLocaleDateString(
                    "ru-RU"
                )

    });


    showMessage(
        "🎁 " +
        box.name +
        ": +" +
        formatNumber(
            reward
        ) +
        " 🪙",
        "success"
    );


    saveGame();

    updateUI();

}


/* =========================================================
   🎰 СЛОТ
   ========================================================= */

function playSlot() {

    const input =
        document.getElementById(
            "slotBet"
        );

    const bet =
        Number(
            input?.value
        );


    if (
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


    const result = [

        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ],

        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ],

        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ]

    ];


    const slots = [

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


    slots.forEach(
        (
            slot,
            index
        ) => {

            if (slot) {

                slot.textContent =
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

        multiplier = 5;


        if (
            result[0] === "7️⃣"
        ) {

            multiplier = 20;

        }

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


    if (
        multiplier
    ) {

        const win =
            bet *
            multiplier;

        addCoins(win);

        showMessage(
            "🎰 Выигрыш ×" +
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
   🎡 РУЛЕТКА
   ========================================================= */

function selectRouletteColor(
    color
) {

    game.rouletteColor =
        color;


    showMessage(
        "Выбрано: " +
        color,
        "success"
    );

}


function selectRouletteNumber(
    number
) {

    game.rouletteNumber =
        Number(number);


    showMessage(
        "Выбрано число: " +
        number,
        "success"
    );

}


function getRouletteColor(
    number
) {

    if (
        number === 0
    ) {

        return "green";

    }


    const red = [

        1, 3, 5, 7, 9,

        12, 14, 16, 18,

        19, 21, 23, 25, 27,

        30, 32, 34, 36

    ];


    return red.includes(
        number
    )
        ? "red"
        : "black";

}


function playRoulette() {

    const bet =
        Number(
            document.getElementById(
                "rouletteBet"
            )?.value
        );


    if (
        bet <= 0
    ) {

        showMessage(
            "Введите ставку",
            "error"
        );

        return;

    }


    if (
        game.rouletteColor === null &&
        game.rouletteNumber === null
    ) {

        showMessage(
            "Выберите цвет или число",
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


    const number =
        Math.floor(
            Math.random() *
            37
        );


    const color =
        getRouletteColor(
            number
        );


    const result =
        document.getElementById(
            "rouletteNumber"
        );


    if (result) {

        result.textContent =
            number;

    }


    let multiplier = 0;


    if (
        game.rouletteNumber !== null &&
        game.rouletteNumber === number
    ) {

        multiplier = 36;

    }


    if (
        game.rouletteColor === color
    ) {

        multiplier =
            color === "green"
                ? 14
                : Math.max(
                    multiplier,
                    2
                );

    }


    if (
        multiplier > 0
    ) {

        const win =
            bet *
            multiplier;

        addCoins(win);

        showMessage(
            "🎡 Выпало " +
            number +
            "! +" +
            formatNumber(win) +
            " 🪙",
            "success"
        );

    } else {

        showMessage(
            "😢 Выпало " +
            number +
            ". Проигрыш",
            "error"
        );

    }


    game.rouletteColor =
        null;

    game.rouletteNumber =
        null;

}


/* =========================================================
   🎲 КУБИК
   ========================================================= */

function selectDiceNumber(
    number
) {

    game.diceNumber =
        Number(number);

}


function playDice() {

    const bet =
        Number(
            document.getElementById(
                "diceBet"
            )?.value
        );


    if (
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
            "Выберите число 1–6",
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
        ) +
        1;


    const element =
        document.querySelector(
            ".dice-number"
        );


    if (element) {

        element.textContent =
            "🎲 " +
            result;

    }


    if (
        result ===
        game.diceNumber
    ) {

        const win =
            bet *
            5;

        addCoins(win);

        showMessage(
            "🎉 Угадал! +" +
            formatNumber(win) +
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


    game.diceNumber =
        null;

}


/* =========================================================
   📈 ЛЕСЕНКА
   ========================================================= */

const ladderMultipliers = [

    1,
    1.35,
    1.7,
    2.05,
    2.4,
    2.75,
    3.1,
    3.45,
    3.8,
    4.15,
    4.5

];


function startLadder() {

    const bet =
        Number(
            document.getElementById(
                "ladderBet"
            )?.value
        );


    if (
        bet <= 0 ||
        !removeCoins(bet)
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }


    game.ladder = {

        active: true,

        bet: bet,

        level: 0

    };


    updateLadder();

}


function ladderNext() {

    if (
        !game.ladder.active
    ) return;


    const chance =
        0.82 -
        game.ladder.level *
        0.035;


    if (
        Math.random() >
        chance
    ) {

        game.ladder.active =
            false;

        game.ladder.level =
            0;

        showMessage(
            "💥 Лесенка проиграна!",
            "error"
        );

        updateLadder();

        return;

    }


    game.ladder.level++;


    updateLadder();


    if (
        game.ladder.level >= 10
    ) {

        ladderCashout();

    }

}


function ladderCashout() {

    if (
        !game.ladder.active ||
        game.ladder.level === 0
    ) return;


    const win =
        Math.floor(
            game.ladder.bet *
            ladderMultipliers[
                game.ladder.level
            ]
        );


    addCoins(win);


    game.ladder.active =
        false;

    game.ladder.level =
        0;

    game.ladder.bet =
        0;


    showMessage(
        "💰 Забрано " +
        formatNumber(win) +
        " 🪙",
        "success"
    );


    updateLadder();

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
   💣 МИНЁР
   ========================================================= */

function startMines() {

    const bet =
        Number(
            document.getElementById(
                "minesBet"
            )?.value
        );


    if (
        bet <= 0 ||
        !removeCoins(bet)
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }


    const mines = [];


    while (
        mines.length < 4
    ) {

        const random =
            Math.floor(
                Math.random() *
                16
            );


        if (
            !mines.includes(
                random
            )
        ) {

            mines.push(
                random
            );

        }

    }


    game.mines = {

        active: true,

        bet: bet,

        multiplier: 1,

        opened: [],

        mines: mines

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
            () => openMineCell(i);


        board.appendChild(
            cell
        );

    }

}


function openMineCell(index) {

    if (
        !game.mines.active ||
        game.mines.opened.includes(
            index
        )
    ) return;


    game.mines.opened.push(
        index
    );


    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );


    if (
        game.mines.mines.includes(
            index
        )
    ) {

        cells[index].textContent =
            "💣";


        game.mines.active =
            false;


        game.mines.mines.forEach(
            mine => {

                cells[mine]
                    .textContent =
                    "💣";

            }
        );


        showMessage(
            "💥 БУМ!",
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

}


function cashoutMines() {

    if (
        !game.mines.active ||
        game.mines.opened.length === 0
    ) {

        showMessage(
            "❌ Нечего забирать",
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
        "💰 +" +
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
   ✈️ CRASH
   ========================================================= */

function startCrash() {

    if (
        game.crash.active
    ) return;


    const bet =
        Number(
            document.getElementById(
                "crashBet"
            )?.value
        );


    if (
        bet <= 0 ||
        !removeCoins(bet)
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }


    game.crash.active =
        true;

    game.crash.bet =
        bet;

    game.crash.multiplier =
        1;

    game.crash.crashPoint =
        1.2 +
        Math.random() *
        8;


    game.crash.interval =
        setInterval(
            () => {

                game.crash.multiplier +=
                    0.05;

                updateCrash();


                if (
                    game.crash.multiplier >=
                    game.crash.crashPoint
                ) {

                    crashGame();

                }

            },
            100
        );

}


function crashGame() {

    clearInterval(
        game.crash.interval
    );


    game.crash.active =
        false;


    showMessage(
        "💥 CRASH ×" +
        game.crash.multiplier
            .toFixed(2),
        "error"
    );


    updateCrash();

}


function cashoutCrash() {

    if (
        !game.crash.active
    ) return;


    clearInterval(
        game.crash.interval
    );


    const win =
        Math.floor(
            game.crash.bet *
            game.crash.multiplier
        );


    addCoins(win);


    game.crash.active =
        false;


    showMessage(
        "✈️ Забрано +" +
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


    if (multiplier) {

        multiplier.textContent =
            "×" +
            game.crash.multiplier
                .toFixed(2);

    }


    const plane =
        document.getElementById(
            "crashPlane"
        );


    if (plane) {

        plane.style.left =
            Math.min(
                game.crash.multiplier *
                7,
                90
            ) +
            "%";

    }

}


/* =========================================================
   💎 JACKPOT
   ========================================================= */

function playJackpot() {

    const bet =
        Number(
            document.getElementById(
                "jackpotBet"
            )?.value
        );


    if (
        bet <= 0 ||
        !removeCoins(bet)
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }


    const random =
        Math.random();


    let multiplier =
        0;


    if (
        random < 0.01
    ) {

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


    if (multiplier) {

        const win =
            bet *
            multiplier;


        addCoins(win);


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
   🎟️ ПРОМОКОДЫ
   ========================================================= */

const promoCodes = {

    LUCKY: 1000,

    BONUS: 5000,

    TELEGRAM: 10000,

    START: 500,

    ADMIN: 100000

};


function activatePromo() {

    const input =
        document.getElementById(
            "promoCode"
        );


    if (!input) return;


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        showMessage(
            "Введите промокод",
            "error"
        );

        return;

    }


    if (
        game.promoUsed.includes(
            code
        )
    ) {

        showMessage(
            "❌ Этот промокод уже использован",
            "error"
        );

        return;

    }


    if (
        !promoCodes[code]
    ) {

        showMessage(
            "❌ Промокод недействителен",
            "error"
        );

        return;

    }


    const reward =
        promoCodes[code];


    game.promoUsed.push(
        code
    );


    addCoins(
        reward
    );

    addXP(50);


    input.value =
        "";


    showMessage(
        "🎁 Промокод активирован! +" +
        formatNumber(reward) +
        " 🪙",
        "success"
    );


    saveGame();

}


/* =========================================================
   📋 ЗАДАНИЯ
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
        type ===
        "firstClick"
    ) {

        completed =
            game.totalClicks >= 1;

        reward =
            50;

    }


    if (
        type ===
        "earn100"
    ) {

        completed =
            game.totalEarned >= 100;

        reward =
            100;

    }


    if (
        type ===
        "level5"
    ) {

        completed =
            game.level >= 5;

        reward =
            1000;

    }


    if (
        type ===
        "casino"
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


    addCoins(
        reward
    );

    addXP(50);


    showMessage(
        "🎁 +" +
        formatNumber(reward) +
        " 🪙",
        "success"
    );


    updateUI();

}


/* =========================================================
   🖥️ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
   ========================================================= */

function updateUI() {

    document
        .querySelectorAll(
            ".balance"
        )
        .forEach(
            element => {

                element.textContent =
                    formatNumber(
                        game.balance
                    );

            }
        );


    document
        .querySelectorAll(
            ".player-level"
        )
        .forEach(
            element => {

                element.textContent =
                    game.level;

            }
        );


    document
        .querySelectorAll(
            ".player-xp"
        )
        .forEach(
            element => {

                element.textContent =
                    Math.floor(
                        game.xp
                    );

            }
        );


    document
        .querySelectorAll(
            ".click-power"
        )
        .forEach(
            element => {

                element.textContent =
                    game.clickPower
                        .toFixed(1);

            }
        );


    document
        .querySelectorAll(
            ".click-price"
        )
        .forEach(
            element => {

                element.textContent =
                    formatNumber(
                        game.clickPrice
                    ) +
                    " 🪙";

            }
        );


    document
        .querySelectorAll(
            ".total-clicks"
        )
        .forEach(
            element => {

                element.textContent =
                    game.totalClicks;

            }
        );


    const xpBar =
        document.getElementById(
            "xpProgress"
        );


    if (xpBar) {

        xpBar.style.width =
            Math.min(
                (
                    game.xp /
                    getXPNeeded()
                ) *
                100,
                100
            ) +
            "%";

    }


    const passive =
        document.getElementById(
            "passiveStatus"
        );


    if (passive) {

        passive.textContent =
            game.passiveIncome
                ? "✅ Активен"
                : "🔒 Не куплен";

    }


    const double =
        document.getElementById(
            "doubleStatus"
        );


    if (double) {

        double.textContent =
            Date.now() <
            game.doubleClickUntil
                ? "🚀 ×2 активно"
                : "Неактивен";

    }


    updateLadder();

    updateMines();

    updateCrash();

}


/* =========================================================
   💰 ПАССИВНЫЙ ДОХОД
   ========================================================= */

setInterval(
    () => {

        if (
            game.passiveIncome
        ) {

            addCoins(100);

        }

    },
    60000
);


/* =========================================================
   🚀 ПРОВЕРКА ×2
   ========================================================= */

setInterval(
    () => {

        updateUI();

    },
    1000
);


/* =========================================================
   🚀 ЗАПУСК
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGame();

        updateUI();

        openPage(
            "home"
        );

    }
);


/* =========================================================
   📱 TELEGRAM MINI APP
   ========================================================= */

if (
    window.Telegram &&
    window.Telegram.WebApp
) {

    const tg =
        window.Telegram.WebApp;

    tg.ready();

    tg.expand();

    try {

        tg.setHeaderColor(
            "#0b1020"
        );

        tg.setBackgroundColor(
            "#0b1020"
        );

    } catch (error) {

        console.log(
            "Telegram WebApp API:",
            error
        );

    }

}