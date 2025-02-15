import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/shared/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/admin/Companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Mock from './components/Mock';
import TestPage from './components/Test';
import { CiChat1 } from "react-icons/ci";
import ChatModal from './components/ChatModal';

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/description/:id', element: <JobDescription /> },
  { path: '/browse', element: <Browse /> },
  { path: '/profile', element: <Profile /> },
  { path: '/mock', element: <Mock /> },
  { path: '/test', element: <TestPage /> },
  { path: '/admin/companies', element: <ProtectedRoute><Companies/></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> },
  { path: '/admin/companies/:id', element:<ProtectedRoute><CompanySetup/></ProtectedRoute> },
  { path: '/admin/jobs', element:<ProtectedRoute><AdminJobs/></ProtectedRoute> },
  { path: '/admin/jobs/create', element:<ProtectedRoute><PostJob/></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element:<ProtectedRoute><Applicants/></ProtectedRoute> }
]);

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      <RouterProvider router={appRouter} />
      <CiChat1 
        className='fixed bottom-4 right-4 text-4xl bg-purple-500 text-white p-3 rounded-full cursor-pointer shadow-lg w-16 h-16'
        onClick={() => setIsChatOpen(true)}
      />
      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default App;
