// ==========================================
// 🍀 LUCKY CLICK 2.0 — SCRIPT.JS
// ==========================================


// ==========================================
// 💰 СОСТОЯНИЕ ИГРЫ
// ==========================================

let coins =
    Number(localStorage.getItem("coins")) || 0.0;

let clickPower =
    Number(localStorage.getItem("clickPower")) || 0.1;

let clickPrice =
    Number(localStorage.getItem("clickPrice")) || 100;

let inventory =
    JSON.parse(
        localStorage.getItem("inventory")
    ) || [];

let totalClicks =
    Number(localStorage.getItem("totalClicks")) || 0;


// ==========================================
// 💾 СОХРАНЕНИЕ
// ==========================================

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
        "inventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "totalClicks",
        totalClicks
    );

}


// ==========================================
// 💰 ОБНОВЛЕНИЕ БАЛАНСА
// ==========================================

function updateBalance() {

    const balanceElements =
        document.querySelectorAll(
            ".balance"
        );


    balanceElements.forEach(
        function(element) {

            element.textContent =
                coins.toFixed(1) +
                " 🪙";

        }
    );


    const clickPowerElements =
        document.querySelectorAll(
            ".click-power"
        );


    clickPowerElements.forEach(
        function(element) {

            element.textContent =
                "+" +
                clickPower.toFixed(1) +
                " 🪙";

        }
    );


    const priceElements =
        document.querySelectorAll(
            ".click-price"
        );


    priceElements.forEach(
        function(element) {

            element.textContent =
                Math.floor(
                    clickPrice
                ) +
                " 🪙";

        }
    );

}


// ==========================================
// 🪙 ГЛАВНЫЙ КЛИК
// ==========================================

function clickCoin() {

    totalClicks++;


    // Обычный доход

    let reward =
        clickPower;


    // ======================================
    // 🎁 РЕДКИЕ БОНУСЫ
    // ======================================

    const random =
        Math.random();


    let bonusMessage =
        "";


    // 💎 Сверхредкий бонус
    // 0.05%

    if (
        random < 0.0005
    ) {

        const bonus =
            100;


        reward += bonus;


        bonusMessage =

            "💎💎💎 СУПЕР БОНУС +" +
            bonus +
            " 🪙!";

    }


    // 🎁 Очень редкий бонус
    // 0.3%

    else if (
        random < 0.0035
    ) {

        const bonus =
            10;


        reward += bonus;


        bonusMessage =

            "🎁 РЕДКИЙ БОНУС +" +
            bonus +
            " 🪙!";

    }


    // ⚡ Редкий бонус
    // 2%

    else if (
        random < 0.0235
    ) {

        const bonus =
            1;


        reward += bonus;


        bonusMessage =

            "⚡ БОНУС +" +
            bonus +
            " 🪙!";

    }


    coins += reward;


    showClickEffect(
        reward,
        bonusMessage
    );


    saveGame();

    updateBalance();

}


// ==========================================
// ✨ ЭФФЕКТ КЛИКА
// ==========================================

function showClickEffect(
    reward,
    bonusMessage
) {

    const container =
        document.getElementById(
            "clickEffects"
        );


    if (!container) {

        return;

    }


    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "click-effect";


    effect.textContent =

        bonusMessage

        ?

        bonusMessage

        :

        "+" +
        reward.toFixed(1) +
        " 🪙";


    container.appendChild(
        effect
    );


    setTimeout(
        function() {

            effect.remove();

        },
        1200
    );

}


// ==========================================
// ⚡ УЛУЧШЕНИЕ КЛИКА
// ==========================================

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


    // Увеличиваем доход

    if (
        clickPower < 1
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
            clickPower.toFixed(
                1
            )
        );


    // Цена увеличивается

    clickPrice *=
        2;


    saveGame();

    updateBalance();


    showMessage(

        "⚡ Клик улучшен! " +

        "+" +

        clickPower.toFixed(
            1
        ) +

        " 🪙 за клик"

    );

}


// ==========================================
// 📱 НАВИГАЦИЯ
// ==========================================

function openPage(
    pageId
) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            function(page) {

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


// ==========================================
// 🎰 ОТКРЫТИЕ ИГРЫ
// ==========================================

function openGame(
    gameId
) {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            function(game) {

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


// ==========================================
// 🔙 НАЗАД В КАЗИНО
// ==========================================

function backToCasino() {

    document
        .querySelectorAll(
            ".game-screen"
        )
        .forEach(
            function(game) {

                game.classList.add(
                    "hidden"
                );

            }
        );


    const casino =
        document.getElementById(
            "casinoMenu"
        );


    if (
        casino
    ) {

        casino.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// 💬 СООБЩЕНИЯ
// ==========================================

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
        function() {

            message.classList.remove(
                "show"
            );

        },
        2000
    );

}


// ==========================================
// 🎁 КЕЙСЫ
// ==========================================

const cases = {

    common: {

        name:
            "Обычный кейс",

        price:
            5000

    },


    rare: {

        name:
            "Редкий кейс",

        price:
            25000

    },


    legendary: {

        name:
            "Легендарный кейс",

        price:
            100000

    },


    mythical: {

        name:
            "Мифический кейс",

        price:
            500000

    }

};


// ==========================================
// 🎁 ПРЕДМЕТЫ
// ==========================================

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


// ==========================================
// 🎁 ОТКРЫТИЕ КЕЙСА
// ==========================================

function openCase(
    type
) {

    const caseData =
        cases[type];


    if (
        !caseData
    ) {

        return;

    }


    if (
        coins <
        caseData.price
    ) {

        showMessage(
            "❌ Недостаточно монет"
        );

        return;

    }


    coins -=
        caseData.price;


    // Выбор предмета

    const random =
        Math.random();


    let gift;


    if (
        random < 0.55
    ) {

        gift =
            gifts[0];

    }

    else if (
        random < 0.80
    ) {

        gift =
            gifts[1];

    }

    else if (
        random < 0.94
    ) {

        gift =
            gifts[2];

    }

    else if (
        random < 0.985
    ) {

        gift =
            gifts[3];

    }

    else if (
        random < 0.998
    ) {

        gift =
            gifts[4];

    }

    else {

        gift =
            gifts[5];

    }


    // Добавляем в инвентарь

    inventory.push(
        gift
    );


    saveGame();

    updateBalance();


    showGiftResult(
        gift
    );

}


// ==========================================
// 🎁 ПОКАЗ ВЫПАВШЕГО ПОДАРКА
// ==========================================

function showGiftResult(
    gift
) {

    const result =
        document.getElementById(
            "caseResult"
        );


    if (!result) {

        return;

    }


    result.innerHTML =

        "<div class='gift-result'>" +

        "<div class='gift-big'>" +

        gift.emoji +

        "</div>" +

        "<h2>" +

        "🎉 ТЕБЕ ВЫПАЛО!" +

        "</h2>" +

        "<h3>" +

        gift.name +

        "</h3>" +

        "<p>" +

        "⭐ " +

        gift.rarity +

        "</p>" +

        "<p>" +

        "💰 Стоимость: " +

        gift.price.toLocaleString() +

        " 🪙" +

        "</p>" +

        "<p>" +

        "⚡ Доход: +" +

        gift.income +

        " 🪙 / 10 мин" +

        "</p>" +

        "<button onclick='sellLastGift()'>" +

        "💰 ПРОДАТЬ" +

        "</button>" +

        "</div>";

}


// ==========================================
// 💰 ПРОДАЖА ПОСЛЕДНЕГО ПРЕДМЕТА
// ==========================================

function sellLastGift() {

    if (
        inventory.length ===
        0
    ) {

        return;

    }


    const gift =
        inventory.pop();


    coins +=
        gift.price;


    saveGame();

    updateBalance();


    showMessage(

        "💰 Продано за " +

        gift.price.toLocaleString() +

        " 🪙"

    );

}


// ==========================================
// ⚡ ПАССИВНЫЙ ДОХОД
// ==========================================

setInterval(

    function() {

        let income =
            0;


        inventory.forEach(

            function(gift) {

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


// ==========================================
// 🎒 ИНВЕНТАРЬ
// ==========================================

function renderInventory() {

    const container =
        document.getElementById(
            "inventory"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    inventory.forEach(

        function(gift, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "inventory-card";


            card.innerHTML =

                "<div class='inventory-icon'>" +

                gift.emoji +

                "</div>" +

                "<b>" +

                gift.name +

                "</b>" +

                "<span>" +

                gift.rarity +

                "</span>" +

                "<small>" +

                "+" +

                gift.income +

                " 🪙 / 10 мин" +

                "</small>" +

                "<button onclick='sellGift(" +

                index +

                ")'>" +

                "Продать" +

                "</button>";


            container.appendChild(
                card
            );

        }

    );

}


// ==========================================
// 💰 ПРОДАЖА ПРЕДМЕТА
// ==========================================

function sellGift(
    index
) {

    const gift =
        inventory[index];


    if (!gift) {

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

}


// ==========================================
// 🚀 ЗАПУСК
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    function() {

        updateBalance();

        renderInventory();

    }

);