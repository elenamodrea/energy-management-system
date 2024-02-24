import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import PersonContainer from './person/person-container'
import Client from './client/components/client';
import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import Login from "./registration/components/login";
import SignUp from "./registration/components/signup";
import AccountMenu from "./person/components/profile";
import Admin from "./admin/admin";
import EnergyConsumption from "./client/components/energy";
import ChatComponent from "./person/chat";
import Chat from "./person/chat";
import ChatFull from "./person/chatFull";

class App extends React.Component {


    render() {

        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <Switch>
                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />

                        <Route
                            exact
                            path='/login'
                            render={() => <Login/>}
                        />

                        <Route
                            exact
                            path='/register'
                            render={() => <SignUp/>}
                        />
                        <Route
                            exact
                            path='/client'
                            render={() => <Client/>}
                        />
                        <Route
                            exact
                            path='/admin'
                            render={() => <Admin/>}
                        />
                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
