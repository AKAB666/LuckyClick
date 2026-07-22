/* =========================================================
🍀 LUCKY CLICK — FULL SCRIPT.JS
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
DEFAULT GAME STATE
========================================================= */

const defaultState = {
    balance: 0,
    clicks: 0,

    clickPower: 0.5,
    clickPrice: 100,

    level: 1,
    xp: 0,

    inventory: [],

    promoUsed: [],

    boosters: {
        double: 0,
        lucky: 0
    },

    luck: 0,

    vip: false,
    autoClick: false,
    passiveIncome: false,

    stats: {
        casinoGames: 0,
        casesOpened: 0,
        totalWon: 0
    }
};

/* =========================================================
LOAD GAME
========================================================= */

let state;

try {

    state =
        JSON.parse(
            localStorage.getItem(
                "luckyClickState"
            )
        ) || structuredClone(defaultState);

} catch (error) {

    state =
        structuredClone(defaultState);

}

/* =========================================================
SAVE GAME
========================================================= */

function saveGame() {

    localStorage.setItem(
        "luckyClickState",
        JSON.stringify(state)
    );

    updateUI();

}

/* =========================================================
FORMAT NUMBER
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
MESSAGE
========================================================= */

let messageTimer;

function showMessage(
    text,
    type = "success"
) {

    const el =
        document.getElementById(
            "gameMessage"
        );

    if (!el) return;

    el.textContent =
        text;

    el.className =
        "game-message show " +
        type;

    clearTimeout(
        messageTimer
    );

    messageTimer =
        setTimeout(
            () => {

                el.classList.remove(
                    "show"
                );

            },
            2500
        );

}

/* =========================================================
XP / LEVEL
========================================================= */

function xpNeeded() {

    return state.level * 100;

}

function addXP(amount) {

    state.xp +=
        amount;

    while (
        state.xp >=
        xpNeeded()
    ) {

        state.xp -=
            xpNeeded();

        state.level++;

        showMessage(
            `🎉 Новый уровень: ${state.level}`
        );

        playSound(
            800,
            0.2,
            "triangle"
        );

    }

    saveGame();

}

/* =========================================================
UPDATE UI
========================================================= */

function updateUI() {

    document
        .querySelectorAll(
            ".balance"
        )
        .forEach(
            el => {

                el.textContent =
                    formatNumber(
                        state.balance
                    );

            }
        );

    document
        .querySelectorAll(
            ".total-clicks"
        )
        .forEach(
            el => {

                el.textContent =
                    formatNumber(
                        state.clicks
                    );

            }
        );

    document
        .querySelectorAll(
            ".click-power"
        )
        .forEach(
            el => {

                el.textContent =
                    formatNumber(
                        state.clickPower
                    );

            }
        );

    document
        .querySelectorAll(
            ".click-price"
        )
        .forEach(
            el => {

                el.textContent =
                    formatNumber(
                        state.clickPrice
                    ) +
                    " 🪙";

            }
        );

    document
        .querySelectorAll(
            ".player-level"
        )
        .forEach(
            el => {

                el.textContent =
                    state.level;

            }
        );

    document
        .querySelectorAll(
            ".player-xp"
        )
        .forEach(
            el => {

                el.textContent =
                    state.xp;

            }
        );

    document
        .querySelectorAll(
            ".xp-needed"
        )
        .forEach(
            el => {

                el.textContent =
                    xpNeeded();

            }
        );

    const xpProgress =
        document.getElementById(
            "xpProgress"
        );

    if (xpProgress) {

        xpProgress.style.width =
            Math.min(
                100,
                state.xp /
                xpNeeded() *
                100
            ) +
            "%";

    }

    updateInventory();

    updateLocks();

}

/* =========================================================
CLICKER
========================================================= */

function clickCoin() {

    let power =
        state.clickPower;

    /* DOUBLE BOOST */

    if (
        state.boosters.double >
        Date.now()
    ) {

        power *= 2;

    }

    /* LUCKY BONUS */

    const luckyChance =
        0.02 +
        state.luck /
        1000;

    if (
        Math.random() <
        luckyChance
    ) {

        power *= 10;

        showMessage(
            `🍀 LUCKY BONUS ×10! +${formatNumber(power)} 🪙`
        );

        playSound(
            900,
            0.15,
            "square"
        );

    }

    state.balance +=
        power;

    state.clicks++;

    addXP(1);

    createClickEffect(
        `+${formatNumber(power)} 🪙`
    );

    saveGame();

}

/* =========================================================
CLICK EFFECT
========================================================= */

function createClickEffect(text) {

    const container =
        document.getElementById(
            "clickEffects"
        );

    if (!container) return;

    const el =
        document.createElement(
            "div"
        );

    el.className =
        "click-effect";

    el.textContent =
        text;

    el.style.left =
        Math.random() *
        80 +
        10 +
        "%";

    el.style.top =
        Math.random() *
        50 +
        25 +
        "%";

    container.appendChild(
        el
    );

    setTimeout(
        () => {

            el.remove();

        },
        1000
    );

}

/* =========================================================
UPGRADE CLICK
========================================================= */

function upgradeClick() {

    if (
        state.balance <
        state.clickPrice
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    state.balance -=
        state.clickPrice;

    state.clickPower +=
        0.5;

    state.clickPrice *=
        2;

    showMessage(
        `⚡ Клик улучшен! Теперь +${formatNumber(state.clickPower)} 🪙`
    );

    playSound(
        600,
        0.15,
        "triangle"
    );

    saveGame();

}

/* =========================================================
NAVIGATION
========================================================= */

function openPage(pageId) {

    document
        .querySelectorAll(
            ".page"
        )
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

    updateUI();

}

/* =========================================================
NAV BUTTON
========================================================= */

function setActiveNav(button) {

    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );

    button.classList.add(
        "active"
    );

}

/* =========================================================
LOCKS
========================================================= */

function updateLocks() {

    /* CASES FROM LEVEL 5 */

    const casesLocked =
        document.getElementById(
            "casesLocked"
        );

    const casesContent =
        document.getElementById(
            "casesContent"
        );

    if (
        casesLocked &&
        casesContent
    ) {

        if (
            state.level >= 5
        ) {

            casesLocked.classList.add(
                "hidden"
            );

            casesContent.classList.remove(
                "hidden"
            );

        } else {

            casesLocked.classList.remove(
                "hidden"
            );

            casesContent.classList.add(
                "hidden"
            );

        }

    }

    /* CASINO FROM LEVEL 7 */

    const casinoLocked =
        document.getElementById(
            "casinoLocked"
        );

    const casinoContent =
        document.getElementById(
            "casinoContent"
        );

    if (
        casinoLocked &&
        casinoContent
    ) {

        if (
            state.level >= 7
        ) {

            casinoLocked.classList.add(
                "hidden"
            );

            casinoContent.classList.remove(
                "hidden"
            );

        } else {

            casinoLocked.classList.remove(
                "hidden"
            );

            casinoContent.classList.add(
                "hidden"
            );

        }

    }

}

/* =========================================================
SHOP
========================================================= */

function buyBooster(type) {

    const price =
        type === "double"
            ? 1000
            : 2500;

    if (
        state.balance <
        price
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    state.balance -=
        price;

    if (
        type === "double"
    ) {

        state.boosters.double =
            Date.now() +
            60000;

        showMessage(
            "⚡ Double Click активирован на 60 секунд!"
        );

    }

    if (
        type === "lucky"
    ) {

        state.boosters.lucky =
            Date.now() +
            60000;

        state.luck +=
            20;

        showMessage(
            "🍀 Lucky Boost активирован!"
        );

        setTimeout(
            () => {

                state.luck -=
                    20;

                saveGame();

            },
            60000
        );

    }

    saveGame();

}

/* =========================================================
PASSIVE INCOME
========================================================= */

function buyPassiveIncome() {

    const price =
        10000;

    if (
        state.balance <
        price
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    if (
        state.passiveIncome
    ) {

        showMessage(
            "ℹ️ Автодоход уже активирован",
            "error"
        );

        return;

    }

    state.balance -=
        price;

    state.passiveIncome =
        true;

    showMessage(
        "💰 Автодоход активирован!"
    );

    saveGame();

}

/* =========================================================
SHOP ITEMS
========================================================= */

function buyShopItem(item) {

    const items = {

        megaClick: {

            price: 5000,

            action: () => {

                state.clickPower +=
                    1;

            },

            text:
                "🔥 Сила клика увеличена на +1!"

        },

        superClick: {

            price: 25000,

            action: () => {

                state.clickPower +=
                    5;

            },

            text:
                "🚀 Сила клика увеличена на +5!"

        },

        luck: {

            price: 15000,

            action: () => {

                state.luck +=
                    10;

            },

            text:
                "💎 Шанс Lucky Bonus увеличен!"

        },

        vip: {

            price: 100000,

            action: () => {

                state.vip =
                    true;

            },

            text:
                "👑 VIP Status активирован!"

        },

        autoClick: {

            price: 50000,

            action: () => {

                state.autoClick =
                    true;

            },

            text:
                "🤖 Автокликер активирован!"

        }

    };

    const selected =
        items[item];

    if (!selected)
        return;

    if (
        state.balance <
        selected.price
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    state.balance -=
        selected.price;

    selected.action();

    showMessage(
        selected.text
    );

    saveGame();

}

/* =========================================================
PASSIVE INCOME TIMER
========================================================= */

setInterval(
    () => {

        if (
            state.passiveIncome
        ) {

            state.balance +=
                100;

            saveGame();

        }

    },
    600000
);

/* =========================================================
AUTO CLICK
========================================================= */

setInterval(
    () => {

        if (
            state.autoClick
        ) {

            clickCoin();

        }

    },
    1000
);

/* =========================================================
PROMO CODES
========================================================= */

const promoCodes = {

    LUCKY: {

        reward: 1000

    },

    LUCKYCLICK: {

        reward: 5000

    },

    BONUS: {

        reward: 10000

    },

    VIP: {

        reward: 50000

    },

    START: {

        reward: 2500

    },

    CASINO: {

        reward: 25000

    },

    /* PERSONAL ADMIN CODE */

    ADMIN7: {

        reward: 10000,

        level: 7

    }

};

/* =========================================================
ACTIVATE PROMO
========================================================= */

function activatePromo() {

    const input =
        document.getElementById(
            "promoInput"
        );

    const message =
        document.getElementById(
            "promoMessage"
        );

    if (
        !input ||
        !message
    )
        return;

    const code =
        input.value
            .trim()
            .toUpperCase();

    if (!code) {

        message.textContent =
            "Введите промокод";

        return;

    }

    if (
        state.promoUsed.includes(
            code
        )
    ) {

        message.textContent =
            "❌ Этот промокод уже использован";

        return;

    }

    const promo =
        promoCodes[code];

    if (!promo) {

        message.textContent =
            "❌ Неверный промокод";

        return;

    }

    state.balance +=
        promo.reward;

    if (
        promo.level
    ) {

        state.level =
            Math.max(
                state.level,
                promo.level
            );

        state.xp =
            0;

    }

    state.promoUsed.push(
        code
    );

    message.textContent =
        promo.level
            ? `🎉 Промокод активирован! +${formatNumber(promo.reward)} 🪙 Уровень ${promo.level}!`
            : `🎉 Вы получили ${formatNumber(promo.reward)} 🪙`;

    input.value =
        "";

    playSound(
        900,
        0.2,
        "triangle"
    );

    saveGame();

}

/* =========================================================
CASES
========================================================= */

const caseItems = {

    common: [

        {
            name: "Монета",
            icon: "🪙",
            value: 500,
            chance: 45
        },

        {
            name: "Кристалл",
            icon: "💎",
            value: 1500,
            chance: 30
        },

        {
            name: "Корона",
            icon: "👑",
            value: 5000,
            chance: 15
        },

        {
            name: "Легенда",
            icon: "🌟",
            value: 15000,
            chance: 8
        },

        {
            name: "Миф",
            icon: "🌌",
            value: 50000,
            chance: 2
        }

    ],

    rare: [

        {
            name: "Кристалл",
            icon: "💎",
            value: 5000,
            chance: 40
        },

        {
            name: "Корона",
            icon: "👑",
            value: 15000,
            chance: 30
        },

        {
            name: "Дракон",
            icon: "🐉",
            value: 50000,
            chance: 20
        },

        {
            name: "Звезда",
            icon: "🌟",
            value: 100000,
            chance: 8
        },

        {
            name: "Мифический",
            icon: "🌌",
            value: 250000,
            chance: 2
        }

    ],

    legendary: [

        {
            name: "Корона",
            icon: "👑",
            value: 50000,
            chance: 40
        },

        {
            name: "Дракон",
            icon: "🐉",
            value: 150000,
            chance: 30
        },

        {
            name: "Алмаз",
            icon: "💎",
            value: 500000,
            chance: 20
        },

        {
            name: "Золотой Трофей",
            icon: "🏆",
            value: 1000000,
            chance: 9
        },

        {
            name: "Мега Джекпот",
            icon: "🌌",
            value: 5000000,
            chance: 1
        }

    ],

    mythical: [

        {
            name: "Алмаз",
            icon: "💎",
            value: 500000,
            chance: 50
        },

        {
            name: "Дракон",
            icon: "🐉",
            value: 1000000,
            chance: 30
        },

        {
            name: "Богатство",
            icon: "👑",
            value: 2500000,
            chance: 15
        },

        {
            name: "Мифический артефакт",
            icon: "🌌",
            value: 5000000,
            chance: 4
        },

        {
            name: "ULTIMATE",
            icon: "💠",
            value: 25000000,
            chance: 1
        }

    ]

};

const casePrices = {

    common: 5000,

    rare: 25000,

    legendary: 100000,

    mythical: 500000

};

let caseOpeningInProgress =
    false;

/* =========================================================
RANDOM CASE ITEM
========================================================= */

function randomCaseItem(type) {

    const items =
        caseItems[type];

    const random =
        Math.random() *
        100;

    let current =
        0;

    for (
        const item of items
    ) {

        current +=
            item.chance;

        if (
            random <=
            current
        ) {

            return item;

        }

    }

    return items[0];

}

/* =========================================================
OPEN CASE
========================================================= */

function openCase(type) {

    if (
        state.level <
        5
    ) {

        showMessage(
            "🔒 Кейсы открываются с 5 уровня",
            "error"
        );

        return;

    }

    if (
        caseOpeningInProgress
    )
        return;

    const price =
        casePrices[type];

    if (
        state.balance <
        price
    ) {

        showMessage(
            "❌ Недостаточно монет",
            "error"
        );

        return;

    }

    state.balance -=
        price;

    caseOpeningInProgress =
        true;

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

    if (
        !modal ||
        !track ||
        !result
    ) {

        state.balance +=
            price;

        caseOpeningInProgress =
            false;

        return;

    }

    modal.classList.add(
        "active"
    );

    track.innerHTML =
        "";

    const winner =
        randomCaseItem(type);

    const items =
        [];

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        items.push(
            randomCaseItem(
                type
            )
        );

    }

    items[30] =
        winner;

    items.forEach(
        item => {

            const el =
                document.createElement(
                    "div"
                );

            el.className =
                "case-track-item";

            el.innerHTML = `

                <div>
                    ${item.icon}
                </div>

                <span>
                    ${item.name}
                </span>

            `;

            track.appendChild(
                el
            );

        }
    );

    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0)";

    setTimeout(
        () => {

            const itemWidth =
                115;

            const target =
                -(30 *
                itemWidth) +
                150;

            track.style.transition =
                "transform 5s cubic-bezier(.12,.8,.18,1)";

            track.style.transform =
                `translateX(${target}px)`;

        },
        100
    );

    setTimeout(
        () => {

            state.inventory.push({

                ...winner,

                id:
                    Date.now()

            });

            state.stats.casesOpened++;

            result.textContent =
                `🎉 Вы выиграли ${winner.icon} ${winner.name} — ${formatNumber(winner.value)} 🪙`;

            showMessage(
                `🎁 Выпало: ${winner.name}!`
            );

            playSound(
                1000,
                0.3,
                "triangle"
            );

            caseOpeningInProgress =
                false;

            saveGame();

        },
        5400
    );

}

/* =========================================================
CLOSE CASE
========================================================= */

function closeCaseOpening() {

    const modal =
        document.getElementById(
            "caseOpening"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

    caseOpeningInProgress =
        false;

}

/* =========================================================
INVENTORY
========================================================= */

function updateInventory() {

    const containers = [

        document.getElementById(
            "inventory"
        ),

        document.getElementById(
            "homeInventory"
        )

    ];

    containers.forEach(
        container => {

            if (!container)
                return;

            container.innerHTML =
                "";

            if (
                state.inventory.length ===
                0
            ) {

                container.innerHTML = `

                    <div class="empty-inventory">

                        🎒

                        <p>
                            Инвентарь пуст
                        </p>

                    </div>

                `;

                return;

            }

            state.inventory
                .slice()
                .reverse()
                .forEach(
                    item => {

                        const el =
                            document.createElement(
                                "div"
                            );

                        el.className =
                            "inventory-item";

                        el.innerHTML = `

                            <div class="inventory-icon">

                                ${item.icon}

                            </div>

                            <strong>
                                ${item.name}
                            </strong>

                            <small>
                                ${formatNumber(item.value)} 🪙
                            </small>

                            <button
                                onclick="sellItem(${item.id})"
                            >

                                💰 Продать

                            </button>

                        `;

                        container.appendChild(
                            el
                        );

                    }
                );

        }
    );

    document
        .querySelectorAll(
            ".inventory-count"
        )
        .forEach(
            el => {

                el.textContent =
                    state.inventory.length;

            }
        );

}

/* =========================================================
SELL ITEM
========================================================= */

function sellItem(id) {

    const index =
        state.inventory.findIndex(
            item =>
                item.id ===
                id
        );

    if (
        index === -1
    )
        return;

    const item =
        state.inventory[index];

    const sellPrice =
        Math.floor(
            item.value *
            0.7
        );

    state.balance +=
        sellPrice;

    state.inventory.splice(
        index,
        1
    );

    showMessage(
        `💰 Продано за ${formatNumber(sellPrice)} 🪙`
    );

    saveGame();

}

/* =========================================================
CASINO NAVIGATION
========================================================= */

function openGame(gameId) {

    if (
        state.level <
        7
    ) {

        showMessage(
            "🔒 Казино открывается с 7 уровня",
            "error"
        );

        return;

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

    if (!game)
        return;

    document
        .querySelector(
            ".casino-grid"
        )
        ?.classList.add(
            "hidden"
        );

    game.classList.remove(
        "hidden"
    );

}

/* =========================================================
BACK TO CASINO
========================================================= */

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

    document
        .querySelector(
            ".casino-grid"
        )
        ?.classList.remove(
            "hidden"
        );

}

/* =========================================================
SLOT
========================================================= */

const slotSymbols = [

    "🍒",
    "🍋",
    "🍊",
    "🍇",
    "🔔",
    "💎",
    "7️⃣"

];

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
        bet <= 0 ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    state.stats.casinoGames++;

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

    reels.forEach(
        reel => {

            reel?.classList.add(
                "spinning"
            );

        }
    );

    setTimeout(
        () => {

            const result = [

                randomSlot(),

                randomSlot(),

                randomSlot()

            ];

            reels.forEach(
                (
                    reel,
                    index
                ) => {

                    if (!reel)
                        return;

                    reel.textContent =
                        result[index];

                    reel.classList.remove(
                        "spinning"
                    );

                }
            );

            let multiplier =
                0;

            if (
                result[0] ===
                result[1] &&
                result[1] ===
                result[2]
            ) {

                multiplier =
                    result[0] ===
                    "7️⃣"
                        ? 25
                        : 10;

            } else if (

                result[0] ===
                result[1] ||

                result[1] ===
                result[2] ||

                result[0] ===
                result[2]

            ) {

                multiplier =
                    2;

            }

            if (
                multiplier >
                0
            ) {

                const win =
                    bet *
                    multiplier;

                state.balance +=
                    win;

                state.stats.totalWon +=
                    win;

                showMessage(
                    `🎉 Выигрыш ×${multiplier}: +${formatNumber(win)} 🪙`
                );

                playSound(
                    800,
                    0.2,
                    "triangle"
                );

            } else {

                showMessage(
                    "😢 Не повезло",
                    "error"
                );

            }

            saveGame();

        },
        1200
    );

}

function randomSlot() {

    return slotSymbols[
        Math.floor(
            Math.random() *
            slotSymbols.length
        )
    ];

}

/* =========================================================
ROULETTE
========================================================= */

const redNumbers = [

    1, 3, 5, 7, 9,

    12, 14, 16, 18,

    19, 21, 23, 25,

    27, 30, 32, 34, 36

];

let selectedRouletteColor =
    null;

let selectedRouletteNumber =
    null;

function selectRouletteColor(
    color
) {

    selectedRouletteColor =
        color;

    const el =
        document.getElementById(
            "selectedRouletteColor"
        );

    if (el) {

        el.textContent =
            `Выбрано: ${color}`;

    }

}

function selectRouletteNumber(
    number
) {

    selectedRouletteNumber =
        number;

    const el =
        document.getElementById(
            "selectedRouletteNumber"
        );

    if (el) {

        el.textContent =
            `Выбрано число: ${number}`;

    }

}

function getRouletteColor(
    number
) {

    if (
        number ===
        0
    )
        return "green";

    return redNumbers.includes(
        number
    )
        ? "red"
        : "black";

}

function playRoulette() {

    const input =
        document.getElementById(
            "rouletteBet"
        );

    const bet =
        Number(
            input?.value
        );

    if (
        !bet ||
        bet <= 0 ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    if (
        !selectedRouletteColor &&
        selectedRouletteNumber ===
        null
    ) {

        showMessage(
            "❌ Выберите цвет или число",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    const wheel =
        document.getElementById(
            "rouletteWheel"
        );

    wheel?.classList.add(
        "spinning"
    );

    const result =
        Math.floor(
            Math.random() *
            37
        );

    const color =
        getRouletteColor(
            result
        );

    setTimeout(
        () => {

            wheel?.classList.remove(
                "spinning"
            );

            const resultEl =
                document.getElementById(
                    "rouletteNumber"
                );

            if (resultEl) {

                resultEl.textContent =
                    result;

                resultEl.className =
                    `roulette-result ${color}`;

            }

            let win =
                0;

            if (
                selectedRouletteNumber ===
                result
            ) {

                win =
                    bet *
                    36;

            } else if (
                selectedRouletteColor ===
                color
            ) {

                win =
                    color ===
                    "green"

                        ? bet *
                        14

                        : bet *
                        2;

            }

            if (
                win >
                0
            ) {

                state.balance +=
                    win;

                state.stats.totalWon +=
                    win;

                showMessage(
                    `🎉 Выпало ${result} ${color}! Выигрыш: ${formatNumber(win)} 🪙`
                );

            } else {

                showMessage(
                    `🎡 Выпало ${result} ${color}. Ставка проиграла`,
                    "error"
                );

            }

            selectedRouletteColor =
                null;

            selectedRouletteNumber =
                null;

            saveGame();

        },
        3000
    );

}

/* =========================================================
DICE
========================================================= */

let selectedDiceNumber =
    null;

function selectDiceNumber(
    number
) {

    selectedDiceNumber =
        number;

    const el =
        document.getElementById(
            "selectedDiceNumber"
        );

    if (el) {

        el.textContent =
            `Выбрано число: ${number}`;

    }

}

function playDice() {

    const input =
        document.getElementById(
            "diceBet"
        );

    const bet =
        Number(
            input?.value
        );

    if (
        !bet ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    if (
        !selectedDiceNumber
    ) {

        showMessage(
            "❌ Выберите число",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    const dice =
        document.querySelector(
            ".dice-number"
        );

    dice?.classList.add(
        "rolling"
    );

    setTimeout(
        () => {

            const result =
                Math.floor(
                    Math.random() *
                    6
                ) +
                1;

            if (dice) {

                dice.textContent =
                    [
                        "⚀",
                        "⚁",
                        "⚂",
                        "⚃",
                        "⚄",
                        "⚅"
                    ][
                        result -
                        1
                    ];

                dice.classList.remove(
                    "rolling"
                );

            }

            if (
                result ===
                selectedDiceNumber
            ) {

                const win =
                    bet *
                    5;

                state.balance +=
                    win;

                state.stats.totalWon +=
                    win;

                showMessage(
                    `🎲 Угадал! +${formatNumber(win)} 🪙`
                );

            } else {

                showMessage(
                    `🎲 Выпало ${result}`,
                    "error"
                );

            }

            selectedDiceNumber =
                null;

            saveGame();

        },
        1000
    );

}

/* =========================================================
LADDER
========================================================= */

let ladderActive =
    false;

let ladderLevel =
    0;

let ladderBet =
    0;

let ladderMultiplier =
    1;

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
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    ladderBet =
        bet;

    ladderLevel =
        0;

    ladderMultiplier =
        1;

    ladderActive =
        true;

    updateLadder();

    saveGame();

}

function ladderNext() {

    if (
        !ladderActive
    )
        return;

    const chance =
        0.75 -
        ladderLevel *
        0.04;

    if (
        Math.random() >
        chance
    ) {

        ladderActive =
            false;

        showMessage(
            "💥 Вы проиграли!",
            "error"
        );

        return;

    }

    ladderLevel++;

    ladderMultiplier *=
        1.35;

    updateLadder();

}

function ladderCashout() {

    if (
        !ladderActive ||
        ladderLevel ===
        0
    )
        return;

    const win =
        ladderBet *
        ladderMultiplier;

    state.balance +=
        win;

    state.stats.totalWon +=
        win;

    ladderActive =
        false;

    showMessage(
        `💰 Забрали ${formatNumber(win)} 🪙`
    );

    saveGame();

}

function updateLadder() {

    const multiplier =
        document.getElementById(
            "ladderMultiplier"
        );

    const level =
        document.getElementById(
            "ladderLevel"
        );

    if (multiplier) {

        multiplier.textContent =
            `×${ladderMultiplier.toFixed(2)}`;

    }

    if (level) {

        level.textContent =
            `Уровень ${ladderLevel} / 10`;

    }

}

/* =========================================================
MINES
========================================================= */

let minesActive =
    false;

let minesBet =
    0;

let minesMultiplier =
    1;

let minePositions =
    [];

function startMines() {

    const input =
        document.getElementById(
            "minesBet"
        );

    const bet =
        Number(
            input?.value
        );

    if (
        !bet ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    minesBet =
        bet;

    minesMultiplier =
        1;

    minesActive =
        true;

    minePositions =
        [];

    while (
        minePositions.length <
        5
    ) {

        const position =
            Math.floor(
                Math.random() *
                16
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

    const board =
        document.querySelector(
            ".mines-board"
        );

    if (!board)
        return;

    board.innerHTML =
        "";

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
            () => revealMine(
                cell,
                i
            );

        board.appendChild(
            cell
        );

    }

    saveGame();

}

function revealMine(
    cell,
    index
) {

    if (
        !minesActive
    )
        return;

    if (
        minePositions.includes(
            index
        )
    ) {

        cell.textContent =
            "💣";

        cell.classList.add(
            "mine-danger"
        );

        minesActive =
            false;

        showMessage(
            "💥 Мина! Вы проиграли",
            "error"
        );

        return;

    }

    cell.textContent =
        "💎";

    cell.classList.add(
        "mine-safe"
    );

    cell.disabled =
        true;

    minesMultiplier *=
        1.25;

    const multiplier =
        document.getElementById(
            "minesMultiplier"
        );

    if (multiplier) {

        multiplier.textContent =
            `×${minesMultiplier.toFixed(2)}`;

    }

}

function cashoutMines() {

    if (
        !minesActive
    )
        return;

    const win =
        minesBet *
        minesMultiplier;

    state.balance +=
        win;

    state.stats.totalWon +=
        win;

    minesActive =
        false;

    showMessage(
        `💰 Выигрыш ${formatNumber(win)} 🪙`
    );

    saveGame();

}

/* =========================================================
CRASH
========================================================= */

let crashActive =
    false;

let crashBet =
    0;

let crashMultiplier =
    1;

let crashTimer;

function startCrash() {

    const input =
        document.getElementById(
            "crashBet"
        );

    const bet =
        Number(
            input?.value
        );

    if (
        !bet ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    crashBet =
        bet;

    crashMultiplier =
        1;

    crashActive =
        true;

    const plane =
        document.getElementById(
            "crashPlane"
        );

    let start =
        Date.now();

    clearInterval(
        crashTimer
    );

    crashTimer =
        setInterval(
            () => {

                const elapsed =
                    (
                        Date.now() -
                        start
                    ) /
                    1000;

                crashMultiplier =
                    1 +
                    elapsed *
                    0.35;

                const multiplier =
                    document.getElementById(
                        "crashMultiplier"
                    );

                if (multiplier) {

                    multiplier.textContent =
                        `×${crashMultiplier.toFixed(2)}`;

                }

                if (plane) {

                    plane.style.left =
                        Math.min(
                            90,
                            5 +
                            elapsed *
                            8
                        ) +
                        "%";

                }

                const crashChance =
                    0.0015 *
                    crashMultiplier;

                if (
                    Math.random() <
                    crashChance
                ) {

                    crashEnd();

                }

            },
            100
        );

}

function crashEnd() {

    clearInterval(
        crashTimer
    );

    crashActive =
        false;

    showMessage(
        `💥 Crash на ×${crashMultiplier.toFixed(2)}!`,
        "error"
    );

}

function cashoutCrash() {

    if (
        !crashActive
    )
        return;

    const win =
        crashBet *
        crashMultiplier;

    state.balance +=
        win;

    state.stats.totalWon +=
        win;

    clearInterval(
        crashTimer
    );

    crashActive =
        false;

    showMessage(
        `✈️ Забрали ${formatNumber(win)} 🪙`
    );

    saveGame();

}

/* =========================================================
JACKPOT
========================================================= */

function playJackpot() {

    const input =
        document.getElementById(
            "jackpotBet"
        );

    const bet =
        Number(
            input?.value
        );

    if (
        !bet ||
        state.balance <
        bet
    ) {

        showMessage(
            "❌ Неверная ставка",
            "error"
        );

        return;

    }

    state.balance -=
        bet;

    const chance =
        Math.random();

    let multiplier;

    if (
        chance <
        0.001
    ) {

        multiplier =
            1000;

    } else if (
        chance <
        0.01
    ) {

        multiplier =
            100;

    } else if (
        chance <
        0.1
    ) {

        multiplier =
            10;

    } else if (
        chance <
        0.3
    ) {

        multiplier =
            2;

    } else {

        multiplier =
            0;

    }

    if (
        multiplier >
        0
    ) {

        const win =
            bet *
            multiplier;

        state.balance +=
            win;

        state.stats.totalWon +=
            win;

        showMessage(
            `💎 JACKPOT! ×${multiplier} — +${formatNumber(win)} 🪙`
        );

    } else {

        showMessage(
            "😢 JACKPOT не сработал",
            "error"
        );

    }

    saveGame();

}

/* =========================================================
QUESTS
========================================================= */

const quests = {

    firstClick: {

        condition:
            () =>
                state.clicks >=
                1,

        reward:
            50

    },

    earn100: {

        condition:
            () =>
                state.balance >=
                100,

        reward:
            100

    },

    level5: {

        condition:
            () =>
                state.level >=
                5,

        reward:
            1000

    },

    casino: {

        condition:
            () =>
                state.level >=
                7,

        reward:
            2500

    }

};

const claimedQuests =
    JSON.parse(
        localStorage.getItem(
            "luckyClickQuests"
        )
    ) || [];

function claimQuest(id) {

    if (
        claimedQuests.includes(
            id
        )
    ) {

        showMessage(
            "❌ Награда уже получена",
            "error"
        );

        return;

    }

    const quest =
        quests[id];

    if (!quest)
        return;

    if (
        !quest.condition()
    ) {

        showMessage(
            "❌ Задание ещё не выполнено",
            "error"
        );

        return;

    }

    state.balance +=
        quest.reward;

    claimedQuests.push(
        id
    );

    localStorage.setItem(
        "luckyClickQuests",
        JSON.stringify(
            claimedQuests
        )
    );

    showMessage(
        `🏆 Получено ${formatNumber(quest.reward)} 🪙`
    );

    saveGame();

}

/* =========================================================
SOUND SYSTEM
========================================================= */

let audioContext =
    null;

function getAudioContext() {

    if (
        !audioContext
    ) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;

}

function playSound(
    frequency = 440,
    duration = 0.1,
    type = "sine"
) {

    try {

        const ctx =
            getAudioContext();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type =
            type;

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.08,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime +
            duration
        );

        oscillator.connect(
            gain
        );

        gain.connect(
            ctx.destination
        );

        oscillator.start();

        oscillator.stop(
            ctx.currentTime +
            duration
        );

    } catch (error) {

        console.log(
            "Sound unavailable"
        );

    }

}

/* =========================================================
CLICK SOUND
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#clickButton"
            )
        ) {

            playSound(
                500,
                0.08,
                "sine"
            );

        }

    }
);

/* =========================================================
START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateUI();

        console.log(
            "🍀 Lucky Click loaded!"
        );

    }
);

/* =========================================================
GLOBAL FUNCTIONS
========================================================= */

window.clickCoin =
    clickCoin;

window.upgradeClick =
    upgradeClick;

window.openPage =
    openPage;

window.setActiveNav =
    setActiveNav;

window.buyBooster =
    buyBooster;

window.buyPassiveIncome =
    buyPassiveIncome;

window.buyShopItem =
    buyShopItem;

window.activatePromo =
    activatePromo;

window.openCase =
    openCase;

window.closeCaseOpening =
    closeCaseOpening;

window.sellItem =
    sellItem;

window.openGame =
    openGame;

window.backToCasino =
    backToCasino;

window.playSlot =
    playSlot;

window.selectRouletteColor =
    selectRouletteColor;

window.selectRouletteNumber =
    selectRouletteNumber;

window.playRoulette =
    playRoulette;

window.selectDiceNumber =
    selectDiceNumber;

window.playDice =
    playDice;

window.startLadder =
    startLadder;

window.ladderNext =
    ladderNext;

window.ladderCashout =
    ladderCashout;

window.startMines =
    startMines;

window.cashoutMines =
    cashoutMines;

window.startCrash =
    startCrash;

window.cashoutCrash =
    cashoutCrash;

window.playJackpot =
    playJackpot;

window.claimQuest =
    claimQuest;