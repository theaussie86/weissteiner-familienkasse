#!/bin/bash

# Lokales Shell-Skript zum manuellen Ausführen der wöchentlichen Familienkasse-Aufgabe
# 
# Verwendung:
# chmod +x scripts/run-weekly-task.sh
# ./scripts/run-weekly-task.sh

echo "🚀 Starte wöchentliche Familienkasse-Aufgabe..."
echo "📅 Zeitpunkt: $(date)"

# Prüfe ob .env Datei existiert
if [ ! -f .env ]; then
    echo "❌ .env Datei nicht gefunden. Bitte erstelle eine .env Datei mit deinen Supabase-Credentials."
    exit 1
fi

# Führe das Node.js-Skript aus
npm run weekly-task
