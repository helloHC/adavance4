import { Actor, HttpAgent, Identity } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { useEffect, useRef, useState } from "react"

function useAuth() {
  const [authClient, setAuthClient] = useState<AuthClient>()
  const [authenticatedStatus, setAuthenticatedStatus] = useState<boolean>()
  const [identity, setIdentity] = useState<Identity>()
  const [principal, setPrincipal] = useState<string | undefined>('')
  const [agent, setAgent] = useState<HttpAgent>()

  const authClientRef = useRef(authClient)
  const authenticatedStatusRef = useRef(authenticatedStatus)
  const identityRef = useRef(identity)
  const agentRef = useRef(agent)



  async function getIdentity(authClient: AuthClient) {
    identityRef.current = await authClient.getIdentity()
    setIdentity(identityRef.current)
    console.log(identityRef.current);

    setAgent(new HttpAgent({ identity: identityRef.current }))
  }

  useEffect(() => {
    (async () => {
      authClientRef.current = await AuthClient.create()
      setAuthClient(authClientRef.current)

      authenticatedStatusRef.current = await authClientRef.current.isAuthenticated()
      setAuthenticatedStatus(authenticatedStatusRef.current)

      if (authenticatedStatusRef.current && !identity) {
        getIdentity(authClientRef.current)
      }
    })()
  }, [])

  useEffect(() => {
    setPrincipal(identity?.getPrincipal().toText())
  }, [identity])

  async function authLogin() {
    if (!authClient) {
      console.log('no client');

      return
    }
    await authClient?.login({
      identityProvider: process.env.NODE_ENV === "development" ? "http://rwlgt-iiaaa-aaaaa-aaaaa-cai.localhost:8000/" : "https://identity.ic0.app/",
      onSuccess: async () => {
        console.log('login success');

        console.log(authClient);
        authenticatedStatusRef.current = await authClient.isAuthenticated()
        setAuthenticatedStatus(authenticatedStatusRef.current)
        getIdentity(authClient)
      }
    })
  }

  return {
    authClient,
    authenticatedStatus,
    identity,
    principal,
    authLogin,
  }
}

export default useAuth