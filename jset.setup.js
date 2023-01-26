import '@testing-library/jest-dom/extend-expect';
if (typeof this.global.TextEncoder === 'undefined') {
  const { TextEncoder } = require('util');
  this.global.TextEncoder = TextEncoder;
}
