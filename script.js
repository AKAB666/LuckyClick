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