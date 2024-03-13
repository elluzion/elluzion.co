import { createClient } from "@/lib/supabase/client";
import { mdiLogout } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "../button";

export default function LogOutButton() {
  const supabase = createClient();

  const HandleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  return (
    <Button onClick={HandleLogout} variant={"outline"} size="icon">
      <Icon size={0.75} path={mdiLogout} />
    </Button>
  );
}
