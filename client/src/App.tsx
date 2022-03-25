import React, { useState } from 'react';

import useHostIORequest from './utils/useHostIORequest';

import {
  EMPTY_INPUT_VALUE,
  GENERIC_ERROR_MESSAGE,
  MINIMAL_COLORED_RANK,
  VALUE_IS_NOT_A_DOMAIN
} from './utils/constants';

import './App.css';

const validateUserInput = (value: string): { error: boolean, message?: string } => {
  if (value === '') return { error: true, message: EMPTY_INPUT_VALUE }
  if (!/.+\..+/.test(value)) return { error: true, message: VALUE_IS_NOT_A_DOMAIN.replace('{value}', value) }
  return { error: false };
};


function App() {
  const [domains, setDomains] = useState<string[]>(['']);
  const [inputError, setInputError] = useState(EMPTY_INPUT_VALUE);

  const { data, error: requestErrors, isLoading, requestHostIO } = useHostIORequest();

  const onDomainTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const domainsArray = e.target.value.split(/\r?\n/);
    for (let i = 0; i < domainsArray.length; i++) {
      const validationResult = validateUserInput(domainsArray[i]);
      if (validationResult.error) {
        setInputError(validationResult.message || 'An error ocurred');
        return;
      }
    }
    setInputError('');
    setDomains(domainsArray);
  };

  const renderDomains = () => {
    if (isLoading) return 'Loading...';
    return <>
      {requestErrors && requestErrors.map((error, idx) => {
        return <p
          key={`${idx}${error.message}`}
          className='error'
        >
          {error.message || GENERIC_ERROR_MESSAGE}
        </p>
      })}
      <h2 className='fade'>Results</h2>
      <ol>
        {data && data.map(({ rank, domain }, idx) => {
          const domainBackgroundColor = rank < MINIMAL_COLORED_RANK ? 'yellow' : '';
          return <li key={`${domain}${idx}`} style={{ backgroundColor: domainBackgroundColor }}>{domain}</li>
        })}
      </ol>
    </>;
  };

  return (
    <div className="app">
      <form onSubmit={(e) => {
        e.preventDefault();
        requestHostIO(domains)
      }}>
        <div className="form">
          <label className='typewriter' htmlFor="rankings">Up to 10 input domain names one per line</label>
          <textarea
            onChange={onDomainTextareaChange}
            name="rankings"
            id="rankings"
            cols={30}
            rows={30}
          ></textarea>
          <button
            disabled={inputError !== '' || isLoading}
            aria-busy={isLoading}
            type='submit'
            className='fade'
          >
            {isLoading ? 'Loading' : 'Highlight top ranking'}
          </button>
        </div>
      </form>
      {inputError
        // added key prop to make paragraph being rendered every time
        // to apply fade animation on every render
        && <p className='error fade' key={inputError}>{inputError}</p>}
      {renderDomains()}
    </div>
  );
}

export default App;
