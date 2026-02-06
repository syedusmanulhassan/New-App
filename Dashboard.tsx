
import React, { useMemo, useState } from 'react';
import { useApp } from '../store';
import { BatchType, BatchStatus, DeviceStatus } from '../types';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Hash 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { batches, devices, addBatch, technicians, assignTechnician } = useApp();

  // Metric Calculations
  const metrics = useMemo(() => {
    const totalDevices = batches.reduce((acc, b) => acc + b.quantity, 0);
    const totalPass = batches.reduce((acc, b) => acc + b.qcPass, 0);
    const totalDefects = batches.reduce((acc, b) => acc + b.defects, 0);
    const completed = batches.reduce((acc, b) => acc + b.completed, 0);
    const assigned = batches.reduce((acc, b) => acc + b.assigned, 0);

    return {
      totalBatches: batches.length,
      totalDevices,
      qcPassRate: totalDevices > 0 ? ((totalPass / totalDevices) * 100).toFixed(1) : '0',
      defectRate: totalDevices > 0 ? ((totalDefects / totalDevices) * 100).toFixed(1) : '0',
      totalDefective: totalDefects,
      completionRate: totalDevices > 0 ? ((completed / totalDevices) * 100).toFixed(1) : '0',
      assignedVsCompleted: `${assigned} / ${completed}`,
      activeBatches: batches.filter(b => b.status !== BatchStatus.COMPLETED).length
    };
  }, [batches]);

  const chartData = useMemo(() => [
    { name: 'QC Pass', value: batches.reduce((acc, b) => acc + b.qcPass, 0), color: '#10b981' },
    { name: 'Defects', value: batches.reduce((acc, b) => acc + b.defects, 0), color: '#ef4444' },
    { name: 'Pending', value: batches.reduce((acc, b) => acc + (b.quantity - b.qcPass - b.defects), 0), color: '#6366f1' },
  ], [batches]);

  // Form States
  const [newBatch, setNewBatch] = useState({
    id: '', type: BatchType.NEW_PURCHASE, model: '', source: '', invoice: '', quantity: 0, arrivalDate: new Date().toISOString().split('T')[0]
  });

  const [assignment, setAssignment] = useState({
    imei: '', model: '', faultType: '', techName: '', date: new Date().toISOString().split('T')[0]
  });

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.id || !newBatch.model) return;
    addBatch({ ...newBatch, status: BatchStatus.ARRIVED });
    setNewBatch({ id: '', type: BatchType.NEW_PURCHASE, model: '', source: '', invoice: '', quantity: 0, arrivalDate: new Date().toISOString().split('T')[0] });
    alert('Batch Added Successfully!');
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment.imei || !assignment.techName) return;
    assignTechnician(assignment.imei, assignment.techName, assignment.faultType);
    setAssignment({ imei: '', model: '', faultType: '', techName: '', date: new Date().toISOString().split('T')[0] });
    alert('Device Assigned to Technician!');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time metrics for warehouse & refurbishment operations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
          <Clock size={16} />
          <span>Last updated: just now</span>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Batches" value={metrics.totalBatches} icon={<Hash className="text-indigo-600"/>} trend="+2 today" />
        <MetricCard title="Devices Received" value={metrics.totalDevices} icon={<Plus className="text-blue-600"/>} trend="+124 this week" />
        <MetricCard title="QC Pass Rate" value={`${metrics.qcPassRate}%`} icon={<CheckCircle className="text-emerald-600"/>} isSuccess />
        <MetricCard title="Defect Rate" value={`${metrics.defectRate}%`} icon={<XCircle className="text-rose-600"/>} isCritical />
        <MetricCard title="Total Defects" value={metrics.totalDefective} icon={<XCircle className="text-rose-600"/>} />
        <MetricCard title="Completion Rate" value={`${metrics.completionRate}%`} icon={<CheckCircle className="text-indigo-600"/>} />
        <MetricCard title="Assigned vs Completed" value={metrics.assignedVsCompleted} icon={<Users className="text-amber-600"/>} />
        <MetricCard title="Active Batches" value={metrics.activeBatches} icon={<Clock className="text-sky-600"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            QC Distribution Overview
            <span className="text-xs font-normal text-slate-400">Values in units</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Add Batch Form */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="text-indigo-600" size={20}/>
            Add New Batch
          </h3>
          <form onSubmit={handleAddBatch} className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Batch ID</label>
                <input 
                  type="text" value={newBatch.id} onChange={e => setNewBatch({...newBatch, id: e.target.value})}
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none" placeholder="B-1003"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Type</label>
                <select 
                  value={newBatch.type} onChange={e => setNewBatch({...newBatch, type: e.target.value as BatchType})}
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                >
                  <option value={BatchType.NEW_PURCHASE}>New Purchase</option>
                  <option value={BatchType.CUSTOMER_RETURN}>Customer Return</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Model</label>
              <input 
                type="text" value={newBatch.model} onChange={e => setNewBatch({...newBatch, model: e.target.value})}
                className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none" placeholder="iPhone 14 Pro Max"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Qty</label>
                <input 
                  type="number" value={newBatch.quantity} onChange={e => setNewBatch({...newBatch, quantity: parseInt(e.target.value) || 0})}
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Invoice</label>
                <input 
                  type="text" value={newBatch.invoice} onChange={e => setNewBatch({...newBatch, invoice: e.target.value})}
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none" placeholder="INV-000"
                />
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 mt-auto">
              Register Batch
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Batch Table */}
         <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Batch Inventory Overview</h3>
            <span className="text-xs text-slate-400">Showing last {batches.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Batch ID</th>
                  <th className="px-6 py-3">Model</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">QC Pass</th>
                  <th className="px-6 py-3">Defects</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {batches.map(batch => (
                  <tr key={batch.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{batch.id}</td>
                    <td className="px-6 py-4 text-slate-600">{batch.model}</td>
                    <td className="px-6 py-4 text-slate-600">{batch.quantity}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{batch.qcPass}</td>
                    <td className="px-6 py-4 text-rose-600 font-medium">{batch.defects}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        batch.status === BatchStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                        batch.status === BatchStatus.PROCESSING ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technician Assignment Form */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="text-indigo-600" size={20}/>
            Assign Technician
          </h3>
          <form onSubmit={handleAssign} className="space-y-4 flex-1">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Device IMEI</label>
              <input 
                type="text" value={assignment.imei} onChange={e => setAssignment({...assignment, imei: e.target.value})}
                className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none" placeholder="3523490..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Model (Auto-lookup)</label>
              <input 
                type="text" value={assignment.model} onChange={e => setAssignment({...assignment, model: e.target.value})}
                className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none" placeholder="e.g. iPhone 13"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Fault Type</label>
              <select 
                value={assignment.faultType} onChange={e => setAssignment({...assignment, faultType: e.target.value})}
                className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              >
                <option value="">Select Fault</option>
                <option value="Broken Screen">Broken Screen</option>
                <option value="Battery Health < 80%">Battery Health &lt; 80%</option>
                <option value="Audio Issues">Audio Issues</option>
                <option value="FaceID Failed">FaceID Failed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Technician Name</label>
              <select 
                value={assignment.techName} onChange={e => setAssignment({...assignment, techName: e.target.value})}
                className="w-full mt-1 p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              >
                <option value="">Select Technician</option>
                {technicians.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <button className="w-full bg-slate-900 text-white py-2 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg mt-auto">
              Assign Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  trend?: string, 
  isSuccess?: boolean, 
  isCritical?: boolean 
}> = ({ title, value, icon, trend, isSuccess, isCritical }) => (
  <div className="bg-white p-5 rounded-2xl border shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">{icon}</div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          isSuccess ? 'bg-emerald-100 text-emerald-600' : 
          isCritical ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
    <p className={`text-2xl font-bold mt-1 ${
      isSuccess ? 'text-emerald-600' : 
      isCritical ? 'text-rose-600' : 'text-slate-900'
    }`}>
      {value}
    </p>
  </div>
);

export default Dashboard;
