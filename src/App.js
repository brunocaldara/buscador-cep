import React, { useState, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import InputMask from "react-input-mask"
import api from './services/api';
import './App.css'

const App = () => {
  const [input, setInput] = useState('')
  const [cep, setCep] = useState('')
  const inputEl = useRef(null)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const focusInput = () => {
    inputEl.current.focus()
    inputEl.current.setSelectionRange(0, 0);
  }

  const clearState = () => {
    setInput('')
    setCep('')
  }

  const handleSearch = async (e) => {
    if (input === '') {
      alert('Informe algum CEP')
      focusInput()
      return
    }

    const regexCep = /^([\d]{5})-?([\d]{3})/

    if (!regexCep.test(input)) {
      alert('Preencha corretamente o campo de CEP')
      focusInput()
      return
    }

    try {
      const response = await api.get(`${input}/json`)

      if (Object.keys(response.data).includes('erro')) {
        alert('CEP Inválido')
        clearState()
        focusInput()
      }

      setCep(response.data)
      setInput('')
    } catch (err) {
      alert('Erro ao buscar cep')
      clearState()
      console.log('err', err)
    }
  }

  const handleClear = () => {
    clearState()
    focusInput()
  }

  return (
    <div className='container'>
      <h1 className='title'>Buscador CEP</h1>
      <div className='container-input'>
        <InputMask
          ref={inputEl}
          placeholder='Informe o CEP'
          mask='99999-999'
          value={input}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>
          <FiSearch size={25} color='#fff' />
        </button>
        <button onClick={handleClear}>
          <FiX size={25} color='#fff' />
        </button>
      </div>
      {Object.keys(cep).length > 1 && (
        <main className='main'>
          <h2>CEP: {cep.cep}</h2>

          <span>{cep.logradouro}</span>
          <span>{cep.complemento}</span>
          <span>{cep.bairro}</span>
          <span>{cep.localidade} - {cep.uf}</span>
        </main>
      )}
    </div>
  );
}

export default App;
