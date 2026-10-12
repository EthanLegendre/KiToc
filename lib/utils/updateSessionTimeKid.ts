import { fetchActiveSessionKid } from "@/lib/fetch/fetchActiveSessionKid";
import { tempsEcoule } from "@/lib/utils/tempsEcoule";

export async function updateSessionTimeKid(idKid: string): Promise<string | null> {
    const { data: session } = await fetchActiveSessionKid(idKid);

    if (!session) {
        return null;
    }
    return tempsEcoule(session.start);
}