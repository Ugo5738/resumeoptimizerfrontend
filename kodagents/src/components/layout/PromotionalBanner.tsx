import React from 'react';
import { FaYoutube } from 'react-icons/fa';

interface IconOptionProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
}

const IconOption: React.FC<IconOptionProps> = ({ Icon, name }) => (
  <span className="flex items-center space-x-2">
    <Icon className="w-6 h-6" />
    <span>{name}</span>
  </span>
);

const PromotionalBanner: React.FC = () => {
  return (
    <div className="mb-8 flex justify-center">
      <a 
        href="https://youtu.be/Gc3ZTxuiAkk"
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center rounded-full px-3 py-1 text-lg leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition-all duration-300 hover:bg-indigo-50"
      >
        <IconOption Icon={FaYoutube} name="Watch" />
        <span className="ml-2">
          <span className="font-semibold text-indigo-600">Resumeguru.pro</span> in Action
        </span>
      </a>
    </div>
  );
};

export default PromotionalBanner;
