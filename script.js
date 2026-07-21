// ==========================================
// 🍀 LUCKY CLICK — НОВЫЙ ОСНОВНОЙ КОД
// ==========================================


// ==========================================
// 💰 ДАННЫЕ ИГРОКА
// ==========================================

let coins =
    Number(localStorage.getItem("coins")) || 0;

let clickPower =
    Number(localStorage.getItem("clickPower")) || 1;

let clickPrice =
    Number(localStorage.getItem("clickPrice")) || 100;

let autoClick =
    Number(localStorage.getItem("autoClick")) || 0;

let pets =
    JSON.parse(localStorage.getItem("pets")) || [];


// ==========================================
// 🎰 РУЛЕТКА
// ==========================================

let selectedRouletteColor = null;


// ==========================================
// 🎲 КУБИК
// ==========================================

let selectedDiceNumber = null;


// ==========================================
// 💣 МИНЕР
// ==========================================

let minesCount = 5;

let minesGameActive = false;

let minesBet = 0;

let minesMultiplier = 1;

let minePositions = [];

let openedMines = 0;


// ==========================================
// 📈 ЛЕСЕНКА
// ==========================================

let ladderLevel = 0;

let ladderBet = 0;

let ladderActive = false;


// ==========================================
// 💾 СОХРАНЕНИЕ
// ==========================================

function save() {

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
        "autoClick",
        autoClick
    );

    localStorage.setItem(
        "pets",
        JSON.stringify(pets)
    );

}


// ==========================================
// 🔄 ОБНОВЛЕНИЕ БАЛАНСА
// ==========================================

function update() {

    const coinsElement =
        document.getElementById(
            "coins"
        );

    const profileCoins =
        document.getElementById(
            "profileCoins"
        );

    const clickPowerElement =
        document.getElementById(
            "clickPower"
        );

    const profileClickPower =
        document.getElementById(
            "profileClickPower"
        );

    const shopClickPower =
        document.getElementById(
            "shopClickPower"
        );

    const clickPriceElement =
        document.getElementById(
            "clickPrice"
        );


    if (coinsElement) {

        coinsElement.textContent =
            Math.floor(coins);

    }


    if (profileCoins) {

        profileCoins.textContent =
            Math.floor(coins);

    }


    if (clickPowerElement) {

        clickPowerElement.textContent =
            clickPower;

    }


    if (profileClickPower) {

        profileClickPower.textContent =
            clickPower;

    }


    if (shopClickPower) {

        shopClickPower.textContent =
            clickPower;

    }


    if (clickPriceElement) {

        clickPriceElement.textContent =
            clickPrice;

    }

}


// ==========================================
// 🏠 ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ==========================================

function showPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        function(page) {

            page.classList.add(
                "hidden"
            );

        }
    );


    const page =
        document.getElementById(
            pageName
        );


    if (page) {

        page.classList.remove(
            "hidden"
        );

    }


    window.scrollTo(
        0,
        0
    );

}


// ==========================================
// 🪙 КЛИКЕР
// ==========================================

function clickCoin() {

    coins += clickPower;


    const bonusElement =
        document.getElementById(
            "clickBonus"
        );


    // Обычный клик

    let message =
        "+" +
        clickPower +
        " 🪙";


    // ======================================
    // 🎁 РЕДКИЕ БОНУСЫ
    // ======================================

    const random =
        Math.random();


    // 1% — супер бонус

    if (
        random < 0.01
    ) {

        const bonus =
            1000;

        coins += bonus;

        message =
            "💎🎉 СУПЕР БОНУС +" +
            bonus +
            " 🪙!";

    }


    // 3% — большой бонус

    else if (
        random < 0.04
    ) {

        const bonus =
            100;

        coins += bonus;

        message =
            "🎁✨ БОНУС +" +
            bonus +
            " 🪙!";

    }


    // 8% — двойной клик

    else if (
        random < 0.12
    ) {

        const bonus =
            clickPower;

        coins += bonus;

        message =
            "⚡ x2 КЛИК! +" +
            (
                clickPower * 2
            ) +
            " 🪙";

    }


    if (bonusElement) {

        bonusElement.textContent =
            message;


        bonusElement.classList.remove(
            "bonus-animation"
        );


        void bonusElement.offsetWidth;


        bonusElement.classList.add(
            "bonus-animation"
        );

    }


    save();

    update();

}


// ==========================================
// 🖱️ КНОПКА КЛИКА
// ==========================================

const clickButton =
    document.getElementById(
        "clickButton"
    );


if (clickButton) {

    clickButton.addEventListener(
        "click",
        clickCoin
    );

}


// ==========================================
// ⚡ УЛУЧШЕНИЕ КЛИКА
// ==========================================

function buyClick() {

    if (
        coins < clickPrice
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= clickPrice;

    clickPower += 1;

    clickPrice *= 2;


    save();

    update();


    alert(
        "⚡ Сила клика увеличена!"
    );

}


// ==========================================
// 🤖 АВТОКЛИК
// ==========================================

function buyAuto() {

    const price =
        5000;


    if (
        coins < price
    ) {

        alert(
            "❌ Нужно 5000 🪙!"
        );

        return;

    }


    coins -= price;

    autoClick += 1;


    save();

    update();


    alert(
        "🤖 Автоклик куплен!"
    );

}


// Автоклик

setInterval(
    function() {

        if (
            autoClick > 0
        ) {

            coins += autoClick;

            save();

            update();

        }

    },
    1000
);


// ==========================================
// 🎰 ОТКРЫТИЕ ИГРЫ
// ==========================================

function openCasinoGame(
    game
) {

    const casinoMenu =
        document.getElementById(
            "casinoMenu"
        );

    const casinoGame =
        document.getElementById(
            "casinoGame"
        );


    if (casinoMenu) {

        casinoMenu.classList.add(
            "hidden"
        );

    }


    if (casinoGame) {

        casinoGame.classList.remove(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".casino-panel"
        )
        .forEach(
            function(panel) {

                panel.classList.add(
                    "hidden"
                );

            }
        );


    const selected =
        document.getElementById(
            game +
            "Game"
        );


    if (selected) {

        selected.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// 🔙 НАЗАД ИЗ ИГРЫ
// ==========================================

function closeCasinoGame() {

    const casinoMenu =
        document.getElementById(
            "casinoMenu"
        );

    const casinoGame =
        document.getElementById(
            "casinoGame"
        );


    if (casinoGame) {

        casinoGame.classList.add(
            "hidden"
        );

    }


    if (casinoMenu) {

        casinoMenu.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// 🎰 СЛОТ
// ==========================================

function playSlot() {

    const input =
        document.getElementById(
            "slotBet"
        );


    const bet =
        Number(
            input.value
        );


    const resultElement =
        document.getElementById(
            "slotResult"
        );


    if (
        !bet ||
        bet <= 0
    ) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }


    if (
        coins < bet
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= bet;

    update();


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


    const symbols = [

        "🍒",

        "🍋",

        "🍀",

        "⭐",

        "💎",

        "🔔",

        "7️⃣"

    ];


    reels.forEach(
        function(reel) {

            if (reel) {

                reel.classList.add(
                    "slot-spin"
                );

            }

        }
    );


    resultElement.textContent =
        "🎰 Вращение...";


    setTimeout(
        function() {


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


            reels.forEach(
                function(
                    reel,
                    index
                ) {

                    if (reel) {

                        reel.textContent =
                            result[index];

                        reel.classList.remove(
                            "slot-spin"
                        );

                    }

                }
            );


            let win =
                0;


            // 777 — главный приз

            if (

                result[0] === "7️⃣" &&

                result[1] === "7️⃣" &&

                result[2] === "7️⃣"

            ) {

                win =
                    bet * 50;


                resultElement.textContent =
                    "🎉💎 777 ДЖЕКПОТ! +" +
                    win +
                    " 🪙";

            }


            // Три одинаковых

            else if (

                result[0] === result[1] &&

                result[1] === result[2]

            ) {

                win =
                    bet * 10;


                resultElement.textContent =
                    "🎉 ТРИ ОДИНАКОВЫХ! +" +
                    win +
                    " 🪙";

            }


            // Два одинаковых

            else if (

                result[0] === result[1] ||

                result[1] === result[2] ||

                result[0] === result[2]

            ) {

                win =
                    bet * 2;


                resultElement.textContent =
                    "✨ Пара! +" +
                    win +
                    " 🪙";

            }


            else {

                resultElement.textContent =
                    "😢 Не повезло";

            }


            coins += win;


            save();

            update();


        },
        1500
    );

}


// ==========================================
// 🎡 РУЛЕТКА — ВЫБОР ЦВЕТА
// ==========================================

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
        color === "red"
    ) {

        element.textContent =
            "🔴 Выбрано: Красное";

    }


    if (
        color === "black"
    ) {

        element.textContent =
            "⚫ Выбрано: Чёрное";

    }


    if (
        color === "green"
    ) {

        element.textContent =
            "🟢 Выбрано: Зелёное";

    }

}


// ==========================================
// 🎡 РУЛЕТКА
// ==========================================

function playRoulette() {

    const input =
        document.getElementById(
            "rouletteBet"
        );


    const bet =
        Number(
            input.value
        );


    if (
        !bet ||
        bet <= 0
    ) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }


    if (
        !selectedRouletteColor
    ) {

        alert(
            "❌ Выберите цвет!"
        );

        return;

    }


    if (
        coins < bet
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= bet;


    const wheel =
        document.getElementById(
            "rouletteWheel"
        );


    const numberElement =
        document.getElementById(
            "rouletteNumber"
        );


    const resultElement =
        document.getElementById(
            "rouletteResult"
        );


    if (wheel) {

        wheel.classList.remove(
            "roulette-spin"
        );


        void wheel.offsetWidth;


        wheel.classList.add(
            "roulette-spin"
        );

    }


    numberElement.textContent =
        "🎡 Вращение...";


    resultElement.textContent =
        "🎰 Рулетка вращается...";


    update();


    setTimeout(
        function() {


            const result =
                Math.floor(
                    Math.random() *
                    37
                );


            let resultColor;


            const redNumbers = [

                1, 3, 5, 7, 9,

                12, 14, 16, 18,

                19, 21, 23, 25,

                27, 30, 32, 34, 36

            ];


            if (
                result === 0
            ) {

                resultColor =
                    "green";

            }

            else if (
                redNumbers.includes(
                    result
                )
            ) {

                resultColor =
                    "red";

            }

            else {

                resultColor =
                    "black";

            }


            if (wheel) {

                wheel.classList.remove(
                    "roulette-spin"
                );

            }


            let emoji =
                "⚫";


            if (
                resultColor === "red"
            ) {

                emoji =
                    "🔴";

            }


            if (
                resultColor === "green"
            ) {

                emoji =
                    "🟢";

            }


            numberElement.textContent =

                result +
                " — " +
                emoji;


            let win =
                0;


            if (
                selectedRouletteColor ===
                resultColor
            ) {


                if (
                    resultColor ===
                    "green"
                ) {

                    win =
                        bet * 14;

                }

                else {

                    win =
                        bet * 2;

                }


                coins += win;


                resultElement.textContent =

                    "🎉 ВЫИГРЫШ +" +
                    win +
                    " 🪙!";


            }

            else {

                resultElement.textContent =

                    "😢 Проигрыш " +
                    bet +
                    " 🪙";

            }


            save();

            update();


            selectedRouletteColor =
                null;


            document.getElementById(
                "selectedRouletteColor"
            ).textContent =
                "Цвет не выбран";


            input.value =
                "";


        },
        1500
    );

}


// ==========================================
// 🎲 ВЫБОР ЧИСЛА
// ==========================================

function selectDiceNumber(
    number
) {

    selectedDiceNumber =
        number;


    const element =
        document.getElementById(
            "selectedDiceNumber"
        );


    element.textContent =
        "🎯 Выбрано число: " +
        number;

}


// ==========================================
// 🎲 КУБИК
// ==========================================

function playDice() {

    const input =
        document.getElementById(
            "diceBet"
        );


    const bet =
        Number(
            input.value
        );


    const dice =
        document.getElementById(
            "diceVisual"
        );


    const resultElement =
        document.getElementById(
            "diceResult"
        );


    if (
        !bet ||
        bet <= 0
    ) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }


    if (
        !selectedDiceNumber
    ) {

        alert(
            "❌ Выберите число от 1 до 6!"
        );

        return;

    }


    if (
        coins < bet
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= bet;

    update();


    dice.classList.remove(
        "dice-roll"
    );


    void dice.offsetWidth;


    dice.classList.add(
        "dice-roll"
    );


    resultElement.textContent =
        "🎲 Бросаем...";


    setTimeout(
        function() {


            const result =
                Math.floor(
                    Math.random() *
                    6
                ) + 1;


            dice.textContent =
                "🎲";


            if (
                result ===
                selectedDiceNumber
            ) {


                const win =
                    bet * 5;


                coins += win;


                resultElement.textContent =

                    "🎉 Выпало " +
                    result +
                    "! +" +
                    win +
                    " 🪙";


            }

            else {


                resultElement.textContent =

                    "🎲 Выпало " +
                    result +
                    ". 😢";


            }


            save();

            update();


            selectedDiceNumber =
                null;


            document.getElementById(
                "selectedDiceNumber"
            ).textContent =
                "Число не выбрано";


            input.value =
                "";


        },
        1000
    );

}


// ==========================================
// 📈 ЛЕСЕНКА
// ==========================================

function playLadder() {

    if (
        !ladderActive
    ) {

        const input =
            document.getElementById(
                "ladderBet"
            );


        ladderBet =
            Number(
                input.value
            );


        if (
            !ladderBet ||
            ladderBet <= 0
        ) {

            alert(
                "❌ Введите ставку!"
            );

            return;

        }


        if (
            coins < ladderBet
        ) {

            alert(
                "❌ Недостаточно монет!"
            );

            return;

        }


        coins -= ladderBet;


        ladderLevel =
            0;


        ladderActive =
            true;


        document.querySelector(
            "#ladderGame .play-button"
        ).textContent =
            "📈 ПОДНЯТЬСЯ";


        document.getElementById(
            "ladderResult"
        ).textContent =
            "🪙 Уровень 0";


        save();

        update();


        return;

    }


    // Шанс проигрыша

    const fail =
        Math.random() <
        0.25;


    if (
        fail
    ) {

        ladderActive =
            false;


        const board =
            document.getElementById(
                "ladderBoard"
            );


        board.classList.add(
            "ladder-fall"
        );


        document.getElementById(
            "ladderResult"
        ).textContent =
            "💥 Ты упал! Ставка проиграна.";


        setTimeout(
            function() {

                board.classList.remove(
                    "ladder-fall"
                );

            },
            900
        );


        document.querySelector(
            "#ladderGame .play-button"
        ).textContent =
            "📈 НАЧАТЬ";


        return;

    }


    ladderLevel++;


    if (
        ladderLevel >= 10
    ) {

        const win =
            ladderBet * 50;


        coins += win;


        ladderActive =
            false;


        document.getElementById(
            "ladderResult"
        ).textContent =

            "👑🏆 УРОВЕНЬ 10! +" +
            win +
            " 🪙";


        document.querySelector(
            "#ladderGame .play-button"
        ).textContent =
            "📈 НАЧАТЬ";


        save();

        update();


        return;

    }


    const multipliers = [

        1.2,

        1.5,

        2,

        3,

        4,

        6,

        8,

        12,

        20,

        50

    ];


    const currentMultiplier =
        multipliers[
            ladderLevel
        ];


    const currentWin =
        Math.floor(
            ladderBet *
            currentMultiplier
        );


    document.getElementById(
        "ladderResult"
    ).textContent =

        "🔥 Уровень " +
        ladderLevel +
        " | Возможный выигрыш: " +
        currentWin +
        " 🪙";


    // Если игрок дошёл до уровня,
    // можно забрать выигрыш

    const take =
        confirm(

            "📈 Уровень " +
            ladderLevel +
            " пройден!\n\n" +

            "💰 Забрать " +
            currentWin +
            " монет?\n\n" +

            "Нажми ОК — забрать.\n" +

            "Отмена — рискнуть дальше."

        );


    if (
        take
    ) {

        coins += currentWin;


        ladderActive =
            false;


        document.getElementById(
            "ladderResult"
        ).textContent =

            "🏆 Ты забрал " +
            currentWin +
            " 🪙!";


        document.querySelector(
            "#ladderGame .play-button"
        ).textContent =
            "📈 НАЧАТЬ";


        save();

        update();

    }

}


// ==========================================
// 💣 ВЫБОР КОЛИЧЕСТВА МИН
// ==========================================

function setMines(
    count
) {

    minesCount =
        count;


    const element =
        document.getElementById(
            "selectedMines"
        );


    element.textContent =
        "💣 Мин: " +
        count;

}


// ==========================================
// 💣 НАЧАЛО МИНЕРА
// ==========================================

function startMines() {

    const input =
        document.getElementById(
            "minesBet"
        );


    minesBet =
        Number(
            input.value
        );


    if (
        !minesBet ||
        minesBet <= 0
    ) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }


    if (
        coins < minesBet
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= minesBet;


    minesGameActive =
        true;


    minesMultiplier =
        1;


    openedMines =
        0;


    minePositions =
        [];


    while (
        minePositions.length <
        minesCount
    ) {


        const position =
            Math.floor(
                Math.random() *
                25
            );


        if (
            !minePositions.includes(
                position
            )
        ) {

            minePositions.push(
                position
            );

        }

    }


    createMinesBoard();


    document.getElementById(
        "minesMultiplier"
    ).textContent =
        "×1.00";


    document.getElementById(
        "minesResult"
    ).textContent =
        "💎 Ищи безопасные клетки!";


    save();

    update();

}


// ==========================================
// 💣 СОЗДАНИЕ ПОЛЯ МИНЕРА
// ==========================================

function createMinesBoard() {

    const board =
        document.getElementById(
            "minesBoard"
        );


    board.innerHTML =
        "";


    for (
        let i = 0;
        i < 25;
        i++
    ) {


        const cell =
            document.createElement(
                "button"
            );


        cell.className =
            "mine-cell";


        cell.textContent =
            "?";


        cell.onclick =
            function() {

                openMineCell(
                    i,
                    cell
                );

            };


        board.appendChild(
            cell
        );

    }

}


// ==========================================
// 💣 ОТКРЫТИЕ КЛЕТКИ
// ==========================================

function openMineCell(
    index,
    cell
) {

    if (
        !minesGameActive
    ) {

        return;

    }


    if (
        cell.classList.contains(
            "mine-safe"
        ) ||
        cell.classList.contains(
            "mine-bomb"
        )
    ) {

        return;

    }


    // МИНА

    if (
        minePositions.includes(
            index
        )
    ) {


        cell.textContent =
            "💣";


        cell.classList.add(
            "mine-bomb"
        );


        minesGameActive =
            false;


        document.getElementById(
            "minesResult"
        ).textContent =
            "💥 МИНА! Ты проиграл.";


        revealAllMines();


        return;

    }


    // БЕЗОПАСНО

    cell.textContent =
        "💎";


    cell.classList.add(
        "mine-safe"
    );


    openedMines++;


    // Увеличиваем множитель

    minesMultiplier +=
        0.25;


    document.getElementById(
        "minesMultiplier"
    ).textContent =

        "×" +
        minesMultiplier.toFixed(
            2
        );


    const potentialWin =

        Math.floor(
            minesBet *
            minesMultiplier
        );


    document.getElementById(
        "minesResult"
    ).textContent =

        "💎 Возможный выигрыш: " +
        potentialWin +
        " 🪙";


    // Все безопасные клетки

    if (
        openedMines >=
        25 -
        minesCount
    ) {

        cashoutMines();

    }

}


// ==========================================
// 💣 ОТКРЫТЬ ВСЕ МИНЫ
// ==========================================

function revealAllMines() {

    const cells =
        document.querySelectorAll(
            ".mine-cell"
        );


    minePositions.forEach(
        function(index) {

            cells[index].textContent =
                "💣";


            cells[index].classList.add(
                "mine-bomb"
            );

        }
    );

}


// ==========================================
// 💰 ЗАБРАТЬ ВЫИГРЫШ МИНЕРА
// ==========================================

function cashoutMines() {

    if (
        !minesGameActive
    ) {

        return;

    }


    const win =

        Math.floor(
            minesBet *
            minesMultiplier
        );


    coins += win;


    minesGameActive =
        false;


    document.getElementById(
        "minesResult"
    ).textContent =

        "🎉 Ты забрал " +
        win +
        " 🪙!";


    save();

    update();

}


// ==========================================
// 💎 ДЖЕКПОТ
// ==========================================

function playJackpot() {

    const input =
        document.getElementById(
            "jackpotBet"
        );


    const bet =
        Number(
            input.value
        );


    const resultElement =
        document.getElementById(
            "jackpotResult"
        );


    const visual =
        document.getElementById(
            "jackpotVisual"
        );


    if (
        !bet ||
        bet <= 0
    ) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }


    if (
        coins < bet
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= bet;


    visual.classList.add(
        "jackpot-animation"
    );


    resultElement.textContent =
        "💎 Испытываем удачу...";


    update();


    setTimeout(
        function() {


            visual.classList.remove(
                "jackpot-animation"
            );


            const random =
                Math.random();


            if (
                random < 0.01
            ) {


                const win =
                    bet * 100;


                coins += win;


                resultElement.textContent =

                    "🎉🎉🎉 ДЖЕКПОТ! +" +
                    win +
                    " 🪙";


            }


            else if (
                random < 0.1
            ) {


                const win =
                    bet * 10;


                coins += win;


                resultElement.textContent =

                    "💎 БОЛЬШОЙ ВЫИГРЫШ! +" +
                    win +
                    " 🪙";


            }


            else {


                resultElement.textContent =
                    "😢 В этот раз не повезло.";

            }


            save();

            update();


        },
        2000
    );

}


// ==========================================
// 🎁 КЕЙСЫ
// ==========================================

function openCase(
    type
) {

    let price =
        0;

    let minReward =
        0;

    let maxReward =
        0;


    if (
        type ===
        "common"
    ) {

        price =
            5000;

        minReward =
            1000;

        maxReward =
            10000;

    }


    else if (
        type ===
        "rare"
    ) {

        price =
            12000;

        minReward =
            5000;

        maxReward =
            30000;

    }


    else if (
        type ===
        "legend"
    ) {

        price =
            100000;

        minReward =
            50000;

        maxReward =
            300000;

    }


    if (
        coins < price
    ) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }


    coins -= price;


    const reward =

        Math.floor(

            Math.random() *

            (
                maxReward -
                minReward +
                1
            )

        ) +

        minReward;


    coins += reward;


    const result =
        document.getElementById(
            "caseResult"
        );


    if (result) {

        result.textContent =

            "🎁 Ты получил " +
            reward +
            " 🪙!";

    }


    save();

    update();

}


// ==========================================
// 🐾 ПИТОМЦЫ
// ==========================================

const petList = [

    "🐭 Мышь",

    "🐱 Кот",

    "🐶 Собака",

    "🦊 Лиса",

    "🐺 Волк",

    "🐼 Панда",

    "🦁 Лев",

    "🐯 Тигр",

    "🐲 Дракон",

    "👑 Феникс"

];


function showPets() {

    const container =
        document.getElementById(
            "petsList"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    petList.forEach(
        function(pet) {


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "shop-card";


            div.textContent =
                pet;


            container.appendChild(
                div
            );


        }
    );

}


// ==========================================
// 📱 TELEGRAM
// ==========================================

if (

    window.Telegram &&

    window.Telegram.WebApp

) {


    const tg =
        window.Telegram.WebApp;


    tg.ready();


    tg.expand();


    const user =
        tg.initDataUnsafe?.user;


    if (
        user
    ) {


        const nickname =
            document.getElementById(
                "nickname"
            );


        if (
            nickname
        ) {

            nickname.textContent =

                user.username

                ? "@" +
                  user.username

                : user.first_name ||
                  "Игрок";

        }


    }

}


// ==========================================
// 🚀 ЗАПУСК
// ==========================================

showPets();

update();

save();