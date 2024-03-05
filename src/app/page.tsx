export default function Home() {
  return (
    <main className="prose prose-invert prose-zinc flex flex-col max-w-full">
      <h4>elluzion</h4>
      <p>
        I am Fynn, a music producer, software developer and overall creative
        that loves to work on projects on the internet, born in 2004 in Germany.
      </p>

      <h4>what can i do?</h4>
      <p>
        since 2018, i've been a <b>music producer</b>. ever since i first picked
        up FL Studio, i have spent countless hours in it, working on music,
        sound designing, mixing and mastering my own EDM tracks, some of which
        you can listen to on{" "}
        <a
          href="http://soundcloud.com/elluzion.music"
          target="_blank"
          className="text-orange-400"
        >
          SoundCloud
        </a>
        ,{" "}
        <a
          href="https://open.spotify.com/artist/4OgioomMSaD1ier3lIfgzr"
          target="_blank"
          className="text-green-400"
        >
          Spotify
        </a>{" "}
        or{" "}
        <a
          href="https://youtube.com/@elluzion."
          target="_blank"
          className="text-red-400"
        >
          YouTube
        </a>
        , amassing roughly over 800k streams globally.
        <br />
        <br />
        moreover, i've been working on various (mostly private) software
        projects, such as{" "}
        <a href="https://github.com/project-fluid" target="_blank">
          Project Fluid
        </a>
        , a redesigned AOSP-based custom rom, as well as device-side development
        for the Xiaomi Mi 9 for roughly 2 years. nowadays i really like working
        on the web, using frameworks like next.js (which this website is written
        in) or NUXT in combination with TailwindCSS.
      </p>

      <h4>what else?</h4>
      <p>
        uh, i love cars and tech. driving a '99 mazda mx-5 (miata), i have a
        special interest in both old and new JDM cars, and believe that fun and
        emotion should always play a role in the future of cars, also the EVs.
        nevertheless, i am always looking forward to the future and new exciting
        technologies and opportunities!
      </p>
    </main>
  );
}
