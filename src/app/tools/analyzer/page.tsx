import AnalyzerScreen from "./analyzerScreen";

export default function Analyzer() {
  return (
    <main>
      <div>
        <div className="flex items-end mb-3">
          <h1 className="font-bold text-3xl grow">Analyzer</h1>
        </div>
        <p className="font-mono text-muted-foreground">
          Receive info about wav/mp3/flac audio files.
        </p>
      </div>
      <AnalyzerScreen />
    </main>
  );
}
