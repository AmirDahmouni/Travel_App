import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedState, userDataState } from './atoms';
import { UserData } from "./types/User"

import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/Signup';
import LoginAI from "./pages/Login/LoginAI"

// import admin pages
import EditDestination from './pages/Admin/EditDestination';
import NewDestination from './pages/Admin/NewDestination';
import Applications from './pages/Admin/Applications';
import DetailsApplication from './pages/Admin/DetailsApplication';
import HomeAdmin from "./pages/Admin/Admin"
import Destination from './pages/Admin/Destination';
import SettingsAdmin from './pages/Admin/Settings';

// import traveler pages
import HomeTraveler from './pages/Traveler/Traveler';
import DestinationTraveler from './pages/Traveler/Destination';
import ApplicationPage from './pages/Traveler/Application';
import SettingsTraveler from './pages/Traveler/Settings';


//import Visitor pages
import HomeVisitor from './pages/Visitor/Visitor';
import NotificationsVisitor from './pages/Visitor/Notification';
import SettingsVisitor from './pages/Visitor/Settings';


//import Sos pages
import HomeSos from './pages/Sos/Sos';
import SettingsSos from './pages/Sos/Settings';
import NotificationSos from './pages/Sos/Notification';
import MyApplications from './pages/Traveler/Applications';


function App() {
  const isAuthenticated: boolean = useRecoilValue(isAuthenticatedState);
  const userData: UserData | null = useRecoilValue(userDataState);

  return (

    <Router>
      <Routes>
        {!isAuthenticated || !userData && <Route path="/Login" Component={(props) => <LoginPage {...props} />} />}

        {
          isAuthenticated && userData && userData.type === 'ADMIN_TRAV' && (
            <>
              {(
                <>
                  <Route path="/Home" Component={HomeAdmin} />
                  <Route path="/Destination/details" Component={Destination} />
                  <Route path="/Destination/new" Component={NewDestination} />
                  <Route path="/Destination/edit" Component={EditDestination} />
                  <Route path="/Applications" Component={Applications} />
                  <Route path="/Application/:id" Component={DetailsApplication} />

                  <Route path="/settings" Component={SettingsAdmin} />
                  <Route path='/*' element={<HomeAdmin />} />
                </>
              )}
            </>)
        }

        {
          isAuthenticated && userData && userData.type === 'TRAVELER' && (
            <>
              {(
                <>
                  <Route path="/Home" Component={HomeTraveler} />
                  <Route path="/Destination/details" Component={DestinationTraveler} />
                  <Route path="/Applications" Component={MyApplications} />
                  <Route path="/Application/:id" Component={ApplicationPage} />
                  <Route path="/Application" Component={ApplicationPage} />
                  <Route path="/settings" Component={SettingsTraveler} />
                  <Route path='/*' element={<HomeTraveler />} />
                </>
              )}
            </>)
        }
        {
          isAuthenticated && userData && userData.type === 'VISITOR' && (
            <>
              {(
                <>
                  <Route path="/Home" Component={HomeVisitor} />
                  <Route path="/Notifications" Component={NotificationsVisitor} />
                  <Route path="/Settings" Component={SettingsVisitor} />
                  <Route path='/*' element={<HomeVisitor />} />
                </>
              )}
            </>)
        }
        {
          isAuthenticated && userData && userData.type === 'SOS' && (
            <>
              {(
                <>
                  <Route path="/Home" Component={HomeSos} />
                  <Route path="/Notification/:id" Component={NotificationSos} />
                  <Route path="/Settings" Component={SettingsSos} />
                  <Route path='/*' element={<HomeVisitor />} />
                </>
              )}
            </>)
        }
        <Route path="/Signup" Component={(props) => <SignupPage {...props} />} />

      </Routes>
    </Router>

  )
}

export default App
