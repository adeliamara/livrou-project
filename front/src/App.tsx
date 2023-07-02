import { useContext, useEffect, useState } from 'react'
import { ShowMenuContext } from './contexts/MenuContext'

import { theme } from './styles/theme'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles/globalStyle'
import * as S from './styles'

import { Outlet } from 'react-router-dom' 
import { Nav } from './componentes/Nav'
import { SearchBox } from './componentes/SearchBox'
import { ShowLoginModalContext } from './contexts/LoginModalContext'
import { FormModal } from './componentes/FormModal'
import LoginForm from './componentes/LoginForm'
import RegisterForm from './componentes/RegisterForm'
import { ShowRegisterModalContext } from './contexts/RegisterModalContext'
import { AuthContext } from './contexts/AuthContext'
import { NavMobile } from './componentes/NavMobile'




function App() {
  const { showMenu } = useContext(ShowMenuContext);
  const { showLoginModal, setShowLoginModal } = useContext(ShowLoginModalContext);
  const { showRegisterModal, setShowRegisterModal } = useContext(ShowRegisterModalContext);
  const { setLoggedIn } = useContext(AuthContext);


  return (
    <S.App>
      <ThemeProvider theme={theme}>
          <S.Content>  
            
            <Nav/>
            {showMenu && <NavMobile/>}

            <S.MainContent>
              <SearchBox/>
              <Outlet/>
            </S.MainContent>

          </S.Content>

          <FormModal showModal={showLoginModal} setShowModal={setShowLoginModal} > 
            <LoginForm/>
          </FormModal>

          <FormModal showModal={showRegisterModal} setShowModal={setShowRegisterModal}>
            <RegisterForm/>
          </FormModal>

      </ThemeProvider>
      <GlobalStyle/>
    </S.App>
  )
}

export default App
