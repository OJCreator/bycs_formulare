# bycs_formulare

Automatisiertes Tool zum Abfragen von Mebis-Wahlen.  
Mit bycs_formulare kannst du schnell und einfach Wahldaten auslesen und verarbeiten.

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
  "hour": Stunde,
  "minute": Minute,
  "users": [
    {
      "username": "Benutzername",
      "password": "Passwort",
      "voteValue": "Wahl-Id"
    }
  ]
}
```

## Kompelieren und Ausführen

1. TypeScript kompilieren:
```bash
npx tsc
```
2. Programm starten:
3.
```bash
node dist/main.js
```