export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
