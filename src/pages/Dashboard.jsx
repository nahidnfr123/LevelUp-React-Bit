import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pusher from "pusher-js";
import Echo from "laravel-echo";
import accessToken from "../services/token.service";
import {useEffect, useRef} from "react";
import {List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import Avatar from "@mui/material/Avatar";

export default function Dashboard() {
  const isMounted = useRef(false)
  window.Pusher = pusher;
  const [onlineUsers, setOnlineUsers] = React.useState([]);

  const echo = new Echo({
    broadcaster: 'pusher',
    key: 'ae1238c8d625f7d212d3',
    cluster: 'ap2',
    forceTLS: true,
    encrypted: true,
    authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        Accept: 'application/json',
      }
    }
  })

  useEffect(() => {
    if (!isMounted.current) {
      echo.join('online')
          .here(users => {
            setOnlineUsers(users)
            console.log(onlineUsers)
          })
          .joining(user => {
            setOnlineUsers([...onlineUsers, user]);
            console.log('joined')
            console.log(user)
          })
          .leaving(user => {
            const users = onlineUsers

            setOnlineUsers(onlineUsers.filter(u => u.uuid !== user.uuid))
            console.log('left')
            console.log(user)
          })
          .error((error) => {
            console.error(error);
          });
    }
    return () => {
      isMounted.current = true;
    };
  }, [setOnlineUsers])

  return (
      <main>
        <Box
            sx={{
              pt: 8,
              pb: 6,
            }}
        >
          <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
          >
            Dashboard
          </Typography>
        </Box>

        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
          {onlineUsers && onlineUsers.map((user, n) => (
              <ListItem key={n}>
                <ListItemAvatar>
                  <Avatar>
                    image
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.email} secondary="Jan 9, 2014"/>
              </ListItem>
          ))}
        </List>
      </main>
  );
}
