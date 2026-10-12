import "@/global.css";
import { fetchUser } from "@/lib/fetch/fetchUser";
import { supabase } from "@/lib/supabase";
import { router } from 'expo-router';
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    async function routeUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      const { data: assmat } = await fetchUser("assmat");
      if (assmat) {
        router.replace("/homepage");
        return;
      }
      const { data: parent } = await fetchUser("parent");
      if (parent) {
        router.replace("/parent_homepage");
        return;
      }
      router.replace("/login");
    }
    routeUser();
  }, []);
  return null;
}