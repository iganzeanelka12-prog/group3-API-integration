import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>CodeBridge Academy</strong> &mdash; Practical Assessment LO1
      </div>
      <div>
        Built with React.js &amp; Express &bull; All Rights Reserved &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
