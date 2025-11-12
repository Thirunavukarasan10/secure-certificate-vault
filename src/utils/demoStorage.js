// localStorage utility for demo mode
const STORAGE_KEY = 'demo_certificates';

// Generate unique certificate ID: CERT-<STUDENTID>-<RANDOM4DIGIT>
export function generateCertificateId(studentId) {
  const random4Digit = Math.floor(1000 + Math.random() * 9000);
  return `CERT-${studentId}-${random4Digit}`;
}

// Get all certificates from localStorage
export function getAllCertificates() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading certificates:', error);
    return [];
  }
}

// Save certificate to localStorage
export function saveCertificate(certificate) {
  try {
    const certificates = getAllCertificates();
    const uniqueId = certificate.uniqueId || generateCertificateId(certificate.studentId);
    const uploadDate = new Date().toISOString();
    const newCertificate = {
      ...certificate,
      uniqueId,
      qrUrl: certificate.qrUrl || certificate.verificationUrl || `https://securevault.verifier/verify?certId=${uniqueId}`,
      uploadDate,
      // Keep timestamp for backward compatibility
      timestamp: uploadDate,
      id: uniqueId, // Keep both for backward compatibility
    };
    certificates.push(newCertificate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
    return newCertificate;
  } catch (error) {
    console.error('Error saving certificate:', error);
    throw error;
  }
}

// Get certificates by student ID
export function getCertificatesByStudentId(studentId) {
  const certificates = getAllCertificates();
  return certificates.filter(cert => cert.studentId === studentId);
}

// Get certificates by department
export function getCertificatesByDepartment() {
  const certificates = getAllCertificates();
  const deptMap = new Map();
  
  certificates.forEach(cert => {
    const dept = cert.department || 'Unknown';
    deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
  });
  
  return Array.from(deptMap.entries()).map(([department, count]) => ({
    department,
    count,
  }));
}

// Get recent activity (last 5 uploads)
export function getRecentActivity(limit = 5) {
  const certificates = getAllCertificates();
  return certificates
    .sort((a, b) => new Date(b.uploadDate || b.timestamp) - new Date(a.uploadDate || a.timestamp))
    .slice(0, limit);
}

// Get unique student count
export function getUniqueStudentCount() {
  const certificates = getAllCertificates();
  const uniqueStudents = new Set(certificates.map(cert => cert.studentId));
  return uniqueStudents.size;
}

// Get uploads over time (grouped by date)
export function getUploadsOverTime() {
  const certificates = getAllCertificates();
  const dateMap = new Map();
  
  certificates.forEach(cert => {
    const date = new Date(cert.uploadDate || cert.timestamp);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
  });
  
  return Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      date,
      count,
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
}

// Delete certificate by unique ID
export function deleteCertificateByUniqueId(uniqueId) {
  try {
    const certificates = getAllCertificates();
    const filtered = certificates.filter(cert => 
      (cert.uniqueId || cert.id) !== uniqueId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
}

// Get certificate by unique ID
export function getCertificateByUniqueId(uniqueId) {
  const certificates = getAllCertificates();
  return certificates.find(cert => 
    (cert.uniqueId || cert.id) === uniqueId
  ) || null;
}

// Verification history storage
const VERIFICATION_STORAGE_KEY = 'demo_verifications';

// Save verification to history
export function saveVerification(uniqueId, valid, certificate = null) {
  try {
    const verifications = getVerificationHistory();
    const newVerification = {
      id: Date.now().toString(),
      uniqueId,
      valid,
      verifiedAt: new Date().toISOString(),
      certificate: certificate ? {
        certificateTitle: certificate.certificateTitle,
        studentName: certificate.studentName,
        studentId: certificate.studentId,
        department: certificate.department,
      } : null,
    };
    verifications.unshift(newVerification); // Add to beginning
    // Keep only last 100 verifications
    const limited = verifications.slice(0, 100);
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(limited));
    return newVerification;
  } catch (error) {
    console.error('Error saving verification:', error);
    throw error;
  }
}

// Get verification history
export function getVerificationHistory() {
  try {
    const data = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading verification history:', error);
    return [];
  }
}

// Clear all certificates (for testing)
export function clearAllCertificates() {
  localStorage.removeItem(STORAGE_KEY);
}

