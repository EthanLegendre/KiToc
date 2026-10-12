import { fetchMonthSessions } from "@/lib/fetch/fetchMonthSessions"
import { dureeEnMinutes, minutesEnHeure } from "@/lib/time/calculeTime";

export async function fetchSessionInfoTimeKidMonth(kidId: string, kidMontent: number, kidIndemn: number, floor: boolean): Promise<{ totalHour: string, totalSession: string, totalMoney: string}>
{
    const { data } = await fetchMonthSessions(kidId);
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

    return { totalHour: minutesEnHeure(totalMinute), totalSession: nbrSession.toString(), totalMoney: !floor ? totalMoney.toFixed(0).toString() : totalMoney.toString()}
}