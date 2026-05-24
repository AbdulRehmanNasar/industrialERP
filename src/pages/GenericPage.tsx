import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export default function GenericPage({ title, description }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Construction size={22} className="text-blue-400" />
        </div>
        <h2 className="text-sm font-semibold text-gray-700 mb-1">{title}</h2>
        <p className="text-xs text-gray-400">{description ?? 'This module is available. Configure it from the settings.'}</p>
      </div>
    </div>
  );
}
