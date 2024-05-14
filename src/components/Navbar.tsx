import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MailIcon from '@mui/icons-material/Mail';
import MoreIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState, isAuthenticatedState, userDataState } from '../atoms';
import { getApplications } from '../services/applicationService';
import { getMymessages } from '../services/messageService';




const useStyles = makeStyles((theme) => ({
  customNavBar: {
    backgroundColor: "#D9D9D9",
  },
  customHeader: {
    color: "#000000 imported",
  },
  customSearch: {
    width: "80% !important"
  },
  customAppBar: {
    color: "#283044 !important"
  }
}));


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const userData: UserData | null = useRecoilValue(userDataState);

  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserData] = useRecoilState(userDataState);

  const [notifications, setNotifications] = useState()

  const navigate = useNavigate();

  const [_, setFilter] = useRecoilState(filterState)

  useEffect(() => {

    const fetchNotifications = async () => {
      switch (userData.type) {
        case "ADMIN_TRAV": {
          const { data: pendingApps } = await getApplications("pending")
          setNotifications(pendingApps.length)
          break;
        }
        case "TRAVELER": {
          const { data: messages } = await getMymessages()
          setNotifications(messages.length)
          break;
        }
        default: { console.log("default") }
      }
    }

    fetchNotifications()

  }, [userData])

  const Disconnect = (event: React.MouseEvent<HTMLElement>) => {
    setIsAuthenticated(true)
    setUserData(null)
    localStorage.removeItem("Token")
    navigate('/login');
  }



  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };



  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleNotifications = () => {
    if (userData.type === "VISITOR") navigate("/Notifications")
    else if (userData.type === "SOS") navigate("/home")
    //admin and traveler
    else navigate("/Applications")
  }



  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate("/home")}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" >
          <HomeIcon />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem onClick={handleNotifications}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" >
          <Badge badgeContent={notifications} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/settings")}>
        <IconButton

          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      <MenuItem onClick={Disconnect}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <p>Disconnect</p>
      </MenuItem>
    </Menu>
  );
  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="static" className={classes.customAppBar}>
        <Toolbar className={classes.customNavBar}>
          {
            (userData.type == "TRAVELER" || userData.type == "ADMIN_TRAV") &&
            <Search className={classes.customSearch} >
              <SearchIconWrapper >
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={(e) => setFilter(e.currentTarget.value)}
                placeholder="Search Destinations …"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          }

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" color="inherit" onClick={() => navigate("/home")}>
              <HomeIcon />
            </IconButton>

            <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={handleNotifications}>
              <Badge badgeContent={notifications} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={() => navigate("/settings")} size="large" aria-label="show 4 new mails" color="inherit">
              <AccountCircle />
            </IconButton>

            <IconButton size="large" aria-label="show exit" color="inherit" onClick={Disconnect}>
              <ExitToAppIcon />
            </IconButton>

          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}