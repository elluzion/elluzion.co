import PageHeader from "@/components/page-header";
import AnalyzerScreen from "./analyzerScreen";

export default function Analyzer() {
  return (
    <main>
      <PageHeader
        title="Analyzer"
        subtitle="Receive info about wav/mp3/flac audio files."
      />
      <AnalyzerScreen />
    </main>
  );
}
