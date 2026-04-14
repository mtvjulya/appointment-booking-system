import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const isAdminAuthenticated = () => {
    const adminAuth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    
    if (!adminAuth || adminAuth !== 'true') {
      return false;
    }
    

    if (authTime) {
      const timeElapsed = Date.now() - parseInt(authTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (timeElapsed > twentyFourHours) {

        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
        return false;
      }
    }
    
    return true;
  };

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
