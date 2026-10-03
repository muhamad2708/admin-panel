export default function TicketTimeline({ steps }) {
  return (
    <div className="mt-5 space-y-4">
      {steps.map((step, index) => (
        <div key={`${step}-${index}`} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full ${index === steps.length - 1 ? "bg-sky-500" : "bg-emerald-500"}`}
            />
            {index < steps.length - 1 && (
              <div className="mt-1 h-8 w-px bg-slate-700" />
            )}
          </div>
          <span className="text-sm text-slate-200">{step}</span>
        </div>
      ))}
    </div>
  );
}
