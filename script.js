// ======================================================
// 🍀 LUCKY CLICK 2.0
// Полный игровой скрипт
// ======================================================


// ======================================================
// 💾 СОСТОЯНИЕ ИГРЫ
// ======================================================

let coins = Number(localStorage.getItem("coins")) || 0;

let clickPower =
    Number(localStorage.getItem("clickPower")) || 0.1;

let clickPrice =
    Number(localStorage.getItem("clickPrice")) || 100;

let totalClicks =
    Number(localStorage.getItem("totalClicks")) || 0;

let inventory =
    JSON.parse(
        localStorage.getItem("inventory") || "[]"
    );


// ======================================================
// 🎮 СОСТОЯНИЕ КАЗИНО
// ======================================================

let selectedDiceNumber = null;

let selectedRouletteColor = null;

let selectedRouletteNumber = null;


// ======================================================
// ✈️ CRASH
// ======================================================

let crashRunning = false;

let crashMultiplier = 1;

let crashBet = 0;

let crashTimer = null;

let crashCrashPoint = 1;


// ======================================================
// 💣 MINES
// ======================================================

let minesGameActive = false;

let minesBet = 0;

let mines = [];

let openedMines = [];

let minesMultiplier = 1;


// ======================================================
// 📈 ЛЕСЕНКА
// ======================================================

let ladderLevel = 0;

let ladderBet = 0;

let ladderMultiplier = 1;

let ladderActive = false;


// ======================================================
// 💾 СОХРАНЕНИЕ
// ======================================================

function saveGame() {

    localStorage.setItem(
        "coins",
        coins
    );

    localStorage.setItem(
        "clickPower",
        clickPower
    );

    localStorage.setItem(
        "clickPrice",
        clickPrice
    );

    localStorage.setItem(
        "totalClicks",
        totalClicks
    );

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

}


// ======================================================
// 💰 БАЛАНС
// ======================================================

function updateBalance() {

    document
        .querySelectorAll(".balance")
        .forEach(
            element => {

                element.textContent =
                    coins.toFixed(1) +
                    " 🪙";

            }
        );


    document
        .querySelectorAll(".click-power")
        .forEach(
            element => {

                element.textContent =
                    "+" +
                    clickPower.toFixed(1) +
                    " 🪙";

            }
        );


    document
        .querySelectorAll(".click-price")
        .forEach(
            element => {

                element.textContent =
                    Math.floor(clickPrice) +
                    " 🪙";

            }
        );

}


// ======================================================
// 🪙 КЛИКЕР
// ======================================================

function clickCoin() {

    totalClicks++;


    let reward =
        clickPower;


    let random =
        Math.random();


    let bonusMessage = "";


    // 💎 0.05%

    if (
        random < 0.0005
    ) {

        reward += 100;

        bonusMessage =
            "💎 СУПЕР БОНУС +100 🪙!";

    }


    // 🎁 0.3%

    else if (
        random < 0.0035
    ) {

        reward += 10;

        bonusMessage =
            "🎁 ОЧЕНЬ РЕДКИЙ БОНУС +10 🪙!";

    }


    // ⚡ 2%

    else if (
        random < 0.0235
    ) {

        reward += 1;

        bonusMessage =
            "⚡ РЕДКИЙ БОНУС +1 🪙!";

    }


    coins += reward;


    showClickEffect(
        reward,
        bonusMessage
    );


    saveGame();

    updateBalance();

}


// ======================================================
// ✨ ЭФФЕКТ КЛИКА
// ======================================================

function showClickEffect(
    reward,
    bonusMessage
) {

    const container =
        document.getElementById(
            "clickEffects"
        );


    if (
        !container
    ) {

        return;

    }


    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "click-effect";


    effect.textContent =

        bonusMessage ||

        "+" +
        reward.toFixed(1) +
        " 🪙";


    container.appendChild(
        effect
    );


    setTimeout(
        () => {

            effect.remove();

        },
        1200
    );

}


// ======================================================
// ⚡ УЛУЧШЕНИЕ КЛИКА
// ======================================================

function upgradeClick() {

    if (
        coins <
        clickPrice
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        clickPrice;


    if (
        clickPower <
        1
    ) {

        clickPower +=
            0.1;

    }

    else {

        clickPower +=
            0.5;

    }


    clickPower =
        Number(
            clickPower.toFixed(1)
        );


    clickPrice *=
        2;


    saveGame();

    updateBalance();


    showMessage(
        "⚡ Клик улучшен!"
    );

}


// ======================================================
// 📱 НАВИГАЦИЯ
// ======================================================

function openPage(
    pageId
) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.add(
                    "hidden"
                );

            }
        );


    const page =
        document.getElementById(
            pageId
        );


    if (
        page
    ) {

        page.classList.remove(
            "hidden"
        );

    }


    window.scrollTo(
        0,
        0
    );

}


// ======================================================
// 🎮 ОТКРЫТИЕ ИГРЫ
// ======================================================

function openGame(
    gameId
) {

    const casinoMenu =
        document.getElementById(
            "casinoMenu"
        );


    if (
        casinoMenu
    ) {

        casinoMenu.classList.add(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            game => {

                game.classList.add(
                    "hidden"
                );

            }
        );


    const game =
        document.getElementById(
            gameId
        );


    if (
        game
    ) {

        game.classList.remove(
            "hidden"
        );

    }

}


// ======================================================
// 🔙 НАЗАД В КАЗИНО
// ======================================================

function backToCasino() {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            game => {

                game.classList.add(
                    "hidden"
                );

            }
        );


    const casinoMenu =
        document.getElementById(
            "casinoMenu"
        );


    if (
        casinoMenu
    ) {

        casinoMenu.classList.remove(
            "hidden"
        );

    }

}


// ======================================================
// 💬 СООБЩЕНИЯ
// ======================================================

function showMessage(
    text
) {

    const message =
        document.getElementById(
            "gameMessage"
        );


    if (
        !message
    ) {

        alert(
            text
        );

        return;

    }


    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    setTimeout(
        () => {

            message.classList.remove(
                "show"
            );

        },
        2000
    );

}


// ======================================================
// 🎰 СЛОТ
// ======================================================

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
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    const symbols = [

        "🍒",

        "🍋",

        "🍀",

        "⭐",

        "💎",

        "7️⃣"

    ];


    const slot1 =
        document.getElementById(
            "slot1"
        );

    const slot2 =
        document.getElementById(
            "slot2"
        );

    const slot3 =
        document.getElementById(
            "slot3"
        );


    if (
        slot1 &&
        slot2 &&
        slot3
    ) {

        slot1.classList.add(
            "slot-spin"
        );

        slot2.classList.add(
            "slot-spin"
        );

        slot3.classList.add(
            "slot-spin"
        );

    }


    setTimeout(
        () => {

            const a =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            const b =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            const c =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            if (
                slot1 &&
                slot2 &&
                slot3
            ) {

                slot1.textContent =
                    a;

                slot2.textContent =
                    b;

                slot3.textContent =
                    c;


                slot1.classList.remove(
                    "slot-spin"
                );

                slot2.classList.remove(
                    "slot-spin"
                );

                slot3.classList.remove(
                    "slot-spin"
                );

            }


            let win =
                0;


            if (
                a === "7️⃣" &&
                b === "7️⃣" &&
                c === "7️⃣"
            ) {

                win =
                    bet *
                    20;

                showMessage(
                    "🎉 ДЖЕКПОТ 777!"
                );

            }

            else if (
                a === b &&
                b === c
            ) {

                win =
                    bet *
                    8;

                showMessage(
                    "🔥 ТРИ ОДИНАКОВЫХ!"
                );

            }

            else if (
                a === b ||
                b === c ||
                a === c
            ) {

                win =
                    bet *
                    2;

                showMessage(
                    "✨ Пара!"
                );

            }

            else {

                showMessage(
                    "😔 Не повезло"
                );

            }


            coins +=
                win;


            saveGame();

            updateBalance();


        },
        1000
    );

}


// ======================================================
// 🎡 РУЛЕТКА
// ======================================================

function selectRouletteColor(
    color
) {

    selectedRouletteColor =
        color;


    const element =
        document.getElementById(
            "selectedRouletteColor"
        );


    if (
        element
    ) {

        const names = {

            red:
                "🔴 Красное",

            black:
                "⚫ Чёрное",

            green:
                "🟢 Зелёное"

        };


        element.textContent =
            names[color];

    }

}


// ======================================================
// 🔢 ВЫБОР ЧИСЛА РУЛЕТКИ
// ======================================================

function selectRouletteNumber(
    number
) {

    selectedRouletteNumber =
        Number(
            number
        );


    showMessage(
        "Выбрано число " +
        number
    );

}


// ======================================================
// 🎡 ИГРА В РУЛЕТКУ
// ======================================================

function playRoulette() {

    const bet =
        Number(
            document.getElementById(
                "rouletteBet"
            )?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    const result =
        Math.floor(
            Math.random() *
            37
        );


    const redNumbers = [

        1, 3, 5, 7, 9,

        12, 14, 16, 18,

        19, 21, 23, 25,

        27, 30, 32, 34, 36

    ];


    let color;


    if (
        result === 0
    ) {

        color =
            "green";

    }

    else if (
        redNumbers.includes(
            result
        )
    ) {

        color =
            "red";

    }

    else {

        color =
            "black";

    }


    const resultElement =
        document.getElementById(
            "rouletteNumber"
        );


    if (
        resultElement
    ) {

        resultElement.textContent =
            result;

    }


    let win =
        0;


    // Ставка на конкретное число

    if (
        selectedRouletteNumber !== null &&
        result ===
        selectedRouletteNumber
    ) {

        win +=
            bet *
            36;

    }


    // Ставка на цвет

    if (
        selectedRouletteColor ===
        color
    ) {

        if (
            color ===
            "green"
        ) {

            win +=
                bet *
                14;

        }

        else {

            win +=
                bet *
                2;

        }

    }


    coins +=
        win;


    saveGame();

    updateBalance();


    if (
        win > 0
    ) {

        showMessage(
            "🎉 Выпало " +
            result +
            "! Вы выиграли " +
            win.toFixed(1) +
            " 🪙"
        );

    }

    else {

        showMessage(
            "🎡 Выпало " +
            result
        );

    }

}


// ======================================================
// 🎲 ВЫБОР ЧИСЛА КУБИКА
// ======================================================

function selectDiceNumber(
    number
) {

    selectedDiceNumber =
        number;


    const element =
        document.getElementById(
            "selectedDiceNumber"
        );


    if (
        element
    ) {

        element.textContent =
            "Выбрано число: " +
            number;

    }

}


// ======================================================
// 🎲 ИГРА В КУБИК
// ======================================================

function playDice() {

    const bet =
        Number(
            document.getElementById(
                "diceBet"
            )?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    if (
        !selectedDiceNumber
    ) {

        showMessage(
            "Выберите число"
        );

        return;

    }


    coins -=
        bet;


    const result =
        Math.floor(
            Math.random() *
            6
        ) +
        1;


    const dice =
        document.querySelector(
            ".dice-number"
        );


    if (
        dice
    ) {

        dice.textContent =
            "🎲 " +
            result;

    }


    let win =
        0;


    if (
        result ===
        selectedDiceNumber
    ) {

        win =
            bet *
            5;

        showMessage(
            "🎉 Вы угадали!"
        );

    }

    else {

        showMessage(
            "😔 Выпало " +
            result
        );

    }


    coins +=
        win;


    saveGame();

    updateBalance();

}


// ======================================================
// 📈 ЛЕСЕНКА
// ======================================================

function startLadder() {

    const input =
        document.getElementById(
            "ladderBet"
        );


    const bet =
        Number(
            input?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    ladderBet =
        bet;

    ladderLevel =
        0;

    ladderMultiplier =
        1;

    ladderActive =
        true;


    saveGame();

    updateBalance();


    updateLadder();

}


// ======================================================
// 📈 СЛЕДУЮЩИЙ УРОВЕНЬ
// ======================================================

function ladderNext() {

    if (
        !ladderActive
    ) {

        return;

    }


    // Шанс пройти уровень

    const success =
        Math.random() <
        0.72;


    if (
        !success
    ) {

        ladderActive =
            false;


        ladderLevel =
            0;


        ladderMultiplier =
            1;


        showMessage(
            "💥 Вы упали! Ставка потеряна"
        );

        return;

    }


    ladderLevel++;


    ladderMultiplier =
        Number(
            (
                1 +
                ladderLevel *
                0.35
            ).toFixed(2)
        );


    updateLadder();


    if (
        ladderLevel >=
        10
    ) {

        ladderCashout();

    }

}


// ======================================================
// 💰 ЗАБРАТЬ ЛЕСЕНКУ
// ======================================================

function ladderCashout() {

    if (
        !ladderActive
    ) {

        return;

    }


    const win =
        ladderBet *
        ladderMultiplier;


    coins +=
        win;


    ladderActive =
        false;


    saveGame();

    updateBalance();


    showMessage(
        "💰 Вы забрали " +
        win.toFixed(1) +
        " 🪙"
    );

}


// ======================================================
// 📈 ОБНОВЛЕНИЕ ЛЕСЕНКИ
// ======================================================

function updateLadder() {

    const level =
        document.getElementById(
            "ladderLevel"
        );


    const multiplier =
        document.getElementById(
            "ladderMultiplier"
        );


    if (
        level
    ) {

        level.textContent =
            "Уровень " +
            ladderLevel +
            " / 10";

    }


    if (
        multiplier
    ) {

        multiplier.textContent =
            "×" +
            ladderMultiplier.toFixed(2);

    }

}


// ======================================================
// 💣 MINES
// ======================================================

function startMines() {

    const bet =
        Number(
            document.getElementById(
                "minesBet"
            )?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    minesBet =
        bet;


    minesGameActive =
        true;


    openedMines =
        [];


    minesMultiplier =
        1;


    mines =
        [];


    while (
        mines.length <
        4
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


    createMinesBoard();


    saveGame();

    updateBalance();

}


// ======================================================
// 💣 СОЗДАНИЕ МИН
// ======================================================

function createMinesBoard() {

    const board =
        document.querySelector(
            ".mines-board"
        );


    if (
        !board
    ) {

        return;

    }


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


        button.textContent =
            "?";


        button.onclick =
            () => openMineCell(
                i,
                button
            );


        board.appendChild(
            button
        );

    }

}


// ======================================================
// 💣 ОТКРЫТИЕ КЛЕТКИ
// ======================================================

function openMineCell(
    index,
    button
) {

    if (
        !minesGameActive
    ) {

        return;

    }


    if (
        openedMines.includes(
            index
        )
    ) {

        return;

    }


    openedMines.push(
        index
    );


    if (
        mines.includes(
            index
        )
    ) {

        button.textContent =
            "💣";


        minesGameActive =
            false;


        showMessage(
            "💥 Мина! Вы проиграли"
        );


        return;

    }


    button.textContent =
        "💎";


    minesMultiplier =
        Number(
            (
                minesMultiplier +
                0.35
            ).toFixed(2)
        );


    const multiplierElement =
        document.getElementById(
            "minesMultiplier"
        );


    if (
        multiplierElement
    ) {

        multiplierElement.textContent =
            "×" +
            minesMultiplier.toFixed(2);

    }

}


// ======================================================
// 💰 ЗАБРАТЬ MINES
// ======================================================

function cashoutMines() {

    if (
        !minesGameActive
    ) {

        return;

    }


    const win =
        minesBet *
        minesMultiplier;


    coins +=
        win;


    minesGameActive =
        false;


    saveGame();

    updateBalance();


    showMessage(
        "💰 Вы забрали " +
        win.toFixed(1) +
        " 🪙"
    );

}


// ======================================================
// ✈️ CRASH
// ======================================================

function startCrash() {

    if (
        crashRunning
    ) {

        return;

    }


    const bet =
        Number(
            document.getElementById(
                "crashBet"
            )?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    crashBet =
        bet;


    crashMultiplier =
        1;


    crashRunning =
        true;


    // Краш всегда от 1x до 30x

    crashCrashPoint =
        Number(
            (
                1 +
                Math.random() *
                29
            ).toFixed(2)
        );


    // Редкие большие значения

    if (
        Math.random() <
        0.90
    ) {

        crashCrashPoint =
            Number(
                (
                    1 +
                    Math.random() *
                    5
                ).toFixed(2)
            );

    }


    saveGame();

    updateBalance();


    clearInterval(
        crashTimer
    );


    crashTimer =
        setInterval(
            () => {

                crashMultiplier +=
                    0.05;


                crashMultiplier =
                    Number(
                        crashMultiplier.toFixed(
                            2
                        )
                    );


                const element =
                    document.getElementById(
                        "crashMultiplier"
                    );


                if (
                    element
                ) {

                    element.textContent =
                        "×" +
                        crashMultiplier.toFixed(
                            2
                        );

                }


                if (
                    crashMultiplier >=
                    crashCrashPoint
                ) {

                    crashCrash();

                }

            },
            100
        );

}


// ======================================================
// 💥 CRASH
// ======================================================

function crashCrash() {

    clearInterval(
        crashTimer
    );


    crashRunning =
        false;


    const element =
        document.getElementById(
            "crashMultiplier"
        );


    if (
        element
    ) {

        element.textContent =
            "💥 CRASH ×" +
            crashMultiplier.toFixed(
                2
            );

    }


    showMessage(
        "💥 Самолёт разбился!"
    );

}


// ======================================================
// 💰 ЗАБРАТЬ CRASH
// ======================================================

function cashoutCrash() {

    if (
        !crashRunning
    ) {

        showMessage(
            "Самолёт уже разбился"
        );

        return;

    }


    const win =
        crashBet *
        crashMultiplier;


    coins +=
        win;


    clearInterval(
        crashTimer
    );


    crashRunning =
        false;


    saveGame();

    updateBalance();


    showMessage(
        "🚀 Вы забрали " +
        win.toFixed(1) +
        " 🪙"
    );

}


// ======================================================
// 💎 ДЖЕКПОТ
// ======================================================

function playJackpot() {

    const bet =
        Number(
            document.getElementById(
                "jackpotBet"
            )?.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        showMessage(
            "Введите ставку"
        );

        return;

    }


    if (
        bet >
        coins
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        bet;


    const chance =
        Math.random();


    let win =
        0;


    if (
        chance <
        0.001
    ) {

        win =
            bet *
            100;


        showMessage(
            "💎💎💎 ДЖЕКПОТ ×100!"
        );

    }

    else if (
        chance <
        0.01
    ) {

        win =
            bet *
            20;


        showMessage(
            "💎 Большой выигрыш!"
        );

    }

    else {

        showMessage(
            "😔 Джекпот не выпал"
        );

    }


    coins +=
        win;


    saveGame();

    updateBalance();

}


// ======================================================
// 🎁 ПОДАРКИ
// ======================================================

const gifts = [

    {

        id:
            "cat",

        name:
            "Crypto Cat",

        emoji:
            "🐱",

        rarity:
            "Обычный",

        price:
            2000,

        income:
            5

    },


    {

        id:
            "frog",

        name:
            "Lucky Frog",

        emoji:
            "🐸",

        rarity:
            "Редкий",

        price:
            10000,

        income:
            15

    },


    {

        id:
            "diamond",

        name:
            "Diamond",

        emoji:
            "💎",

        rarity:
            "Эпический",

        price:
            50000,

        income:
            50

    },


    {

        id:
            "crown",

        name:
            "Golden Crown",

        emoji:
            "👑",

        rarity:
            "Легендарный",

        price:
            250000,

        income:
            150

    },


    {

        id:
            "dragon",

        name:
            "Golden Dragon",

        emoji:
            "🐉",

        rarity:
            "Мифический",

        price:
            1000000,

        income:
            500

    },


    {

        id:
            "rocket",

        name:
            "Space Rocket",

        emoji:
            "🚀",

        rarity:
            "Ультраредкий",

        price:
            5000000,

        income:
            1000

    }

];


// ======================================================
// 🎁 КЕЙСЫ
// ======================================================

const cases = {

    common:
        5000,

    rare:
        25000,

    legendary:
        100000,

    mythical:
        500000

};


// ======================================================
// 🎁 ОТКРЫТИЕ КЕЙСА
// ======================================================

function openCase(
    type
) {

    const price =
        cases[type];


    if (
        coins <
        price
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        price;


    const random =
        Math.random();


    let gift;


    if (
        random <
        0.55
    ) {

        gift =
            gifts[0];

    }

    else if (
        random <
        0.80
    ) {

        gift =
            gifts[1];

    }

    else if (
        random <
        0.94
    ) {

        gift =
            gifts[2];

    }

    else if (
        random <
        0.985
    ) {

        gift =
            gifts[3];

    }

    else if (
        random <
        0.998
    ) {

        gift =
            gifts[4];

    }

    else {

        gift =
            gifts[5];

    }


    inventory.push(
        gift
    );


    saveGame();

    updateBalance();

    renderInventory();


    showGiftResult(
        gift
    );

}


// ======================================================
// 🎁 РЕЗУЛЬТАТ КЕЙСА
// ======================================================

function showGiftResult(
    gift
) {

    const result =
        document.getElementById(
            "caseResult"
        );


    if (
        !result
    ) {

        return;

    }


    result.innerHTML = `

        <div class="gift-result">

            <div class="gift-big">

                ${gift.emoji}

            </div>

            <h2>

                🎉 ТЕБЕ ВЫПАЛО!

            </h2>

            <h3>

                ${gift.name}

            </h3>

            <p>

                ⭐ ${gift.rarity}

            </p>

            <p>

                💰 Стоимость:

                ${gift.price.toLocaleString()}

                🪙

            </p>

            <p>

                ⚡ Доход:

                +${gift.income}

                🪙 / 10 мин

            </p>

        </div>

    `;

}


// ======================================================
// 🎒 ИНВЕНТАРЬ
// ======================================================

function renderInventory() {

    const container =
        document.getElementById(
            "inventory"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    if (
        inventory.length ===
        0
    ) {

        container.innerHTML = `

            <p>

                🎒 Коллекция пока пуста

            </p>

        `;

        return;

    }


    inventory.forEach(
        (
            gift,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "inventory-card";


            card.innerHTML = `

                <div
                    class="inventory-icon"
                >

                    ${gift.emoji}

                </div>

                <b>

                    ${gift.name}

                </b>

                <span>

                    ${gift.rarity}

                </span>

                <small>

                    +${gift.income}

                    🪙 / 10 мин

                </small>

                <button
                    onclick="sellGift(${index})"
                >

                    💰 Продать

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ======================================================
// 💰 ПРОДАЖА ПОДАРКА
// ======================================================

function sellGift(
    index
) {

    const gift =
        inventory[index];


    if (
        !gift
    ) {

        return;

    }


    coins +=
        gift.price;


    inventory.splice(
        index,
        1
    );


    saveGame();

    updateBalance();

    renderInventory();


    showMessage(
        "💰 Предмет продан!"
    );

}


// ======================================================
// ⚡ ПАССИВНЫЙ ДОХОД
// ======================================================

setInterval(
    () => {

        let income =
            0;


        inventory.forEach(
            gift => {

                income +=
                    gift.income;

            }
        );


        if (
            income > 0
        ) {

            coins +=
                income;


            saveGame();

            updateBalance();

        }

    },
    10 * 60 * 1000
);


// ======================================================
// 🏆 ТОП ИГРОКОВ
// ======================================================

function renderLeaderboard() {

    const leaderboard =
        document.querySelector(
            ".leaderboard"
        );


    if (
        !leaderboard
    ) {

        return;

    }


    const players = [

        {
            name:
                "LuckyKing",

            coins:
                9999999

        },

        {

            name:
                "CasinoPro",

            coins:
                7500000

        },

        {

            name:
                "Dragon",

            coins:
                5000000

        },

        {

            name:
                "LuckyPlayer",

            coins:
                2500000

        }

    ];


    leaderboard.innerHTML =
        "";


    players.forEach(
        (
            player,
            index
        ) => {

            const div =
                document.createElement(
                    "div"
                );


            div.innerHTML =

                (index + 1) +

                ". " +

                player.name +

                " — " +

                player.coins.toLocaleString() +

                " 🪙";


            leaderboard.appendChild(
                div
            );

        }
    );

}


// ======================================================
// 🚀 ЗАПУСК
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateBalance();

        renderInventory();

        renderLeaderboard();

        openPage(
            "home"
        );

    }
);