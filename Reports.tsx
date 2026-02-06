
import React, { useState } from 'react';
import { useApp } from '../store';
import { Download, Calendar, Filter, FileSpreadsheet, FileText, LayoutList } from 'lucide-react';

const Reports: React.FC = () => {
  const { batches, devices } = useApp();
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: new Date().toISOString().split('T')[0] });

  const exportCSV = () => {
    let data = [];
    let filename = `report_${reportType}.csv`;

    if (reportType === 'inventory') {
      data = batches.map(b => `${b.id},${b.model},${b.quantity},${b.qcPass},${b.defects},${b.status}`);
      data.unshift('Batch ID,Model,Quantity,QC Pass,Defects,Status');
    } else {
      data = devices.map(d => `${d.imei},${d.model},${d.batteryHealth},${d.status},${d.assignedTo || 'Unassigned'}`);
      data.unshift('IMEI,Model,Battery,Status,Technician');
    }

    const blob = new Blob([data.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Operational Reports</h1>
        <p className="text-slate-500 text-sm">Generate and export performance data for business analysis</p>
      </header>

      {/* Configuration */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Filter size={18} className="text-indigo-600"/>
          Report Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Report Type</label>
            <select 
              value={reportType} onChange={e => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
            >
              <option value="inventory">Warehouse Inventory Report</option>
              <option value="technician">Technician Performance</option>
              <option value="batch">Batch Processing Report</option>
              <option value="status">Device Status Report</option>
              <option value="summary">Daily Production Summary</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input 
                type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input 
                type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={exportCSV}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Formats Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Export Options</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 group">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-emerald-500" size={20}/>
                <span className="text-sm font-medium">Microsoft Excel (.xlsx)</span>
              </div>
              <Download size={16} className="text-slate-300 group-hover:text-slate-600"/>
            </button>
            <button className="w-full flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 group">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={20}/>
                <span className="text-sm font-medium">Standard CSV (.csv)</span>
              </div>
              <Download size={16} className="text-slate-300 group-hover:text-slate-600"/>
            </button>
            <button className="w-full flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 group">
              <div className="flex items-center gap-3">
                <LayoutList className="text-rose-500" size={20}/>
                <span className="text-sm font-medium">PDF Document (.pdf)</span>
              </div>
              <Download size={16} className="text-slate-300 group-hover:text-slate-600"/>
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Report Preview</h4>
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <FileText className="text-slate-200 w-12 h-12 mb-2" />
            <p className="text-slate-400 text-sm font-medium">Configure and export to view detailed data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
