"use client";

import { Button } from "@/components/button";
import { createClient } from "@/lib/supabase/client";
import { mdiLogout } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";

export default function LogOutButton() {
  const supabase = createClient();
  const [logoutButtonVisible, setLogoutButtonVisible] = useState(false);

  useEffect(() => {
    try {
      supabase.auth.getUser().then((res) => {
        if (res.data.user) setLogoutButtonVisible(true);
      });
    } catch (e) {}
  });

  const HandleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  if (!logoutButtonVisible) return;
  return (
    <Button onClick={HandleLogout} variant={"outline"} size="icon">
      <Icon size={0.75} path={mdiLogout} />
    </Button>
  );
}
