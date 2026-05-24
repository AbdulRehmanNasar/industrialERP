import { useState } from 'react';
import { Building2, Users, Receipt, Settings as SettingsIcon, Shield, Save } from 'lucide-react';
import { Btn, Input, Select } from '../components/ui';

const tabs = [
  { id: 'company', label: 'Company', icon: <Building2 size={13} /> },
  { id: 'users', label: 'Users', icon: <Users size={13} /> },
  { id: 'tax', label: 'Tax Settings', icon: <Receipt size={13} /> },
  { id: 'system', label: 'System', icon: <SettingsIcon size={13} /> },
  { id: 'security', label: 'Security', icon: <Shield size={13} /> },
] as const;
type Tab = typeof tabs[number]['id'];

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@pumiceerp.pk', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Saleem Ahmed', email: 'saleem@pumiceerp.pk', role: 'Salesperson', status: 'Active' },
  { id: '3', name: 'Accounts Dept', email: 'accounts@pumiceerp.pk', role: 'Accountant', status: 'Active' },
];

const permissions = ['Create', 'Edit', 'Delete', 'View'] as const;
const roleMatrix: Record<string, Record<string, boolean>> = {
  Admin: { Create: true, Edit: true, Delete: true, View: true },
  Accountant: { Create: true, Edit: true, Delete: false, View: true },
  Salesperson: { Create: true, Edit: false, Delete: false, View: true },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('company');

  return (
    <div className="flex-1 overflow-hidden flex bg-gray-50">
      <div className="w-40 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-3 border-b border-gray-100">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Settings</span>
        </div>
        <nav className="p-2 space-y-0.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded transition-colors ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'company' && (
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Company Settings</h2>
            <div className="bg-white rounded border border-gray-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-white" /></div>
                <div>
                  <Btn variant="secondary" size="xs">Upload Logo</Btn>
                  <div className="text-[10px] text-gray-400 mt-1">PNG, JPG max 2MB</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Input label="Company Name" defaultValue="PumiceERP Industrial Materials Ltd." /></div>
                <Input label="NTN Number" defaultValue="1234567-8" />
                <Input label="STRN Number" defaultValue="PKR-12345678" />
                <div className="col-span-2"><Input label="Registered Address" defaultValue="Plot 12, Industrial Area, SITE, Karachi, Pakistan" /></div>
                <Input label="Phone" defaultValue="021-35123456" />
                <Input label="Email" defaultValue="info@pumiceerp.pk" />
                <Select label="Invoice Template"><option>Standard</option><option>Professional</option><option>Compact</option></Select>
                <Select label="Currency"><option>PKR - Pakistani Rupee</option><option>USD - US Dollar</option></Select>
              </div>
              <div className="pt-2"><Btn variant="primary" size="sm"><Save size={12} />Save Company Settings</Btn></div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">User Management</h2>
              <Btn variant="primary" size="sm">+ Add User</Btn>
            </div>
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-4">
              <table className="w-full text-xs">
                <thead><tr>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white">{u.name.charAt(0)}</div>
                          <span className="font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100 text-gray-600">{u.email}</td>
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          u.role === 'Admin' ? 'bg-red-100 text-red-700' : u.role === 'Accountant' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 text-green-700">{u.status}</span>
                      </td>
                      <td className="px-3 py-1.5 border-b border-gray-100">
                        <div className="flex gap-2">
                          <button className="text-[10px] text-blue-600 hover:underline">Edit</button>
                          <button className="text-[10px] text-red-500 hover:underline">Disable</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100"><h3 className="text-xs font-semibold text-gray-700">Role Permissions Matrix</h3></div>
              <table className="w-full text-xs">
                <thead><tr>
                  <th className="bg-gray-50 px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200">Role</th>
                  {permissions.map(p => <th key={p} className="bg-gray-50 px-3 py-2 text-center text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200">{p}</th>)}
                </tr></thead>
                <tbody>
                  {Object.entries(roleMatrix).map(([role, perms]) => (
                    <tr key={role} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-800">{role}</td>
                      {permissions.map(p => (
                        <td key={p} className="px-3 py-2 border-b border-gray-100 text-center">
                          <input type="checkbox" checked={perms[p]} readOnly className="w-3.5 h-3.5 accent-blue-600" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Tax Settings</h2>
            <div className="bg-white rounded border border-gray-200 p-4 shadow-sm space-y-3">
              <Select label="Default Sales Tax %"><option value="17">17% (Standard GST)</option><option value="0">0% (Zero Rated)</option><option value="5">5% (Reduced)</option></Select>
              <Input label="Tax Registration Number (STRN)" defaultValue="PKR-12345678" />
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-[10px] font-semibold text-gray-600 uppercase mb-2">Tax Rules</h4>
                <div className="space-y-2">
                  {[
                    { rule: 'Apply GST on all sales invoices', checked: true },
                    { rule: 'Include tax in unit price', checked: false },
                    { rule: 'Generate FBR compliant invoices', checked: true },
                    { rule: 'Auto-calculate withholding tax', checked: false },
                  ].map(r => (
                    <label key={r.rule} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={r.checked} className="w-3.5 h-3.5 accent-blue-600" />
                      <span className="text-xs text-gray-700">{r.rule}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Btn variant="primary" size="sm"><Save size={12} />Save Tax Settings</Btn>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">System Settings</h2>
            <div className="bg-white rounded border border-gray-200 p-4 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select label="Currency"><option>PKR - Pakistani Rupee</option><option>USD - US Dollar</option></Select>
                <Select label="Date Format"><option>YYYY-MM-DD</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option></Select>
                <Select label="Timezone"><option>Asia/Karachi (UTC+5)</option><option>UTC</option></Select>
                <Select label="Financial Year Start"><option>January</option><option>July (Pakistan)</option></Select>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-[10px] font-semibold text-gray-600 uppercase mb-2">Auto Backup</h4>
                <div className="space-y-2">
                  {[
                    { rule: 'Enable automatic daily backup', checked: true },
                    { rule: 'Email backup report to admin', checked: true },
                    { rule: 'Retain backup for 30 days', checked: false },
                  ].map(r => (
                    <label key={r.rule} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={r.checked} className="w-3.5 h-3.5 accent-blue-600" />
                      <span className="text-xs text-gray-700">{r.rule}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Btn variant="primary" size="sm"><Save size={12} />Save System Settings</Btn>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Security</h2>
            <div className="bg-white rounded border border-gray-200 p-4 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Change Password</h4>
                <div className="space-y-2">
                  <Input label="Current Password" type="password" placeholder="--------" />
                  <Input label="New Password" type="password" placeholder="--------" />
                  <Input label="Confirm New Password" type="password" placeholder="--------" />
                  <Btn variant="primary" size="sm">Update Password</Btn>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Enable 2FA via SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                  </label>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Active Sessions</h4>
                <table className="w-full text-xs">
                  <thead><tr>
                    {['Device', 'IP', 'Last Active', 'Action'].map(h => (
                      <th key={h} className="bg-gray-50 px-2 py-1.5 text-left text-[10px] font-semibold text-gray-500 border-b border-gray-200">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      { device: 'Chrome on Windows (Current)', ip: '192.168.1.100', last: 'Now' },
                      { device: 'Firefox on MacOS', ip: '192.168.1.105', last: '2 hours ago' },
                    ].map(s => (
                      <tr key={s.device} className="hover:bg-gray-50">
                        <td className="px-2 py-1.5 border-b border-gray-100 text-gray-700">{s.device}</td>
                        <td className="px-2 py-1.5 border-b border-gray-100 text-gray-500 font-mono">{s.ip}</td>
                        <td className="px-2 py-1.5 border-b border-gray-100 text-gray-500">{s.last}</td>
                        <td className="px-2 py-1.5 border-b border-gray-100">
                          {!s.device.includes('Current') && <button className="text-[10px] text-red-500 hover:underline">Revoke</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
