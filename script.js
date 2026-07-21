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
// 🔄 ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==============================

function update() {

    let coinsElement = document.getElementById("coins");
    let clickPowerElement = document.getElementById("clickPower");
    let clickPriceElement = document.getElementById("clickPrice");
    let profileCoinsElement = document.getElementById("profileCoins");

    if (coinsElement) {
        coinsElement.textContent = Math.floor(coins);
    }

    if (clickPowerElement) {
        clickPowerElement.textContent = clickPower;
    }

    if (clickPriceElement) {
        clickPriceElement.textContent = clickPrice;
    }

    if (profileCoinsElement) {
        profileCoinsElement.textContent = Math.floor(coins);
    }

}


// ==============================
// 🪙 КЛИКЕР
// ==============================

function clickCoin() {

    coins += clickPower;

    save();
    update();

}


// Если кнопка имеет id="clickButton"

let clickButton = document.getElementById("clickButton");

if (clickButton) {

    clickButton.addEventListener("click", function() {

        coins += clickPower;

        save();
        update();

    });

}


// ==============================
// 📄 ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ==============================

function showPage(pageName) {

    let pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.add("hidden");

    });

    let page = document.getElementById(pageName);

    if (page) {

        page.classList.remove("hidden");

    }

}


// ==============================
// ⚡ УЛУЧШЕНИЕ КЛИКА
// ==============================

function buyClick() {

    if (coins < clickPrice) {

        alert("❌ Недостаточно монет!");

        return;

    }

    coins -= clickPrice;

    clickPower += 1;

    clickPrice *= 2;

    save();
    update();

    alert("⚡ Сила клика увеличена!");

}


// ==============================
// 🤖 АВТОКЛИК
// ==============================

function buyAuto() {

    if (coins < 5000) {

        alert("❌ Нужно 5000 монет!");

        return;

    }

    coins -= 5000;

    autoClick += 1;

    save();
    update();

    alert("🤖 Автоклик куплен!");

}


// Автоклик каждую секунду

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

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }

    coins -= 100;

    let reels = [

        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3")

    ];

    let symbols = [

        "🍀",
        "💎",
        "⭐",
        "🍒",
        "7️⃣",
        "🔔"

    ];

    if (
        reels[0] &&
        reels[1] &&
        reels[2]
    ) {

        reels.forEach(function(reel) {

            reel.classList.add("slot-spin");

        });

    }

    let resultElement =
        document.getElementById("casinoResult");

    if (resultElement) {

        resultElement.textContent =
            "🎰 Крутим...";

    }

    setTimeout(function() {

        let result = [

            symbols[Math.floor(Math.random() * symbols.length)],

            symbols[Math.floor(Math.random() * symbols.length)],

            symbols[Math.floor(Math.random() * symbols.length)]

        ];

        if (reels[0]) {
            reels[0].textContent = result[0];
        }

        if (reels[1]) {
            reels[1].textContent = result[1];
        }

        if (reels[2]) {
            reels[2].textContent = result[2];
        }

        reels.forEach(function(reel) {

            if (reel) {

                reel.classList.remove("slot-spin");

            }

        });

        if (
            result[0] === result[1] &&
            result[1] === result[2]
        ) {

            let win = 5000;

            coins += win;

            if (resultElement) {

                resultElement.textContent =
                    "🎉💎 ДЖЕКПОТ! +" +
                    win +
                    " 🪙";

            }

        }

        else if (
            result[0] === result[1] ||
            result[1] === result[2] ||
            result[0] === result[2]
        ) {

            let win = 300;

            coins += win;

            if (resultElement) {

                resultElement.textContent =
                    "🎉 Выигрыш +" +
                    win +
                    " 🪙";

            }

        }

        else {

            if (resultElement) {

                resultElement.textContent =
                    "😢 Не повезло!";

            }

        }

        save();
        update();

    }, 1500);

}


// ==============================
// 🎲 КУБИК
// ==============================

function playDice() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }

    coins -= 100;

    let dice =
        document.getElementById("diceVisual");

    let resultElement =
        document.getElementById("casinoResult");

    if (dice) {

        dice.classList.add("dice-roll");

    }

    if (resultElement) {

        resultElement.textContent =
            "🎲 Бросаем кубик...";

    }

    setTimeout(function() {

        let result =
            Math.floor(Math.random() * 6) + 1;

        if (dice) {

            dice.textContent =
                "🎲";

            dice.classList.remove("dice-roll");

        }

        if (result >= 5) {

            let win = 500;

            coins += win;

            if (resultElement) {

                resultElement.textContent =
                    "🎲 Выпало " +
                    result +
                    "! 🎉 +" +
                    win +
                    " 🪙";

            }

        }

        else {

            if (resultElement) {

                resultElement.textContent =
                    "🎲 Выпало " +
                    result +
                    ". 😢";

            }

        }

        save();
        update();

    }, 1000);

}


// ==============================
// 🎡 РУЛЕТКА
// ==============================

function playRoulette() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }

    coins -= 100;

    let wheel =
        document.getElementById("rouletteWheel");

    let resultElement =
        document.getElementById("casinoResult");

    if (wheel) {

        wheel.classList.add("roulette-spin");

    }

    if (resultElement) {

        resultElement.textContent =
            "🎡 Рулетка вращается...";

    }

    setTimeout(function() {

        let result =
            Math.floor(Math.random() * 37);

        let color;

        if (result === 0) {

            color = "🟢 Зелёное";

        }

        else if (
            [
                1, 3, 5, 7, 9,
                12, 14, 16, 18,
                19, 21, 23, 25,
                27, 30, 32, 34, 36
            ].includes(result)
        ) {

            color = "🔴 Красное";

        }

        else {

            color = "⚫ Чёрное";

        }

        if (wheel) {

            wheel.classList.remove("roulette-spin");

        }

        if (result === 0) {

            coins += 3600;

            if (resultElement) {

                resultElement.textContent =
                    "🎉💚 ЗЕЛЁНОЕ 0! +3600 🪙";

            }

        }

        else if (color === "🔴 Красное") {

            coins += 200;

            if (resultElement) {

                resultElement.textContent =
                    "🔴 КРАСНОЕ! Выпало " +
                    result +
                    " 🎉 +200 🪙";

            }

        }

        else {

            if (resultElement) {

                resultElement.textContent =
                    "⚫ ЧЁРНОЕ! Выпало " +
                    result +
                    " 😢";

            }

        }

        save();
        update();

    }, 1500);

}


// ==============================
// 📈 ЛЕСЕНКА
// ==============================

function playLadder() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }

    coins -= 100;

    let level = 0;

    function nextLevel() {

        level++;

        let chance =
            Math.random();

        if (chance < 0.4) {

            let resultElement =
                document.getElementById("casinoResult");

            if (resultElement) {

                resultElement.textContent =
                    "💥 Ты упал на уровне " +
                    level +
                    "!";

            }

            save();
            update();

            return;

        }

        let reward =
            level * 200;

        let go =
            confirm(
                "📈 Уровень " +
                level +
                " пройден!\n\n" +
                "💰 Награда: " +
                reward +
                " монет\n\n" +
                "Продолжить?"
            );

        if (go) {

            nextLevel();

        }

        else {

            coins += reward;

            let resultElement =
                document.getElementById("casinoResult");

            if (resultElement) {

                resultElement.textContent =
                    "🏆 Ты забрал " +
                    reward +
                    " 🪙!";

            }

            save();
            update();

        }

    }

    nextLevel();

}


// ==============================
// 💎 ДЖЕКПОТ
// ==============================

function playJackpot() {

    if (coins < 1000) {

        alert("❌ Нужно 1000 монет!");

        return;

    }

    coins -= 1000;

    let jackpot =
        document.getElementById("jackpotVisual");

    let resultElement =
        document.getElementById("casinoResult");

    if (jackpot) {

        jackpot.classList.add("jackpot-animation");

    }

    if (resultElement) {

        resultElement.textContent =
            "💎 Испытываем удачу...";

    }

    setTimeout(function() {

        let chance =
            Math.random();

        if (chance < 0.05) {

            coins += 100000;

            if (resultElement) {

                resultElement.textContent =
                    "🎉🎉🎉 ДЖЕКПОТ!!! +100000 🪙 🎉🎉🎉";

            }

        }

        else {

            if (resultElement) {

                resultElement.textContent =
                    "💎 В этот раз не повезло 😢";

            }

        }

        save();
        update();

    }, 2000);

}


// ==============================
// 🎁 КЕЙСЫ
// ==============================

function openCase(type) {

    let price = 0;

    let reward = 0;

    if (type === "common") {

        price = 5000;

        reward =
            Math.floor(Math.random() * 10000) + 1000;

    }

    else if (type === "rare") {

        price = 12000;

        reward =
            Math.floor(Math.random() * 30000) + 5000;

    }

    else if (type === "legend") {

        price = 100000;

        reward =
            Math.floor(Math.random() * 300000) + 50000;

    }

    if (coins < price) {

        alert("❌ Недостаточно монет!");

        return;

    }

    coins -= price;

    coins += reward;

    let caseResult =
        document.getElementById("caseResult");

    if (caseResult) {

        caseResult.textContent =
            "🎁 Ты открыл кейс и получил 💰 " +
            reward +
            " монет!";

    }

    save();
    update();

}


// ==============================
// 🐾 ПИТОМЦЫ
// ==============================

let petList = [

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

    let container =
        document.getElementById("petsList");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    petList.forEach(function(pet) {

        let div =
            document.createElement("div");

        div.className =
            "pet";

        div.textContent =
            pet;

        container.appendChild(div);

    });

}


// ==============================
// 🎰 ОТКРЫТИЕ ИГРЫ КАЗИНО
// ==============================

function openCasinoGame(game) {

    let casinoGame =
        document.getElementById("casinoGame");

    if (casinoGame) {

        casinoGame.classList.remove("hidden");

    }

    document
        .querySelectorAll(".casino-panel")
        .forEach(function(panel) {

            panel.classList.add("hidden");

        });

    let selected =
        document.getElementById(game + "Game");

    if (selected) {

        selected.classList.remove("hidden");

    }

    if (casinoGame) {

        casinoGame.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ==============================
// 🔙 НАЗАД ИЗ КАЗИНО
// ==============================

function closeCasinoGame() {

    let casinoGame =
        document.getElementById("casinoGame");

    if (casinoGame) {

        casinoGame.classList.add("hidden");

    }

}


// ==============================
// 🎬 АНИМАЦИЯ
// ==============================

function casinoAnimation(element, className) {

    if (!element) {

        return;

    }

    element.classList.remove(className);

    void element.offsetWidth;

    element.classList.add(className);

}


// ==============================
// 🚀 ЗАПУСК
// ==============================

showPets();

update();

save();


// ==============================
// 📱 TELEGRAM MINI APP
// ==============================

if (
    window.Telegram &&
    window.Telegram.WebApp
) {

    const tg =
        window.Telegram.WebApp;

    tg.ready();

    tg.expand();

    console.log(
        "Telegram Mini App запущен"
    );

}