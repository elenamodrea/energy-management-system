import React from 'react';

import BackgroundImg from '../commons/images/management-background.png';

import {Button, Container, Jumbotron} from 'reactstrap';
import '../commons/styles/homestyle.css'
import { withRouter } from 'react-router-dom';


const backgroundStyle = {
   // backgroundPosition: 'center',
    backgroundSize: '100% 90%', // Cover the entire page
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%', // Set the height to 100% of the viewport height
    backgroundImage: `url(${BackgroundImg})`,
};
const containerStyle = {

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center horizontally
    justifyContent: 'flex-start',

    height: '100vh', // Full viewport height
    color: '#26678C', // Set the text color to white
     };
const buttonGroupStyle = {
    paddingTop: '20px',
    display: 'flex',
    gap: '70px', // Adjust the gap to control the space between buttons
};
const btnstyle={margin:'9px 0', backgroundColor: '#26678C', borderRadius: '15px', marginTop: '15px', }
class Home extends React.Component {


    render() {

        return (

            <div>
                <Jumbotron fluid style={backgroundStyle}>
                    <Container fluid style = {containerStyle}>
                        <h2>Welcome to Our Energy Management System</h2>
                        <p>
                            Efficiently managing and optimizing your energy resources is now at your
                            fingertips. Our Energy Management System empowers you to take control of
                            your energy consumption and make smarter, more sustainable choices.
                        </p>

                        <h3>Why Choose Us?</h3>
                        <p>
                            Our Energy Management System is designed with you in mind. We understand
                            the importance of energy efficiency, cost savings, and environmental
                            responsibility. With our intuitive platform, you can actively manage
                            your energy resources and make a positive impact on your home, business,
                            and the planet.
                        </p>
                        <h3>Join Us in the Journey Towards a Sustainable Future</h3>
                        <p>
                            By using our Energy Management System, you are taking an essential step
                            towards a more sustainable and energy-efficient lifestyle. Together, we
                            can create a brighter, greener future for all.
                        </p>
                        <p style={{ fontSize: '21.5px',  paddingTop: '170px',fontWeight: 'bold'  }}>
                            Sign up or sing in and experience the future of energy management today!
                        </p>
                        <div style={buttonGroupStyle}>
                            <p className="lead">
                                <Button color="primary" style ={btnstyle} onClick={() => this.props.history.push('/register')}>
                                    Sign up
                                </Button>
                            </p>
                            <p className="lead">
                                <Button color="primary" style ={btnstyle} onClick={() => this.props.history.push('/login')}>
                                    Sign in
                                </Button>
                            </p>
                        </div>
                    </Container>
                </Jumbotron>

            </div>
        )
    };
}

export default withRouter(Home);
