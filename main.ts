import {Browser, Page} from "puppeteer";
import ntpClient = require('ntp-client');

import puppeteer = require('puppeteer');
import fs = require('fs');

/**
 * ZUM AUSFÜHREN:
 * bycs_polling_data.json anpassen
 * - npx tsc (kompelieren)
 * - node dist/main.js
 *
 * Letztes Mal (05.12.2025) erfolgreiche Wahl um 15:00:03.756 Uhr
 */


const bycsPollingData = JSON.parse(fs.readFileSync('bycs_polling_data.json', 'utf-8'));

async function login(page: Page, userId: number) {

    await page.goto('https://portal.bycs.de');

    await page.type('#input-username', bycsPollingData.users[userId].username);
    await page.type('#input-password', bycsPollingData.users[userId].password);

    await page.click('#button-do-log-in');
    await page.waitForNavigation();

    console.log('Login erfolgreich!');
}

async function selectOption(page: Page, userId: number, n: number = 0): Promise<void> {
    if (n >= 20) {
        console.log("Die Abstimmung war 20 Mal nicht verfügbar. Abbruch.");
        return;
    }

    await page.goto(bycsPollingData.pollUrl, { waitUntil: 'domcontentloaded' });

    const input = await page.$(`input[value="${bycsPollingData.users[userId].voteValue}"]`);
    const submit = await page.$('input[type="submit"]');

    if (input && submit) {
        await input.click();
        await submit.click();

        const now = new Date();
        console.log(`[User ${userId}] Erfolgreich abgestimmt um ${now.toLocaleTimeString()}.${now.getMilliseconds()} Uhr`);
    } else {
        console.log(`[User ${userId}] Abstimmung nicht verfügbar (Versuch ${n + 1}/20). Neuer Versuch...`);
        await selectOption(page, userId, n + 1);
    }
}


// **Programm zu einer bestimmten Uhrzeit ausführen**
async function runAtSpecificTime(hour: number, minute: number) {

    const now = new Date();
    const target = new Date();
    const offset = await getNtpOffset(); // Zu einem Zeitserver
    console.log(`Der Zeitunterschied zum Zeitserver beträgt ${(offset / 1000).toFixed(2)} Sekunden.`);
    target.setHours(hour, minute, 0, 0);

    let delay = target.getTime() - now.getTime();
    if (delay < 0) {
        console.log('Die Zielzeit ist bereits vorbei. Das Programm wird jetzt ausgeführt.');
        delay = 0;
    } else {
        console.log(`Programm wird um ${hour}:${minute} ausgeführt.`);
    }

    const correctedDelay = delay - offset;

    console.log(`Geplante Ausführung in ${(correctedDelay / 1000).toFixed(2)} Sekunden. (Dies respektiert den Zeitunterschied zum Zeitserver)`);

    for (let i = 0; i < bycsPollingData.users.length; i++) {
        runUserPoll(i, correctedDelay);
    }
}

function getNtpOffset(): Promise<number> {
    return new Promise((resolve, reject) => {
        ntpClient.getNetworkTime("pool.ntp.org", 123, (err: string | Error | null, date: Date | null) => {
            if (err) {
                console.error("Fehler beim Abrufen der NTP-Zeit:", err);
                reject(err);
                return;
            }
            if (date == null) {
                console.error("Keine Zeit!");
                return;
            }

            const serverTime = date.getTime();
            const localTime = Date.now();
            const offset = serverTime - localTime;

            console.log(`🕒 NTP-Zeit     : ${date.toISOString()}`);
            console.log(`🖥️  Lokale Zeit : ${new Date(localTime).toISOString()}`);
            console.log(`⏱️  Abweichung  : ${offset} ms (${(offset / 1000).toFixed(3)} s)`);

            resolve(offset);
        });
    });
}


async function runUserPoll(userId: number, pollDelay: number) {

    const browser: Browser = await puppeteer.launch({ headless: false }); // Setze "true" für unsichtbaren Modus
    const page: Page = await browser.newPage();

    await login(page, userId);

    setTimeout(() => selectOption(page, userId), pollDelay);
}

const hour = bycsPollingData.hour;
const minute = bycsPollingData.minute;
runAtSpecificTime(hour, minute);
