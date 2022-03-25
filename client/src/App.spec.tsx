import * as React from 'react'
import { mount } from '@cypress/react'

import {
  EMPTY_INPUT_VALUE,
  VALUE_IS_NOT_A_DOMAIN,
  BASE_URL,
  MINIMAL_COLORED_RANK
} from './utils/constants'

import App from './App'

const invalidValue = 'google';
const validValue = 'google.com'

it('App shows input error correctly', async () => {
  mount(<App />)

  cy.get('p.error').contains(EMPTY_INPUT_VALUE);
  cy.get('button').should('be.disabled');

  cy.get('textarea').type(invalidValue);
  cy.get('p.error').contains(VALUE_IS_NOT_A_DOMAIN.replace('{value}', invalidValue));
  cy.get('button').should('be.disabled');

  cy.get('textarea').clear().type(validValue);
  cy.get('p.error').should('not.exist');
  cy.get('button').should('not.be.disabled');
})

it('App handles fulfilled response correctly 1', () => {
  mount(<App />)

  cy.get('textarea').type(validValue);

  cy.intercept({
    method: 'post',
    url: `${BASE_URL}/*`,
  }, [{
    rank: 1,
    domain: validValue
  }]).as('getDomains');

  cy.get('form').submit();

  cy.wait('@getDomains').then(() => {
    cy.get('li').contains(validValue)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 0)');
  });
})

it('App handles fulfilled response correctly 2', () => {
  mount(<App />)

  cy.intercept({
    method: 'post',
    url: `${BASE_URL}/*`,
  }, [{
    rank: MINIMAL_COLORED_RANK + 1,
    domain: validValue
  }]).as('getDomains2');

  cy.get('form').submit();

  cy.wait('@getDomains2').then(() => {
    cy.get('li').contains(validValue)
      .should('have.css', 'background-color')
      .and('eq', 'rgba(0, 0, 0, 0)');
  });
})

it('App handles rejected response correctly', () => {
  mount(<App />);

  cy.intercept(
    'post',
    `${BASE_URL}/*`, {
    statusCode: 404,
    body: {}
  }).as('getDomains2');

  cy.get('form').submit();

  cy.wait('@getDomains2').then(() => {
    cy.get('.app').contains('Not Found');
  });
});