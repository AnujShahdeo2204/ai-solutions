const path = require('path');
const fs = require('fs');

const allowedDirs = [
  path.resolve(__dirname, '../../data'),
  path.resolve(__dirname, '../../../essential')
];

/**
 * Validates whether a given string is a safe, allowed local file path
 * Prevents Directory Traversal (e.g. ../../) and Arbitrary File Reads
 * @param {string} input 
 * @returns {boolean}
 */
function isSafeFilePath(input) {
  if (typeof input !== 'string') return false;
  
  const trimmed = input.trim();
  // If it looks like JSON, CSV with multiple lines, or XML, it is content, NOT a file path
  if (
    trimmed.startsWith('{') || 
    trimmed.startsWith('[') || 
    trimmed.startsWith('<') ||
    trimmed.includes('\n') ||
    trimmed.includes('\r')
  ) {
    return false;
  }

  try {
    const resolved = path.resolve(trimmed);
    const isWithinAllowed = allowedDirs.some(dir => resolved.startsWith(dir));
    return isWithinAllowed && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  } catch (e) {
    return false;
  }
}

module.exports = { isSafeFilePath, allowedDirs };
