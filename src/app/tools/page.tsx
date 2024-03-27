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
      <div>
        <div className="flex items-end mb-3">
          <h1 className="font-bold text-3xl grow">Tools</h1>
        </div>
      </div>
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
