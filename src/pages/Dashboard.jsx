import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';
import accessToken from "../services/token.service";

export default function Dashboard() {
    window.Pusher = Pusher;
    const [onlineUsers, setOnlineUser] = useState([])

    useEffect(()=>{
        const options = {
            broadcaster: "pusher",
            key: `ae1238c8d625f7d212d3`,
            cluster: `ap2`,
            // forceTLS: '',
            encrypted: true,
            authEndpoint: `http://192.168.12.207:8080/api/broadcasting/auth `,
            auth: {
                headers: {
                    Authorization: `Bearer ${accessToken()}`,
                    Accept : 'application/json'
                },
            },
        }
        const echo = new Echo(options);
        echo.join('online')
            .here(users => (setOnlineUser(users)))
            .joining(user => onlineUsers.push(user))
            .leaving(user => (
                setOnlineUser(onlineUsers.filter(u => (u.id !== user.id)))
            ))

        console.log(onlineUsers)
    }, [])
    console.log(onlineUsers)

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
      </main>
  );
}
