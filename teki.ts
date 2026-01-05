import puppeteer from "puppeteer";


async function start() {

//Browser-Start
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

//login
    await page.goto("https://lernplattform.mebis.bycs.de/mod/choice/view.php?id=73390864", {waitUntil: "networkidle0"})
    await page.type("#input-username", "o.jansen", {delay: 10});
    await page.type("#input-password", "f!yOqPUeHAmEB@", {delay: 10});
    await page.click("#button-do-log-in");

    await page.waitForNetworkIdle();

    let i = 0;
    while (true) {
        await page.reload({waitUntil: 'networkidle0'});
        try {
            await page.waitForSelector('input[type="radio"][id="choice_3"]:not([disabled])', {timeout: 50});
            break;
        } catch (e) {
            i++
        }
    }
    await page.click("#choice_3");
    await page.click('input[type="submit"][value="Meine Auswahl speichern"]');
    console.log(i)
    console.log(`${i} Versuch ${new Date().toLocaleTimeString()}`);
}

start();