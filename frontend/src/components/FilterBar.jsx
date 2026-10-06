import React from 'react';

const FilterBar = ({ filters, setFilters, onApply, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-surface p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Toys">Toys</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Delivery Status</label>
          <select
            name="deliveryStatus"
            value={filters.deliveryStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
          >
            <option value="">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-slate-100 text-primary rounded-md text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
