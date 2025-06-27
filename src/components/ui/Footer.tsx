import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-12">
      <div className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} EmotiCore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
