export function EmployeeProfileTabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
            activeTab === tab ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
