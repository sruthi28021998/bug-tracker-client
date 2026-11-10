export default function Filters({ filters, setFilters, members }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const active = filters.search || filters.status || filters.priority || filters.assignee;

  return (
    <div className="mb-4">
      <div className="grid gap-2 md:grid-cols-5">
        <input className="input" placeholder="Search tickets..." value={filters.search} onChange={set('search')} />
        <select className="input" value={filters.status} onChange={set('status')}>
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="input" value={filters.priority} onChange={set('priority')}>
          <option value="">All priorities</option>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <select className="input" value={filters.assignee} onChange={set('assignee')}>
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <select className="input" value={filters.sort} onChange={set('sort')}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Priority (high first)</option>
        </select>
      </div>
      {active && (
        <button className="text-sm text-indigo-600 mt-2"
          onClick={() => setFilters({ search: '', status: '', priority: '', assignee: '', sort: filters.sort })}>
          Clear filters
        </button>
      )}
    </div>
  );
}