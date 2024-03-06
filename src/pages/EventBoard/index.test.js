import React from 'react'
import { create, act } from 'react-test-renderer'
import EventBoard from './index'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));


describe('App test', () => {
  const initialState = { 
    event: { 
      events: [] 
    }, 
    user: { 
      email: '', 
      token: null 
    } 
  };
  const mockStore = configureStore([thunk]);
  let store;
  Object.defineProperty(window, 'scrollLeft', { value: {}, writable: true });


  it('should work', () => {
    let tree
    store = mockStore(initialState);

    act(() => {
      tree = create(
        <Provider store={store}>
          <EventBoard />
        </Provider>, 
        {
          createNodeMock: (node) => {
            return document.createElement(node.type)
          }
        }
      )
    })
    expect(tree).toMatchSnapshot()
  })
  afterAll(() => jest.resetModules())
})