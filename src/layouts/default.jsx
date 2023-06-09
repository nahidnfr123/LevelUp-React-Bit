import {Outlet} from "react-router-dom";
import AppBar from "../components/global/AppBar";
import {useEffect, useRef} from "react";
import {getUser} from "../services/auth.service.js";
import {unsetUser, setUser} from "../store/authSlice";
import {useDispatch} from "react-redux";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Container from '@mui/material/Container';
import AchievementContainer from "../components/Achievement/AchievementContainer";
import * as React from "react";

const theme = createTheme();

const DefaultLayout = () => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      getUser().then(response => {
        if (response.message === 'success') dispatch(setUser(response.data))
        else {
          dispatch(unsetUser())
          // navigate('/auth/login')
        }
      })
    }
    return () => {
      isMounted.current = true;
    };
  }, [dispatch]); // [] calls only in first render ...
  return (
      <>
        <ThemeProvider theme={theme}>
          <AppBar/>
          <Container component="main" maxWidth="lg">
            <AchievementContainer/>
            {/*{Object.entries(auth).map(([key, value], i) => (
            <div className="item" key={key}>
              {key}: {value}
            </div>
        ))}*/}
            <Outlet/>
          </Container>
        </ThemeProvider>
      </>
  )
}

export default DefaultLayout;
