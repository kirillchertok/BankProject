import { createContext } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import Home from './components/Home/Home.jsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons'
import './styles/global.css'
import GlobalStore from './globalStore/globalStore.ts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BankAccount from './components/BankAccount/BankAccount.jsx'
import MakeTransaction from './components/BankAccount/UserAccount/Options/MakeTransaction/MakeTransaction.jsx'
import Cards from './components/BankAccount/UserAccount/Options/Cards/Cards.jsx'
import Account from './components/BankAccount/UserAccount/Options/Account/Account.jsx'
import Transactions from './components/BankAccount/UserAccount/Options/Transactions/Transactions.jsx'
import Credits from './components/BankAccount/UserAccount/Options/Credits/Credits.jsx'

const globalStore = new GlobalStore();
export const Context = createContext({
  globalStore,
})

library.add(fas, faCcVisa, faCcMastercard)

let container = null
document.addEventListener('DOMContentLoaded',function(event){
  if(!container){
    container = document.getElementById('root')
    const root = createRoot(container)
    root.render(
      <BrowserRouter>
      <Context.Provider value={{
        globalStore
      }}>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/account' element={<BankAccount />}/>
            <Route path='/account/makeTransaction' element={<MakeTransaction />}/>
            <Route path='/account/Cards' element={<Cards />}/>
            <Route path='/account/userAccount' element={<Account />} />
            <Route path='/account/Transactions' element={<Transactions />}/>
            <Route path='/account/Credits' element={<Credits />}/>
          </Routes>
      </Context.Provider>
      </BrowserRouter>  
    )
  }
})

