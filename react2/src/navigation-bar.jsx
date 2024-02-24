import React, {useState} from 'react'
import logo from './commons/images/icon.svg';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import AccountMenu from "./person/components/profile";
import Typography from "@mui/material/Typography";
import {TextField} from "@material-ui/core";
import styled from "@emotion/styled";
import PersonMenu from "./person/components/personMenu";
import DeviceMenu from "./device/deviceMenu";
import Chat from "./person/chat";
import ChatFull from "./person/chatFull";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};
const customNavbarStyle = {
    backgroundColor: '#8ac3d7',
}
const SearchIconWrapper = styled(SearchIcon)`
  position: absolute;
  top: 50%;
  left: 175px;
  transform: translateY(-50%);
  color: #4f96ad;
  pointer-events: none;
`;
const NavigationBar = ({ setSearchQuery, isAdmin, openAddPersonForm, openAddDeviceForm , openViewDevices, openViewPersons, handleChatFullToggle}) => {
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };


  return (  <div >
        < Navbar expand="md" style={customNavbarStyle}>
            <NavbarBrand href={isAdmin ? "/admin" : "/client"}>
                <img src={logo} width={"50"}
                     height={"35"} />
            </NavbarBrand>
              <form style = {{marginLeft: '500px', marginTop:'10px'}}>
                <div className='my-3' style ={{position: 'relative'}}>
                    <TextField
                        type='text'
                        onChange={handleSearchInputChange}
                        placeholder='Search'
                    />
                    <SearchIconWrapper />
                </div>
            </form>

            <div className="d-flex flex-grow-1"> {/* Make this div take most of the available space */}
                <Typography  sx={{ marginLeft: '400px', marginTop: '10px' }}>
                    Hello, {sessionStorage.getItem('name')}
                </Typography>
                {
                    isAdmin &&(
                        <div className="ml-auto"> {/* Push this div to the right */}


                            <PersonMenu openAddPersonForm={openAddPersonForm}  openViewPersons={openViewPersons}/>

                        </div>)}
                { isAdmin &&(  <div className="ml-auto"> {/* Push this div to the right */}


                <DeviceMenu openAddDeviceForm={openAddDeviceForm} openViewDevices={openViewDevices}/>

            </div>

                    )
                }
                <div  className="ml-auto">
                    <Chat handleChatFullToggle={handleChatFullToggle} />
                </div>
                <div className="ml-auto"> {/* Push this div to the right */}

                        <AccountMenu />
                </div>
            </div>

        </Navbar>

      </div>
);
}
export default React.memo(NavigationBar);

