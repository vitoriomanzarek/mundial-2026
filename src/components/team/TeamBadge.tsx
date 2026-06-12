import TeamFlag from "./TeamFlag";

interface TeamBadgeProps {
  name: string;
  code: string;
  groupId: string;
  confederation: string;
}

export default function TeamBadge({
  name,
  code,
  groupId,
  confederation,
}: TeamBadgeProps) {
  return (
    <div className="flex items-center gap-4">
      <TeamFlag code={code} name={name} size="lg" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Grupo {groupId} · {confederation}
        </p>
      </div>
    </div>
  );
}
