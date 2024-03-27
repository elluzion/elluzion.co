export default function PageHeader(props: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col justify-end gap-4 mb-3 min-h-16">
      <div className="flex items-end h-16">
        <h1 className="font-bold text-3xl">{props.title}</h1>
      </div>
      {props.subtitle && (
        <p className="font-mono text-muted-foreground">{props.subtitle}</p>
      )}
    </div>
  );
}
