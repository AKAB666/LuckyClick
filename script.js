// ==============================
// Lucky Click — основной код
// ==============================

// Данные игрока
let coins = Number(localStorage.getItem("coins")) || 0;
let clickPower = Number(localStorage.getItem("clickPower")) || 1;
let clickPrice = Number(localStorage.getItem("clickPrice")) || 100;
let autoClick = Number(localStorage.getItem("autoClick")) || 0;

let pets = JSON.parse(localStorage.getItem("pets")) || [];


// ==============================
// Сохранение
// ==============================

function save() {

    localStorage.setItem("coins", coins);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("clickPrice", clickPrice);
    localStorage.setItem("autoClick", autoClick);
    localStorage.setItem("pets", JSON.stringify(pets));

}


// ==============================
// Обновление интерфейса
// ==============================

function update() {

    document.getElementById("coins").textContent =
        Math.floor(coins);

    document.getElementById("clickPower").textContent =
        clickPower;

    document.getElementById("clickPrice").textContent =
        clickPrice;

    document.getElementById("profileCoins").textContent =
        Math.floor(coins);

}


// ==============================
// КЛИКЕР
// ==============================

document.getElementById("clickButton").addEventListener("click", function() {

    coins += clickPower;

    save();
    update();

});


// ==============================
// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
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
// УЛУЧШЕНИЕ КЛИКА
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
// АВТОКЛИК
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

        alert("❌ Минимальная ставка 100 монет!");

        return;

    }


    coins -= 100;


    let a = Math.floor(Math.random() * 7);
    let b = Math.floor(Math.random() * 7);
    let c = Math.floor(Math.random() * 7);


    let result = "🎰 " + a + " | " + b + " | " + c;


    if (a === b && b === c) {

        let win = 2000;

        coins += win;

        document.getElementById("casinoResult").textContent =
            result + " 🎉 ДЖЕКПОТ! +" + win;

    }

    else if (a === b || b === c || a === c) {

        let win = 300;

        coins += win;

        document.getElementById("casinoResult").textContent =
            result + " 🎉 Выигрыш +" + win;

    }

    else {

        document.getElementById("casinoResult").textContent =
            result + " 😢 Проигрыш";

    }


    save();
    update();

}


// ==============================
// 🎲 КУБИК
// ==============================

function playDice() {

    if (coins < 100) {

        alert("❌ Минимальная ставка 100 монет!");

        return;

    }


    let choice = prompt(
        "🎲 Выбери число от 1 до 6"
    );


    choice = Number(choice);


    if (choice < 1 || choice > 6) {

        alert("❌ Неверное число!");

        return;

    }


    coins -= 100;


    let result =
        Math.floor(Math.random() * 6) + 1;


    if (choice === result) {

        coins += 600;

        document.getElementById("casinoResult").textContent =
            "🎲 Выпало " + result +
            " 🎉 Ты выиграл 600 монет!";

    }

    else {

        document.getElementById("casinoResult").textContent =
            "🎲 Выпало " + result +
            " 😢 Ты проиграл!";

    }


    save();
    update();

}


// ==============================
// 🎡 РУЛЕТКА
// ==============================

function playRoulette() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }


    let choice = prompt(
        "🎡 Выбери красное или чёрное"
    );


    choice = choice.toLowerCase();


    if (
        choice !== "красное" &&
        choice !== "черное" &&
        choice !== "чёрное"
    ) {

        alert("❌ Напиши: красное или чёрное");

        return;

    }


    coins -= 100;


    let colors = [
        "красное",
        "чёрное"
    ];


    let result =
        colors[Math.floor(Math.random() * 2)];


    if (choice === result ||
        (choice === "черное" && result === "чёрное")) {

        coins += 200;

        document.getElementById("casinoResult").textContent =
            "🎡 Выпало " + result +
            " 🎉 Ты выиграл!";

    }

    else {

        document.getElementById("casinoResult").textContent =
            "🎡 Выпало " + result +
            " 😢 Ты проиграл!";

    }


    save();
    update();

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

    let playing = true;


    while (playing) {

        level++;


        let win =
            Math.random() > 0.5;


        if (!win) {

            document.getElementById("casinoResult").textContent =
                "📈 Ты проиграл на уровне " +
                level;

            playing = false;

        }

        else {

            let reward =
                100 * level;


            coins += reward;


            let next =
                confirm(
                    "📈 Уровень " +
                    level +
                    " пройден!\n" +
                    "Выигрыш: " +
                    reward +
                    "\n\nПродолжить?"
                );


            if (!next) {

                document.getElementById("casinoResult").textContent =
                    "📈 Ты забрал " +
                    reward +
                    " монет!";

                playing = false;

            }

        }

    }


    save();
    update();

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


    let chance =
        Math.random();


    if (chance < 0.01) {

        coins += 100000;


        document.getElementById("casinoResult").textContent =
            "💎💎💎 ДЖЕКПОТ!!! +100000 💎💎💎";

    }

    else {

        document.getElementById("casinoResult").textContent =
            "💎 Джекпот не выпал 😢";

    }


    save();
    update();

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
            Math.floor(
                Math.random() * 10000
            ) + 1000;

    }


    if (type === "rare") {

        price = 12000;

        reward =
            Math.floor(
                Math.random() * 30000
            ) + 5000;

    }


    if (type === "legend") {

        price = 100000;

        reward =
            Math.floor(
                Math.random() * 300000
            ) + 50000;

    }


    if (coins < price) {

        alert("❌ Недостаточно монет!");

        return;

    }


    coins -= price;

    coins += reward;


    document.getElementById("caseResult").textContent =
        "🎁 Ты открыл кейс и получил 💰 " +
        reward +
        " монет!";


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


    container.innerHTML = "";


    petList.forEach(function(pet) {

        let div =
            document.createElement("div");


        div.className = "pet";


        div.textContent = pet;


        container.appendChild(div);

    });

}


showPets();


// ==============================
// ЗАПУСК ИГРЫ
// ==============================

update();
function animateResult(type) {

    let result = document.getElementById("casinoResult");

    result.classList.remove(
        "win-animation",
        "lose-animation",
        "slot-spin",
        "dice-roll",
        "roulette-spin",
        "jackpot-animation",
        "result-show"
    );

    void result.offsetWidth;

    if (type === "win") {
        result.classList.add("win-animation");
    }

    if (type === "lose") {
        result.classList.add("lose-animation");
    }

    if (type === "slot") {
        result.classList.add("slot-spin");
    }

    if (type === "dice") {
        result.classList.add("dice-roll");
    }

    if (type === "roulette") {
        result.classList.add("roulette-spin");
    }

    if (type === "jackpot") {
        result.classList.add("jackpot-animation");
    }

    result.classList.add("result-show");
}
// ==============================
// НОВОЕ КАЗИНО
// ==============================

function openCasinoGame(game) {

    // Показываем игровую область
    document.getElementById("casinoGame")
        .classList.remove("hidden");

    // Скрываем все игры
    document.querySelectorAll(".casino-panel")
        .forEach(function(panel) {

            panel.classList.add("hidden");

        });


    // Открываем выбранную игру
    let selected =
        document.getElementById(game + "Game");

    if (selected) {

        selected.classList.remove("hidden");

    }


    // Прокручиваем к игре
    document.getElementById("casinoGame")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==============================
// НАЗАД К ИГРАМ
// ==============================

function closeCasinoGame() {

    document.getElementById("casinoGame")
        .classList.add("hidden");

}


// ==============================
// АНИМАЦИЯ РЕЗУЛЬТАТА
// ==============================

function casinoAnimation(element, className) {

    element.classList.remove(className);

    void element.offsetWidth;

    element.classList.add(className);

}


// ==============================
// 🎰 НОВЫЙ СЛОТ
// ==============================

function playSlot() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }


    coins -= 100;

    update();
    save();


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


    // Анимация вращения

    reels.forEach(function(reel) {

        reel.classList.add("slot-spin");

    });


    document.getElementById("casinoResult")
        .textContent = "🎰 Крутим...";


    setTimeout(function() {

        let result = [

            symbols[Math.floor(Math.random() * symbols.length)],

            symbols[Math.floor(Math.random() * symbols.length)],

            symbols[Math.floor(Math.random() * symbols.length)]

        ];


        reels[0].textContent = result[0];

        reels[1].textContent = result[1];

        reels[2].textContent = result[2];


        reels.forEach(function(reel) {

            reel.classList.remove("slot-spin");

        });


        if (
            result[0] === result[1] &&
            result[1] === result[2]
        ) {

            let win = 5000;

            coins += win;


            document.getElementById("casinoResult")
                .textContent =
                "🎉💎 ДЖЕКПОТ! +" +
                win +
                " 🪙";


            casinoAnimation(
                document.getElementById("casinoResult"),
                "jackpot-animation"
            );

        }

        else if (
            result[0] === result[1] ||
            result[1] === result[2] ||
            result[0] === result[2]
        ) {

            let win = 300;

            coins += win;


            document.getElementById("casinoResult")
                .textContent =
                "🎉 Выигрыш +" +
                win +
                " 🪙";

        }

        else {

            document.getElementById("casinoResult")
                .textContent =
                "😢 Не повезло!";

        }


        update();
        save();


    }, 1500);

}


// ==============================
// 🎲 НОВЫЙ КУБИК
// ==============================

function playDice() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }


    coins -= 100;


    let dice =
        document.getElementById("diceVisual");


    casinoAnimation(
        dice,
        "dice-roll"
    );


    document.getElementById("casinoResult")
        .textContent =
        "🎲 Бросаем кубик...";


    setTimeout(function() {

        let result =
            Math.floor(Math.random() * 6) + 1;


        dice.textContent =
            "🎲";


        if (result >= 5) {

            let win = 500;

            coins += win;


            document.getElementById("casinoResult")
                .textContent =
                "🎲 Выпало " +
                result +
                "! 🎉 +" +
                win +
                " 🪙";

        }

        else {

            document.getElementById("casinoResult")
                .textContent =
                "🎲 Выпало " +
                result +
                ". 😢";

        }


        update();
        save();


    }, 1000);

}


// ==============================
// 🎡 НОВАЯ РУЛЕТКА
// ==============================

function playRoulette() {

    if (coins < 100) {

        alert("❌ Нужно 100 монет!");

        return;

    }


    coins -= 100;


    let wheel =
        document.getElementById("rouletteWheel");


    casinoAnimation(
        wheel,
        "roulette-spin"
    );


    document.getElementById("casinoResult")
        .textContent =
        "🎡 Рулетка вращается...";


    setTimeout(function() {

        let colors = [

            "🔴 Красное",

            "⚫ Чёрное"

        ];


        let result =
            colors[Math.floor(
                Math.random() * colors.length
            )];


        if (result === "🔴 Красное") {

            coins += 200;

            document.getElementById("casinoResult")
                .textContent =
                result +
                " 🎉 Вы выиграли 200 🪙!";

        }

        else {

            document.getElementById("casinoResult")
                .textContent =
                result +
                " 😢 Вы проиграли!";

        }


        update();
        save();


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

            document.getElementById("casinoResult")
                .textContent =
                "💥 Ты упал на уровне " +
                level +
                "!";

            update();
            save();

            return;

        }


        let reward =
            level * 200;


        coins += reward;


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

            coins -= reward;

            nextLevel();

        }

        else {

            document.getElementById("casinoResult")
                .textContent =
                "🏆 Ты забрал " +
                reward +
                " 🪙!";

            update();
            save();

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


    casinoAnimation(
        jackpot,
        "jackpot-animation"
    );


    document.getElementById("casinoResult")
        .textContent =
        "💎 Испытываем удачу...";


    setTimeout(function() {

        let chance =
            Math.random();


        if (chance < 0.05) {

            coins += 100000;


            document.getElementById("casinoResult")
                .textContent =
                "🎉🎉🎉 ДЖЕКПОТ!!! 🎉🎉🎉";


            casinoAnimation(
                document.getElementById("casinoResult"),
                "jackpot-animation"
            );

        }

        else {

            document.getElementById("casinoResult")
                .textContent =
                "💎 В этот раз не повезло 😢";

        }


        update();
        save();


    }, 2000);

}