import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-light border-top p-3 text-center">
      <div className="container-fluid">
        <span className="text-muted">
          Digitalization Projects Tracker &copy; {currentYear}
        </span>
      </div>
    </footer>
  );
};

export default Footer;