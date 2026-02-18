import React, { useState } from 'react';
import { Layout, AppContext, ViewState, Request, MOCK_REQUESTS } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

import { RequestDetails } from './components/RequestDetails';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const addRequest = (req: Request) => {
    setRequests([req, ...requests]);
  };

  return (
    <AppContext.Provider value={{
      view,
      setView,
      selectedRequest,
      setSelectedRequest,
      requests,
      addRequest
    }}>
      <Layout>
        {view === 'login' && <Login />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'request-details' && <RequestDetails />}
      </Layout>
    </AppContext.Provider>
  );
}
