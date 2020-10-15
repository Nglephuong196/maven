import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from "react-redux";
import store from '../redux/store/index'
import '../styles/globals.css'
//import '../components/react/AutoScrollButton/index.scss';
import 'draft-js/dist/Draft.css';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/video-react/dist/video-react.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'ss-editor/dist/style.css'
import 'react-quill/dist/quill.snow.css'
import NProgress from 'nprogress'
import Head from 'next/head'

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const onRedirectCallback = (appState) => {
  // Use Next.js's Router.replace method to replace the url
  console.log('Router.replace(appState?.returnTo || '/')', appState)
  console.log('hello')
  Router.replace(appState?.returnTo || '/');
};

class MyApp extends App {

  render() {
    const { Component, pageProps } = this.props;
    if (process.browser && false) {
      console.log(window.location)
      return (
        <Provider store={store}>

          <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
            clientId="9uOu4rkgZQxIvd5fGxgF1IvHVa1AtE2T"
            redirectUri={typeof window !== 'undefined' && window.location.origin}
            onRedirectCallback={onRedirectCallback}
          >
            <Component {...pageProps} />
          </Auth0Provider>
        </Provider>
      );
    } else {
      return (

        <Provider store={store}>
          <Head>
            <title>My page title</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          </Head>
          <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
            redirectUri={typeof window !== 'undefined' && window.location.origin}
            onRedirectCallback={onRedirectCallback}
          >
            <Component {...pageProps} />
          </Auth0Provider>
        </Provider>
      );
    }

  }
}

export default MyApp
