
import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Plus, 
  Search, 
  Package, 
  Settings2, 
  Activity, 
  Trash2, 
  Edit3,
  MoreVertical
} from 'lucide-react';
import { BatchStatus, BatchType } from '../types';

const AdminPanel: React.FC = () => {
  const { batches, addBatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500 text-sm">Full control over batch management and system configuration</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition">
          <Settings2 size={18} />
          System Settings
        </button>
      </header>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStat title="Today's Batches" value={batches.length} icon={<Package className="text-indigo-600"/>} />
        <AdminStat title="In QC Testing" value={batches.filter(b => b.status === BatchStatus.IN_QC).length} icon={<Activity className="text-amber-600"/>} />
        <AdminStat title="Active Processing" value={batches.filter(b => b.status === BatchStatus.PROCESSING).length} icon={<Activity className="text-blue-600"/>} />
      </div>

      {/* Batch Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search batch ID or model..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-slate-50">Archive All</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800">Bulk Actions</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map(batch => (
            <div key={batch.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Batch ID</span>
                    <h4 className="text-lg font-bold text-slate-900">{batch.id}</h4>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 p-1 rounded-lg">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Model</span>
                    <span className="font-semibold text-slate-900">{batch.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-semibold text-slate-900">{batch.quantity} Units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">QC Pass / Defects</span>
                    <div className="flex gap-2">
                      <span className="font-bold text-emerald-600">{batch.qcPass}</span>
                      <span className="text-slate-300">/</span>
                      <span className="font-bold text-rose-600">{batch.defects}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                   <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round((batch.qcPass / batch.quantity) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                      style={{ width: `${(batch.qcPass / batch.quantity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t flex justify-between">
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition"><Edit3 size={16}/></button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 transition"><Trash2 size={16}/></button>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 ${
                  batch.status === BatchStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Activity size={10} /> {batch.status}
                </span>
              </div>
            </div>
          ))}
          
          {/* Add Placeholder */}
          <button 
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition group"
            onClick={() => alert('Opening Create Modal...')}
          >
            <div className="bg-slate-50 p-3 rounded-full mb-3 group-hover:bg-indigo-50 transition">
              <Plus size={24} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <span className="font-bold text-slate-400 group-hover:text-indigo-600">Add New Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminStat: React.FC<{ title: string, value: number, icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">{icon}</div>
  </div>
);

export default AdminPanel;
