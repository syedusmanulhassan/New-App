
import React from 'react';
import { Database, Zap, ShieldCheck, CheckSquare, Settings } from 'lucide-react';

const DataGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Data & QC Guide</h1>
        <p className="text-slate-500 text-sm">Documentation on automated rules and operational standards</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Automated Logic Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Zap size={24}/></div>
            <h3 className="text-lg font-bold">Automated QC Rules</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-400 text-sm">01</div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Battery Health Threshold</p>
                <p className="text-slate-500 text-xs">Any device with Battery Health below <span className="text-rose-600 font-bold">80%</span> is automatically flagged for Manual QC and potential battery replacement.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-400 text-sm">02</div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Diagnostic Fail Count</p>
                <p className="text-slate-500 text-xs">Devices reporting <span className="text-rose-600 font-bold">3 or more</span> failed hardware tests via Dr Phone diagnostics trigger a critical manual review.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-400 text-sm">03</div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Auto-Pass Logic</p>
                <p className="text-slate-500 text-xs">If both conditions above are met (80%+ battery and &lt;3 fails), the system assigns an <span className="text-emerald-600 font-bold">Auto Pass</span> status.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CSV Format Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600"><Database size={24}/></div>
            <h3 className="text-lg font-bold">CSV Import Standards</h3>
          </div>
          <p className="text-slate-500 text-xs mb-4">Upload files exported directly from the Dr Phone diagnostic suite. Ensure the following column headers exist:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-50 p-2 rounded border font-mono">IMEI</div>
            <div className="bg-slate-50 p-2 rounded border font-mono">Model Name</div>
            <div className="bg-slate-50 p-2 rounded border font-mono">Fail (Total Test Fails)</div>
            <div className="bg-slate-50 p-2 rounded border font-mono">Battery Health</div>
            <div className="bg-slate-50 p-2 rounded border font-mono">Cycle Count</div>
            <div className="bg-slate-50 p-2 rounded border font-mono">Tester Name</div>
          </div>
          <div className="mt-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <CheckSquare size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase">Pro Tip</span>
             </div>
             <p className="text-xs text-indigo-700 leading-relaxed">
               Syncing your Dr Phone exports every hour ensures the Live Dashboard reflects real-time floor productivity.
             </p>
          </div>
        </div>

        {/* Roles Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm md:col-span-2">
           <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><ShieldCheck size={24}/></div>
            <h3 className="text-lg font-bold">System Permissions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl">
              <p className="font-bold text-slate-800 text-sm mb-1">Administrator</p>
              <p className="text-slate-500 text-xs">Full access to all modules, batch deletion, report exports, and system settings.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <p className="font-bold text-slate-800 text-sm mb-1">Technician</p>
              <p className="text-slate-500 text-xs">Access to QC module, device assignment, and updating status of allocated units.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <p className="font-bold text-slate-800 text-sm mb-1">Viewer</p>
              <p className="text-slate-500 text-xs">Read-only access to Dashboards and Reports. Cannot modify any batch data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGuide;
