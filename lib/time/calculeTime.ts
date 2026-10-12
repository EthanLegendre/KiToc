/** Convertit une heure "HH:MM" ou "HH:MM:SS" en nombre total de minutes. */
export function heureEnMinutes(heure: string): number {
  const parts = heure.split(":").map(Number);
  return parts[0] * 60 + (parts[1] ?? 0);
}

/** Convertit un nombre de minutes en heure "HH:MM" ou "HH:MM:SS". */
export function minutesEnHeure(minutes: number, avecSecondes = false): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(Math.floor(minutes % 60)).padStart(2, "0");
  return avecSecondes ? `${h}:${m}:00` : `${h}h${m}`;
}

/** Heure actuelle au format "HH:MM:SS", prête à être stockée en base (colonne time). */
export function heureActuellePourSupabase(): string {
  return new Date().toTimeString().split(" ")[0];
}

/** Date actuelle au format "YYYY-MM-DD", en heure LOCALE (pas UTC, évite le décalage d'un jour). */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Durée en minutes entre deux heures "HH:MM".
 * Gère le passage de minuit (ex: 22h00 → 02h00 = 240 min, pas négatif).
 */
export function dureeEnMinutes(heureDebut: string, heureFin: string): number {
  const debut = heureEnMinutes(heureDebut);
  const fin = heureEnMinutes(heureFin);

  let diff = fin - debut;
  if (diff < 0) diff += 24 * 60;

  return diff;
}

/** Durée en minutes entre une heure de début et MAINTENANT (pour un chrono en direct). */
export function minutesEcoulees(heureDebut: string): number {
  const maintenant = new Date();
  const heureActuelle = `${String(maintenant.getHours()).padStart(2, "0")}:${String(maintenant.getMinutes()).padStart(2, "0")}`;
  return dureeEnMinutes(heureDebut, heureActuelle);
}

/** Formate un nombre de minutes en "Xh" ou "XhYY" (ex: 84 → "1h24"). */
export function formatDuree(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

/** Temps écoulé depuis une heure de début, déjà formaté ("1h24"). Pratique pour l'affichage direct. */
export function tempsEcoule(heureDebut: string): string {
  return formatDuree(minutesEcoulees(heureDebut));
}

/** "mardi 2 septembre" → "Mardi 2 septembre" (1ère lettre en majuscule). */
function capitalize(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Date longue en français, capitalisée. Ex: "Mardi 2 septembre". */
export function formatDateLongue(date: Date = new Date()): string {
  return capitalize(
    date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  );
}

/** Date courte en français. Ex: "mar. 2 sept." */
export function formatDateCourte(date: Date = new Date()): string {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

/** Renvoie les 7 dates de la semaine (lundi → dimanche) contenant referenceDate. */
export function getDateOfWeek(referenceDate: Date = new Date()): Date[] {
  const dayOfWeek = referenceDate.getDay(); // 0 = dimanche
  const toMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + toMonday);
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

/** Libellé pour une barre de navigation de semaine. Ex: "1 — 7 septembre" ou "29 août — 4 sept." */
export function getLabelSemaine(week: Date[]): string {
  const debut = week[0];
  const fin = week[6];
  const memeMois = debut.getMonth() === fin.getMonth();

  if (memeMois) {
    const mois = fin.toLocaleDateString("fr-FR", { month: "long" });
    return `${debut.getDate()} — ${fin.getDate()} ${mois}`;
  }

  const moisDebut = debut.toLocaleDateString("fr-FR", { month: "short" });
  const moisFin = fin.toLocaleDateString("fr-FR", { month: "short" });
  return `${debut.getDate()} ${moisDebut} — ${fin.getDate()} ${moisFin}`;
}

/** Ajoute les "/" automatiquement pendant la saisie d'une date. Ex: "12032023" → "12/03/2023". */
export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/** Ajoute les espaces automatiquement pendant la saisie d'un téléphone FR. Ex: "0612345678" → "06 12 34 56 78". */
export function formatPhoneInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 10);
  return (digits.match(/.{1,2}/g) || []).join(" ");
}

/** Convertit "12/03/2023" en "2023-03-12" (format attendu par Postgres). */
export function convertToISODate(dateFr: string): string | null {
  const parts = dateFr.split("/");
  if (parts.length !== 3) return null;
  const [jour, mois, annee] = parts;
  if (annee.length !== 4) return null;
  return `${annee}-${mois}-${jour}`;
}

/** Attend N millisecondes. Utile pour un délai anti-spam ou un message temporaire. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}