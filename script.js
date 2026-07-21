// ==============================
// 🎮 LUCKY CLICK — ОСНОВНОЙ КОД
// ==============================

// ==============================
// 💰 ДАННЫЕ ИГРОКА
// ==============================

let coins = Number(localStorage.getItem("coins")) || 0;
let clickPower = Number(localStorage.getItem("clickPower")) || 1;
let clickPrice = Number(localStorage.getItem("clickPrice")) || 100;
let autoClick = Number(localStorage.getItem("autoClick")) || 0;

let pets = JSON.parse(localStorage.getItem("pets")) || [];


// ==============================
// 💾 СОХРАНЕНИЕ
// ==============================

function save() {

    localStorage.setItem("coins", coins);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("clickPrice", clickPrice);
    localStorage.setItem("autoClick", autoClick);
    localStorage.setItem("pets", JSON.stringify(pets));

}


// ==============================
// 🔄 ОБНОВЛЕНИЕ
// ==============================

function update() {

    const coinsElement =
        document.getElementById("coins");

    const clickPowerElement =
        document.getElementById("clickPower");

    const clickPriceElement =
        document.getElementById("clickPrice");

    const profileCoinsElement =
        document.getElementById("profileCoins");

    if (coinsElement) {
        coinsElement.textContent =
            Math.floor(coins);
    }

    if (clickPowerElement) {
        clickPowerElement.textContent =
            clickPower;
    }

    if (clickPriceElement) {
        clickPriceElement.textContent =
            clickPrice;
    }

    if (profileCoinsElement) {
        profileCoinsElement.textContent =
            Math.floor(coins);
    }

}


// ==============================
// 🪙 КЛИКЕР
// ==============================

const clickButton =
    document.getElementById("clickButton");

if (clickButton) {

    clickButton.addEventListener(
        "click",
        function() {

            coins += clickPower;

            save();
            update();

        }
    );

}


// ==============================
// 📄 СТРАНИЦЫ
// ==============================

function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.add("hidden");

    });

    const page =
        document.getElementById(pageName);

    if (page) {

        page.classList.remove("hidden");

    }

}


// ==============================
// ⚡ УЛУЧШЕНИЕ КЛИКА
// ==============================

function buyClick() {

    if (coins < clickPrice) {

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

}


// ==============================
// 🤖 АВТОКЛИК
// ==============================

function buyAuto() {

    if (coins < 5000) {

        alert(
            "❌ Нужно 5000 монет!"
        );

        return;

    }

    coins -= 5000;

    autoClick += 1;

    save();
    update();

}


setInterval(function() {

    if (autoClick > 0) {

        coins += autoClick;

        save();
        update();

    }

}, 1000);


// ==============================
// 🎰 СЛОТ
// ==============================

function playSlot() {

    const input =
        document.getElementById("slotBet");

    const bet =
        Number(input.value);

    const result =
        document.getElementById("slotResult");

    if (!bet || bet <= 0) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }

    if (coins < bet) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }

    coins -= bet;

    const symbols = [
        "🍀",
        "💎",
        "⭐",
        "🍒",
        "7️⃣",
        "🔔"
    ];

    const reels = [

        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")

    ];

    if (result) {

        result.textContent =
            "🎰 Крутим...";

    }

    reels.forEach(function(reel) {

        if (reel) {

            reel.classList.add(
                "slot-spin"
            );

        }

    });

    save();
    update();

    setTimeout(function() {

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

        if (reels[0]) {
            reels[0].textContent = a;
        }

        if (reels[1]) {
            reels[1].textContent = b;
        }

        if (reels[2]) {
            reels[2].textContent = c;
        }

        reels.forEach(function(reel) {

            if (reel) {

                reel.classList.remove(
                    "slot-spin"
                );

            }

        });

        let win = 0;

        if (a === b && b === c) {

            win = bet * 10;

        }

        else if (
            a === b ||
            b === c ||
            a === c
        ) {

            win = bet * 2;

        }

        if (win > 0) {

            coins += win;

            result.textContent =
                "🎉 Выигрыш: +" +
                win +
                " 🪙";

        }

        else {

            result.textContent =
                "😢 Проигрыш: " +
                bet +
                " 🪙";

        }

        save();
        update();

    }, 1500);

}


// ==============================
// 🎲 КУБИК
// ==============================

function playDice() {

    const input =
        document.getElementById("diceBet");

    const bet =
        Number(input.value);

    const numberElement =
        document.getElementById("diceNumber");

    const resultElement =
        document.getElementById("diceResult");

    if (!bet || bet <= 0) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }

    if (coins < bet) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }

    coins -= bet;

    if (resultElement) {

        resultElement.textContent =
            "🎲 Бросаем кубик...";

    }

    const dice =
        document.getElementById("diceVisual");

    if (dice) {

        dice.classList.add(
            "dice-roll"
        );

    }

    save();
    update();

    setTimeout(function() {

        const number =
            Math.floor(
                Math.random() * 6
            ) + 1;

        if (dice) {

            dice.classList.remove(
                "dice-roll"
            );

        }

        if (numberElement) {

            numberElement.textContent =
                "🎲 Выпало число: " +
                number;

        }

        if (number >= 5) {

            const win =
                bet * 2;

            coins += win;

            resultElement.textContent =
                "🎉 Победа! +" +
                win +
                " 🪙";

        }

        else {

            resultElement.textContent =
                "😢 Ты проиграл " +
                bet +
                " 🪙";

        }

        save();
        update();

    }, 1000);

}


// ==============================
// 🎡 РУЛЕТКА
// ==============================

let selectedRouletteColor = null;


function selectRouletteColor(color) {

    selectedRouletteColor =
        color;

    const selected =
        document.getElementById(
            "selectedRouletteColor"
        );

    if (!selected) {
        return;
    }

    if (color === "red") {

        selected.textContent =
            "🔴 Выбрано: Красное x2";

    }

    if (color === "black") {

        selected.textContent =
            "⚫ Выбрано: Чёрное x2";

    }

    if (color === "green") {

        selected.textContent =
            "🟢 Выбрано: Зелёное x14";

    }

}


function playRoulette() {

    const betInput =
        document.getElementById(
            "rouletteBet"
        );

    const bet =
        Number(betInput.value);

    const resultElement =
        document.getElementById(
            "rouletteResult"
        );

    const numberElement =
        document.getElementById(
            "rouletteNumber"
        );

    const wheel =
        document.getElementById(
            "rouletteWheel"
        );

    if (!bet || bet <= 0) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }

    if (!selectedRouletteColor) {

        alert(
            "❌ Выберите цвет!"
        );

        return;

    }

    if (coins < bet) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }

    coins -= bet;

    if (wheel) {

        wheel.classList.remove(
            "roulette-spin"
        );

        void wheel.offsetWidth;

        wheel.classList.add(
            "roulette-spin"
        );

    }

    if (numberElement) {

        numberElement.textContent =
            "🎡 Вращение...";

    }

    if (resultElement) {

        resultElement.textContent =
            "🎡 Рулетка вращается...";

    }

    save();
    update();

    const playerColor =
        selectedRouletteColor;

    setTimeout(function() {

        const number =
            Math.floor(
                Math.random() * 37
            );

        let resultColor;

        if (number === 0) {

            resultColor =
                "green";

        }

        else if (
            [
                1, 3, 5, 7, 9,
                12, 14, 16, 18,
                19, 21, 23, 25,
                27, 30, 32, 34, 36
            ].includes(number)
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

        if (numberElement) {

            if (resultColor === "red") {

                numberElement.textContent =
                    number +
                    " — 🔴 КРАСНОЕ";

            }

            else if (
                resultColor === "black"
            ) {

                numberElement.textContent =
                    number +
                    " — ⚫ ЧЁРНОЕ";

            }

            else {

                numberElement.textContent =
                    "0 — 🟢 ЗЕЛЁНОЕ";

            }

        }

        let win = 0;

        if (
            playerColor ===
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
                "🎉 ПОБЕДА! Ставка " +
                bet +
                " 🪙 → выигрыш +" +
                win +
                " 🪙";

        }

        else {

            resultElement.textContent =
                "😢 Проигрыш! Ставка " +
                bet +
                " 🪙";

        }

        save();
        update();

        selectedRouletteColor =
            null;

        const selected =
            document.getElementById(
                "selectedRouletteColor"
            );

        if (selected) {

            selected.textContent =
                "Цвет не выбран";

        }

        betInput.value = "";

    }, 1500);

}


// ==============================
// 📈 ЛЕСЕНКА
// ==============================

let ladderActive = false;
let ladderBet = 0;
let ladderLevel = 0;


function playLadder() {

    const input =
        document.getElementById(
            "ladderBet"
        );

    const result =
        document.getElementById(
            "ladderResult"
        );

    if (!ladderActive) {

        const bet =
            Number(input.value);

        if (!bet || bet <= 0) {

            alert(
                "❌ Введите ставку!"
            );

            return;

        }

        if (coins < bet) {

            alert(
                "❌ Недостаточно монет!"
            );

            return;

        }

        coins -= bet;

        ladderBet = bet;

        ladderLevel = 0;

        ladderActive = true;

        result.textContent =
            "📈 Лесенка начата!";

    }

    if (ladderActive) {

        ladderLevel++;

        const multiplier =
            1 +
            ladderLevel * 0.5;

        const possibleWin =
            Math.floor(
                ladderBet *
                multiplier
            );

        document.getElementById(
            "ladderLevel"
        ).textContent =
            "Уровень: " +
            ladderLevel;

        document.getElementById(
            "ladderMultiplier"
        ).textContent =
            "Множитель: x" +
            multiplier.toFixed(1);

        document.getElementById(
            "ladderWin"
        ).textContent =
            "Можно забрать: " +
            possibleWin +
            " 🪙";

        const chance =
            Math.random();

        if (chance < 0.35) {

            result.textContent =
                "💥 Ты упал! Ставка потеряна.";

            ladderActive = false;

            ladderBet = 0;

            ladderLevel = 0;

        }

        else {

            result.textContent =
                "📈 Уровень пройден!";

        }

        save();
        update();

    }

}


function cashOutLadder() {

    if (!ladderActive) {

        alert(
            "❌ Сначала начни лесенку!"
        );

        return;

    }

    const multiplier =
        1 +
        ladderLevel * 0.5;

    const win =
        Math.floor(
            ladderBet *
            multiplier
        );

    coins += win;

    const result =
        document.getElementById(
            "ladderResult"
        );

    result.textContent =
        "🏆 Ты забрал " +
        win +
        " 🪙!";

    ladderActive = false;

    ladderBet = 0;

    ladderLevel = 0;

    save();
    update();

}


// ==============================
// 💎 ДЖЕКПОТ
// ==============================

function playJackpot() {

    const input =
        document.getElementById(
            "jackpotBet"
        );

    const bet =
        Number(input.value);

    const result =
        document.getElementById(
            "jackpotResult"
        );

    if (!bet || bet <= 0) {

        alert(
            "❌ Введите ставку!"
        );

        return;

    }

    if (coins < bet) {

        alert(
            "❌ Недостаточно монет!"
        );

        return;

    }

    coins -= bet;

    result.textContent =
        "💎 Испытываем удачу...";

    save();
    update();

    setTimeout(function() {

        const chance =
            Math.random();

        if (chance < 0.05) {

            const win =
                bet * 20;

            coins += win;

            result.textContent =
                "🎉💎 ДЖЕКПОТ! +" +
                win +
                " 🪙";

        }

        else {

            result.textContent =
                "😢 Не повезло! Ставка " +
                bet +
                " 🪙 потеряна.";

        }

        save();
        update();

    }, 2000);

}


// ==============================
// 🎰 ОТКРЫТИЕ ИГРЫ
// ==============================

function openCasinoGame(game) {

    const casinoGame =
        document.getElementById(
            "casinoGame"
        );

    if (casinoGame) {

        casinoGame.classList.remove(
            "hidden"
        );

    }

    document
        .querySelectorAll(
            ".casino-panel"
        )
        .forEach(function(panel) {

            panel.classList.add(
                "hidden"
            );

        });

    const selected =
        document.getElementById(
            game + "Game"
        );

    if (selected) {

        selected.classList.remove(
            "hidden"
        );

    }

}


// ==============================
// 🔙 НАЗАД
// ==============================

function closeCasinoGame() {

    const casinoGame =
        document.getElementById(
            "casinoGame"
        );

    if (casinoGame) {

        casinoGame.classList.add(
            "hidden"
        );

    }

}


// ==============================
// 🐾 ПИТОМЦЫ
// ==============================

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

    if (!container) {
        return;
    }

    container.innerHTML = "";

    petList.forEach(function(pet) {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "pet";

        div.textContent =
            pet;

        container.appendChild(
            div
        );

    });

}


// ==============================
// 🚀 ЗАПУСК
// ==============================

showPets();

update();


// ==============================
// 📱 TELEGRAM
// ==============================

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

    if (user) {

        const nickname =
            document.getElementById(
                "nickname"
            );

        if (nickname) {

            nickname.textContent =
                user.username
                    ? "@" + user.username
                    : user.first_name ||
                      "Игрок";

        }

    }

}