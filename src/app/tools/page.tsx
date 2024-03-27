import PageHeader from "@/components/page-header";
import Link from "next/link";

const toolSet = [
  {
    name: "Audio Analyzer",
    path: "analyzer",
  },
];

export default function Tools() {
  return (
    <main>
      <PageHeader title="Tools" />

      <ul className="list-disc list-inside">
        {toolSet.map((tool) => {
          return (
            <li key={tool.path}>
              <Link href={`/tools/${tool.path}`}>{tool.name}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
