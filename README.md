# bycs_formulare

Automatisiertes Tool zum Abfragen von Mebis-Wahlen.

## Voraussetzungen

- Node.js >= 18
- npm / npx
- TypeScript (wird via `npx tsc` automatisch genutzt)

## Installation

1. Repository klonen:
```bash
git clone https://github.com/OJCreator/bycs_formulare
cd bycs_formulare
```
2. Abhängigkeiten installieren:
```bash
npm install
```
## Konfiguration

Passe die Datei `bycs_polling_data.json` an deine Bedürfnisse an:

```json
{
  "pollUrl": "LINK ZUR MEBIS-WAHL",
  "hour": 15,
  "minute": 0,
  "users": [
    {
      "username": "Benutzername",
      "password": "Passwort",
      "voteValue": "Wahl-Id (normalerweise irgendeine 7-stellige Zahl)"
    }
  ]
}
```

So wird sich das Tool automatisch in Mebis einloggen und um genau 15:00 die Abstimmungs-Url öffnen, die Wahl mit der entsprechenden `voteValue` treffen und absenden.

## Kompelieren und Ausführen

1. TypeScript kompilieren:
```bash
npx tsc
```
2. Programm starten:
```bash
node dist/main.js
```

## Hinweise

- Verrate nicht jedem, dass du nicht mehr manuell wählst.
- Vertraue nicht blind auf dieses Tool, auch wenn es dazu einlädt.
- Zumindest im Dezember 2025 hat es noch funktioniert.