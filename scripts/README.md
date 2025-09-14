# Lokale Scripts

Dieses Verzeichnis enthält lokale Scripts für die manuelle Ausführung von Aufgaben.

## Wöchentliche Familienkasse-Aufgabe

### Beschreibung

Falls der Cluster oder das Projekt pausiert ist und die wöchentliche Aufgabe nicht automatisch ausgeführt wird, können diese Scripts verwendet werden, um die Aufgabe manuell zu starten.

### Verwendung

```bash
npm run weekly-task
```

Oder direkt:

```bash
node scripts/run-weekly-task.js
```

### Voraussetzungen

- Die Environment-Variablen `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` müssen gesetzt sein
- Die Supabase RPC-Funktion `erstelle_wochen_eintraege_familienkasse` muss existieren

### Dependencies installieren

```bash
npm install
```

### Troubleshooting

- Stelle sicher, dass deine .env-Datei die korrekten Supabase-Credentials enthält
- Überprüfe, ob die RPC-Funktion in Supabase existiert und korrekt konfiguriert ist
- Bei Fehlern wird der Exit-Code 1 zurückgegeben
