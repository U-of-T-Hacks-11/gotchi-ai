import React, { useState } from 'react'
import { FaHome, FaHourglassHalf, FaSave } from 'react-icons/fa'
import { BsChatLeftTextFill } from 'react-icons/bs'
import Notes from '../pages/Notes'
import Timer from '../pages/Timer'
import Chat from '../pages/Chat'
import Home from '../pages/Home'
import Summarizer from '../pages/Summarizer'
import { FaBookOpen } from "react-icons/fa";
import hungerBar from '../pages/images/hungerBar.png'
import './Switcher.css'

const Switcher = ({ feedCharacter, charSelect, setCharacter }) => {
  const [pageNumber, setPageNumber] = useState(0)
  const handleRouterChange = (newRouter) => {
    switch (newRouter) {
      case 'timer':
        setPageNumber(1)
        break
      case 'Take notes':
        setPageNumber(3)
        break
      case 'Summarizer':
        setPageNumber(4)
        break
      case 'Feed pet':
        setPageNumber(0)
        break
      default:
        break
    }
  }
  const handleButtonClick = (component) => {
    switch (component) {
      case 'home':
        setPageNumber(0)
        break
      case 'timer':
        setPageNumber(1)
        break
      case 'chat':
        setPageNumber(2)
        break
      case 'feed':
        feedCharacter()
        break
      case 'notes':
        setPageNumber(3)
        break
      case 'summarizer':
        setPageNumber(4)
        break
      default:
        setPageNumber(0)
    }
  }

  const renderPage = () => {
    switch (pageNumber) {
      case 0:
        return <Home charSelect={charSelect} setCharacter={setCharacter} />
      case 1:
        return <Timer />
      case 2:
        return <Chat onRouterChange={handleRouterChange} />
      case 3:
        return <Notes />
      case 4:
        return <Summarizer />
      default:
        return null
    }
  }

  return (
    <div className='App'>
      <div>
        <div className='center-buttons'>
          <button
            className='button-icon'
            onClick={() => handleButtonClick('home')}
          >
            <FaHome />
          </button>
          <button
            className='button-icon'
            onClick={() => handleButtonClick('timer')}
          >
            <FaHourglassHalf />
          </button>
          <button
            className='button-icon'
            onClick={() => handleButtonClick('chat')}
          >
            <BsChatLeftTextFill />
          </button>
          <button
            className='button-icon'
            onClick={() => handleButtonClick('summarizer')}
          >
            <FaBookOpen />
          </button>
          <button
            className='button-icon'
            onClick={() => handleButtonClick('notes')}
          >
            <FaSave />
          </button>
        </div>
        <button
          onClick={() => handleButtonClick('feed')}
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            fontSize: '18px',
            padding: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderRadius: 10,
            borderColor: 'rgba(14, 51, 19, 0.74)',
            borderWidth: '4px',
          }}
        >
          <img
            src={hungerBar}
            alt='Hunger Bar'
            style={{ width: '50px', height: '50px' }}
          />
        </button>
      </div>
      <div>{renderPage()}</div>
    </div>
  )
}

export default Switcher
