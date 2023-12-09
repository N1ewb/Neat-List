import React, { useContext, useState,useEffect} from 'react'
import { auth} from '../firebase'
import { onAuthStateChanged, signOut, updateProfile, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'
import toast, { Toaster } from 'react-hot-toast';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children  }) => {
    const [currentUser, setCurrentUser] = useState(null)

    const notifyLogout = () => toast('Logged Out Successfuly');
    const notifyLogin = () => toast('Logged In Successfuly')
    const notifyAlreadyLoggedIn = () => toast('Already Logged In')
    const notifyLogoutFirst = () => toast('Log Out first')
    const notifySignin = () => toast('Signed In Sucessfuly')
    const notifyError = (error) => toast(error.message)


    const SignIn = async (email, password) => {
      if (!currentUser) {
       try{
        if(currentUser){
          notifyLogin()
        }
        return await signInWithEmailAndPassword(auth, email, password)
       } catch (error) {
        notifyError(error)
       }
      } else {
        return notifyAlreadyLoggedIn()
      }
    };

    const SignInWithGoogle = async() => {
      const provider = new GoogleAuthProvider();
  
      return signInWithPopup(auth, provider)
        .then(() => {
          notifyLogin();
        })
        .catch((error) => {
          notifyError(error);
        });
    };

    const SignUp = (email, password, firstName, lastName) => {
      if (!currentUser) {
        return createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
              displayName: `${firstName} ${lastName}`,
            })
            notifySignin();
          })
          .catch((error) => {
            notifyError(error);
          });
      } else {
        return notifyLogoutFirst();
      }
    };    

    const SignOut = async (e) => {
            signOut(auth).then(()=>{
            notifyLogout()
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
        return () => {
          unsubscribe();
        };
      }, []);

    const value = {
        currentUser,
        SignOut,
        SignIn,
        SignInWithGoogle,
        SignUp
    }

  return (
    <>
        <AuthContext.Provider value={value}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    </>
  )
}

