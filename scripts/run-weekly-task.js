#!/usr/bin/env node

/**
 * Lokales Skript zum manuellen Ausführen der wöchentlichen Familienkasse-Aufgabe
 *
 * Verwendung:
 * node scripts/run-weekly-task.js
 *
 * Oder mit npm script:
 * npm run weekly-task
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Supabase Client erstellen (mit Service Role für RPC-Funktionen)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_SECRET
);

async function runWeeklyTask() {
  console.log("🚀 Starte wöchentliche Familienkasse-Aufgabe...");
  console.log("📅 Zeitpunkt:", new Date().toLocaleString("de-DE"));

  try {
    // Die RPC-Funktion aufrufen
    const { data, error } = await supabase.rpc(
      "erstelle_wochen_eintraege_familienkasse"
    );

    if (error) {
      console.error("❌ Fehler beim Ausführen der Aufgabe:", error);
      process.exit(1);
    } else {
      console.log("✅ Aufgabe erfolgreich ausgeführt!");
      console.log("📊 Ergebnis:", data);
    }
  } catch (err) {
    console.error("💥 Unerwarteter Fehler:", err);
    process.exit(1);
  }
}

// Skript ausführen
runWeeklyTask();
