"use client";

import { Button } from "@/components/button";
import { createClient } from "@/lib/supabase/client";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function LoginForm() {
  const signInWithGithub = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/login/callback",
      },
    });
    if (error) console.log(error);
  };

  return (
    <main className="flex flex-col mt-16 mb-8 w-full prose-invert prose">
      <h1>Log in</h1>
      <Button onClick={signInWithGithub} className="flex gap-2">
        Log in with GitHub <SiGithub />
      </Button>
    </main>
  );
}
