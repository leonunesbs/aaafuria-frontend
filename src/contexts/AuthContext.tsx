import { destroyCookie, parseCookies, setCookie } from 'nookies';
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

const SIGN_IN = gql`
  mutation getToken($matricula: String!, $pin: String!) {
    tokenAuth(username: $matricula, password: $pin) {
      token
      payload
      user {
        id
        isStaff
        member {
          id
          registration
          name
          nickname
          group
          email
          avatar
          birthDate
          rg
          cpf
          hasActiveMembership
          isFirstTeamer
          isCoordinator
          activeMembership {
            membershipPlan {
              title
            }
            startDate
            currentEndDate
          }
        }
      }
    }
  }
`;

type UserData = {
  id: string;
  isStaff: boolean;
  member: {
    id: string;
    registration: string;
    name: string;
    nickname: string;
    group: string;
    email: string;
    avatar: string;
    birthDate: string;
    rg: string;
    cpf: string;
    hasActiveMembership: boolean;
    isFirstTeamer: boolean;
    isCoordinator: boolean;
    activeMembership: {
      membershipPlan: {
        title: string;
      };
      startDate: string;
      currentEndDate: string;
    } | null;
  };
};

type SignInData = {
  matricula: string;
  pin: string;
  redirectUrl?: string;
};

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string;
  signIn: (data: SignInData) => Promise<{
    tokenAuth: {
      token: string;
      payload: string;
      user: UserData;
    };
  }>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
  user: UserData | null;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { ['aaafuriaToken']: token } = parseCookies();
  const isAuthenticated = useMemo(() => !!token, [token]);

  const [user, setUser] = useState<UserData | null>(null);

  const signOut = useCallback(() => {
    router.push(`/login?after=${router.asPath}`);
    destroyCookie(null, 'aaafuriaToken');
    setUser(null);
  }, [router]);

  const checkAuth = useCallback(async () => {
    if (isAuthenticated) {
      const { data, errors } = await client.query({
        query: gql`
          query getUser {
            user {
              id
              isStaff
              member {
                id
                registration
                name
                nickname
                group
                email
                avatar
                birthDate
                rg
                cpf
                hasActiveMembership
                isFirstTeamer
                isCoordinator
                activeMembership {
                  membershipPlan {
                    title
                  }
                  startDate
                  currentEndDate
                }
              }
            }
          }
        `,
        context: {
          headers: {
            Authorization: `JWT ${token}`,
          },
        },
      });

      if (errors) {
        signOut();
        throw errors;
      }

      setUser(data.user);
    }
  }, [isAuthenticated, signOut, token]);

  const signIn = useCallback(
    async ({ matricula, pin, redirectUrl }: SignInData) => {
      const response = await client
        .mutate({
          mutation: SIGN_IN,
          variables: {
            matricula: matricula,
            pin: pin,
          },
        })
        .then(async ({ data, errors }) => {
          setCookie(null, 'aaafuriaToken', data.tokenAuth.token, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });

          setUser(data.tokenAuth.user);

          router.push(redirectUrl || '/');

          if (errors) {
            throw errors;
          }

          return data;
        });

      return response;
    },
    [router],
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        signIn,
        signOut,
        checkAuth,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
