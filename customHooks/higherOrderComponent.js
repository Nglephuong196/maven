import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '../redux/actions/index'

const higherOrderComponent = (WrappedComponent) => {

  
  class HOC extends React.Component {
    
    // componentDidMount() {
      
    //   this.checkLocalStorageExists();
    // }
    // checkLocalStorageExists = async () => {
    //   if (isAuthenticated) {
    //     //  CUSTOM CODES
    //     const token = (await getIdTokenClaims()).__raw
    //     if (window.location.hostname.length > 20 && window.location.href.indexOf('role=creator') == -1 && window.location.href.indexOf(window.localStorage.getItem('Creator')) == -1) {
    //       const res = await fetch(`${process.env.NEXT_APP_API_ENDPOINT}/auth/login-subscriber`, {
    //         method: "POST",
    //         headers: {
    //           "Access-Control-Request-Headers": 'Authorization',
    //           Authorization: `Bearer ${token}`,
    //           "Content-Type": "application/json",
    //         },
    //       }).catch((err) => {
    //         console.log(err)
    //       })
    //       console.log(res)
    //       if (res) {
    //         res.json()
    //           .then(async (data) => {
    //             console.log(data.data)
    //             if (data) {
    //               dispatch(getToken({ token: data.data.token }))

    //             } else {
    //               console.log('test1')
    //               await logout({
    //                 returnTo: window.location.origin,
    //               });
    //             }
    //           })
    //           .catch(async (err) => {
    //             console.log("checkUserFail " + err);
    //             await logout({
    //               returnTo: window.location.origin,
    //             });
    //           });
    //       } else {
    //         alert('unauthorize')
    //         await logout({
    //           returnTo: window.location.origin,
    //         });
    //       }
    //     } else {
    //       const res = await fetch(`${process.env.NEXT_APP_API_ENDPOINT}/auth/login-creator`, {
    //         method: "POST",
    //         headers: {
    //           "Access-Control-Request-Headers": 'Authorization',
    //           Authorization: `Bearer ${token}`,
    //           "Content-Type": "application/json",
    //         },
    //       }).catch((err) => {
    //         console.log(err)
    //       })
    //       console.log(res)
    //       if (res) {
    //         res.json()
    //           .then(async (data) => {
    //             console.log(data.success)
    //             if (data.success == true) {
    //               console.log(data.data.token)
    //               dispatch(getToken({ token: data.data.token }))
    //               //dispatch(setUserRole({role: data.data.roleCurrent, channelUrl: data.data.channel?.channelUrl || null}))
    //               if (data.data.channel?.channelUrl && window.location.href.indexOf('role=creator') == -1 || data.data.channel?.channelUrl && localStorage.getItem('Creator') !== 'Creator') {
    //                 let temp = 'https://' + data.data.channel.channelUrl + '.dev.pomeuser.zien.vn?role=creator'
    //                 if (process.browser) {
    //                   // Client-side-only code
    //                   window.localStorage.setItem('Creator', data.data.channel.channelUrl)
    //                   // if (window.location.origin === 'https://dev.pomeuser.zien.vn') {
    //                   //   window.location.assign(temp)
    //                   // }
    //                 }

    //               }
    //             } else {
    //               alert('unauthorize')
    //               // await logout({
    //               //   returnTo: window.location.origin,
    //               // });
    //             }
    //           })
    //           .catch(async (err) => {
    //             console.log("checkUserFail " + err);
    //             // await logout({
    //             //   returnTo: window.location.origin,
    //             // });
    //           });
    //       } else {
    //         await logout({
    //           returnTo: window.location.origin,
    //         });
    //       }

    //     }
    //   }
    // }
    render() {
      return <WrappedComponent />;
    }
  }
  return HOC;
}

export default higherOrderComponent