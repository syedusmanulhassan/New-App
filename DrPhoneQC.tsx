
import React, { useState, useRef } from 'react';
import { useApp } from '../store';
import { Device, DeviceStatus } from '../types';
import { 
  Upload, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  UserPlus
} from 'lucide-react';

const DrPhoneQC: React.FC = () => {
  const { devices, addDevices, technicians, assignTechnician } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Devices
  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.imei.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate CSV parsing
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Real app would parse properly. We simulate with 5 random devices
      const mockNewDevices: Device[] = Array.from({ length: 5 }).map((_, i) => {
        const battery = Math.floor(Math.random() * (100 - 75) + 75);
        const fails = Math.floor(Math.random() * 5);
        const cycle = Math.floor(Math.random() * 800);
        
        // Automated Logic
        let status = DeviceStatus.AUTO_PASS;
        let manualFlag = false;
        if (battery < 80 || fails >= 3) {
          status = DeviceStatus.MANUAL_QC;
          manualFlag = true;
        }

        return {
          imei: `35${Math.floor(Math.random() * 1000000000000)}`,
          model: 'iPhone 13 Pro',
          batteryHealth: battery,
          cycleCount: cycle,
          failCount: fails,
          testerName: 'Dr Phone Station 1',
          manualQCFlag: manualFlag,
          score: Math.floor(Math.random() * (100 - 80) + 80),
          status: status,
          uploadDate: new Date().toISOString()
        };
      });

      addDevices(mockNewDevices);
      alert(`${mockNewDevices.length} devices imported with Automated QC applied.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dr Phone QC Management</h1>
          <p className="text-slate-500 text-sm">Upload CSV from diagnostic software to sync status automatically</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition"
          >
            <Upload size={18} />
            Import CSV
          </button>
        </div>
      </header>

      {/* QC Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Auto Passed</p>
            <p className="text-xl font-bold text-slate-900">{devices.filter(d => d.status === DeviceStatus.AUTO_PASS).length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full text-amber-600"><AlertCircle size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Manual Review</p>
            <p className="text-xl font-bold text-slate-900">{devices.filter(d => d.status === DeviceStatus.MANUAL_QC).length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-full text-slate-600"><FileText size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Devices</p>
            <p className="text-xl font-bold text-slate-900">{devices.length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search IMEI or Model..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="p-2 bg-slate-50 border rounded-lg outline-none text-sm min-w-[150px]"
          >
            <option value="All">All Statuses</option>
            {Object.values(DeviceStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">IMEI / Model</th>
                <th className="px-6 py-4">Fails</th>
                <th className="px-6 py-4">Battery / Cycles</th>
                <th className="px-6 py-4">Manual QC</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDevices.length > 0 ? filteredDevices.map(device => (
                <tr key={device.imei} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{device.imei}</div>
                    <div className="text-xs text-slate-400">{device.model}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${device.failCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {device.failCount} failed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold ${device.batteryHealth < 80 ? 'text-rose-600' : 'text-slate-900'}`}>{device.batteryHealth}%</div>
                    <div className="text-xs text-slate-400">{device.cycleCount} cycles</div>
                  </td>
                  <td className="px-6 py-4">
                    {device.manualQCFlag ? (
                      <span className="flex items-center gap-1 text-rose-500 font-bold text-[10px] uppercase">
                        <AlertCircle size={12} /> Required
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase">
                        <CheckCircle2 size={12} /> Auto OK
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      device.status === DeviceStatus.AUTO_PASS ? 'bg-emerald-100 text-emerald-700' :
                      device.status === DeviceStatus.MANUAL_QC ? 'bg-amber-100 text-amber-700' :
                      device.status === DeviceStatus.REPAIRING ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {device.assignedTo || '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!device.assignedTo && (
                      <button 
                        onClick={() => {
                          const tech = prompt('Enter Technician Name:', technicians[0].name);
                          if (tech) assignTechnician(device.imei, tech, device.failCount > 0 ? 'Diagnostic Fail' : 'General Refurb');
                        }}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 ml-auto font-medium"
                      >
                        <UserPlus size={14} /> Assign
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    No devices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrPhoneQC;
