import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import api from 'services/api';

import Container from 'components/_layouts/Container';
//import SignatureControl from './SignatureControl';
import CardContainer from './CardContainer';
import AppointmentsLineGraph from './AppointmentsLineGraph';

import { HeaderContainer, DashboardContainer } from './styles';
import getValidationErrors from 'Utils/getValidationErrors';
import history from 'services/browserhistory';

const Dashboard = () => {
  const notificationsList = useSelector(state => state.notification.list);
  const profile = useSelector(state => state.user.profile);
  const [dashboard, setDashboard] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!profile.provider) {
      history.push('/appointment');
      window.location.href = `${window.location.origin}/appointment`;
    } else {
      loadDashboard();
    }
  }, []);

  useEffect(() => {
    const [notification] = notificationsList;
    if (
      notification &&
      notification.provider_id === profile.id &&
      !notification.read
    ) {
      loadDashboard();
    }
  }, [notificationsList]);

  async function loadDashboard() {
    try {
      const response = await api.get('dashboard');
      setDashboard(response.data);
      setLoaded(true);
    } catch (error) {
      getValidationErrors(error);
    }
  }
  return (
    <>
      <HeaderContainer>
        <div>
          {/* {!profile.company_provider && loaded && (
            <SignatureControl company={dashboard.company} />
          )} */}
        </div>
      </HeaderContainer>
      <Container>
        <DashboardContainer>
          <CardContainer dashboard={dashboard} loaded={loaded} />

          <AppointmentsLineGraph className="appointment-graph" />
        </DashboardContainer>
      </Container>
    </>
  );
};

export default Dashboard;
