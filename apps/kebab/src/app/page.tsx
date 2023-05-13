'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

function Home() {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  const [hres, setHres] = useState<any>();

  async function handleLogin() {
    if (authenticated) {
      await keycloak?.logout();
    }

    await keycloak?.login();
  }

  async function callHealthCheckAPI() {
    if (!keycloak?.token) {
      console.error('Please login!');
      return;
    }

    try {
      const response = await fetch(
        'https://api.localtest.me/alpha/health-check',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer ' + keycloak.idToken,
          }),
        },
      );

      const res = await response.json();
      setHres(res);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const _keycloak = new Keycloak({
      url: 'https://auth.localtest.me',
      realm: 'wednesday',
      clientId: 'frontend',
    });

    _keycloak.init({ onLoad: 'check-sso' }).then((authenticated: boolean) => {
      if (authenticated) {
        _keycloak.loadUserInfo().then((userInfo: any) => {
          setUserInfo({
            name: userInfo.name,
            email: userInfo.email,
            id: userInfo.sub,
            roles: _keycloak?.tokenParsed?.realm_access?.roles,
          });
        });
      }

      setAuthenticated(authenticated);
    });

    setKeycloak(_keycloak);
  }, []);

  return (
    <main className="h-full w-full">
      <Head>
        <title>Making Kebabs in sunlight!</title>
      </Head>

        <header className="flex w-full justify-end">
          <button
            onClick={handleLogin}
            className="relative mt-10 inline-flex items-center justify-center p-0.5 mb-2 mr-20 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-500 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              {authenticated ? 'Logout' : 'Sign In'}
            </span>
          </button>
        </header>

      <div className="bg-slate-950 left-1/2 -translate-x-1/2 absolute bottom-0 flex h-4/6 rounded-t-xl w-11/12 items-center justify-center flex-col">
        <button
          onClick={callHealthCheckAPI}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-500 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
        >
          <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Call health check!
          </span>
        </button>
        <div className='mt-10'>
          <p>Response</p>
          <div>{hres?.message || 'Call again to populate state!'}</div>
        </div>

        <div className='mt-10'>
          <p>User Response</p>
          <div>Name: {userInfo?.name || 'Login first!'}</div>
          <div>Email: {userInfo?.email || 'Login first'}</div>
          <div>Id: {userInfo?.id || 'Login first'}</div>
          <div>Roles: {userInfo?.roles.join(', ') || 'Login first'}</div>
        </div>
      </div>
    </main>
  );
}

export default Home;
