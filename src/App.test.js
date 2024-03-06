import React from 'react'
import { create, act } from 'react-test-renderer'
import App from './App'

describe('App test', () => {
  it('should work', () => {
    let tree

    act(() => {
      tree = create(
        <App />
      )
    })
    expect(tree).toMatchSnapshot()
  })
  afterAll(() => jest.resetModules())
})