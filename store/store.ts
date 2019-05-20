import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { todoReducer } from './reducer/reducer';

export type Todo = {
  id: number;
  text: string;
  isCompleted: boolean;
};

const middleware: Middleware[] = [thunk];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const rootReducer = combineReducers({
  todos: todoReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default (initialState?: AppState) => {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
};
