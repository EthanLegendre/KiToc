import { fetchYearSessions } from "@/lib/fetch/fetchYearSessions"
import { dureeEnMinutes, minutesEnHeure } from "@/lib/time/calculeTime";

export async function fetchSessionInfoTimeKidYear(kidId: string, kidMontent: number, kidIndemn: number): Promise<{ totalHour: string, totalSession: string, totalMoney: string}>
{
    const { data } = await fetchYearSessions(kidId);
    if (!data) return { totalHour: "0", totalSession: "0", totalMoney: "0"};

    const nbrSession = data.length;
    let totalMoney = nbrSession * kidIndemn;
    let totalMinute = 0;

    data.forEach((session) => {
        if (session.heure_debut && session.heure_fin) {
            totalMinute += dureeEnMinutes(session.heure_debut, session.heure_fin);
        }
    })

    totalMoney += (totalMinute * (kidMontent / 60));

    return { totalHour: minutesEnHeure(totalMinute), totalSession: nbrSession.toString(), totalMoney: totalMoney.toFixed(0).toString()}
}