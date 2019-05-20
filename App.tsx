/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { FC, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { connect, Provider } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TodoActions, todoActions } from './store/reducer/reducer';
import store, { AppState, Todo } from './store/store';

const styles = StyleSheet.create({
  titleWrapper: {
    backgroundColor: 'skyblue',
    padding: 15,
    height: 80
  },
  titleInnerWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 16
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'whitesmoke'
  },
  input: {
    height: 50,
    padding: 15
  },
  todoList: {
    flex: 1
  },
  checkboxWrapper: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  checkboxInner: {
    flex: 1,
    margin: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  todoItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'whitesmoke',
  },
  completed: {
    backgroundColor: 'whitesmoke'
  },
  todoItemRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoItemRemoveIcon: {
    marginLeft: 10,
    marginBottom: 2,
    color: '#CD5C5C',
    fontSize: 26,
  },
  footerWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  footer: {
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledFooter: {
    opacity: 0.7,
  },
  footerRemoveText: {
    color: 'tomato'
  },
  footerCompleteText: {
    color: 'green'
  }
});

const Title: FC = () => {
  return (
    <View style={ styles.titleWrapper }>
      <View style={ styles.titleInnerWrapper }>
        <Text style={ styles.title }>
          Todo List
        </Text>
      </View>
    </View>
  );
};

type InputProps = {
  onSubmit: (todo: Todo) => void;
};
const Input: FC<InputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const onSubmitEditingHandler = () => {
    if (!text) return;
    onSubmit({
      isCompleted: false,
      id: Date.now(),
      text
    });
    setText('');
  };

  return (
    <View style={ styles.inputWrapper }>
      <TextInput style={ styles.input }
                 placeholder={ 'Enter an item' }
                 onChangeText={ setText }
                 onSubmitEditing={ onSubmitEditingHandler }
                 blurOnSubmit={ false }
                 value={ text }/>
    </View>
  );

};

type TodoListProps = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  toggleCompleteTodo: (id: number) => void;
};
const TodoList: FC<TodoListProps> = ({ todos, removeTodo, toggleCompleteTodo }) => {
  return (
    <ScrollView style={ styles.todoList }>
      { todos.map(todo => (
        <TodoItem todo={ todo }
                  removeTodo={ removeTodo }
                  toggleCompleteTodo={ toggleCompleteTodo }
                  key={ todo.id }/>
      )) }
    </ScrollView>
  );
};

type CheckboxProps = {
  isChecked: boolean;
  onToggle: () => void;
};
const Checkbox: FC<CheckboxProps> = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity onPress={ onToggle }>
      <View style={ styles.checkboxWrapper }>
        { isChecked && <View style={ styles.checkboxInner }/> }
      </View>
    </TouchableOpacity>
  );
};

type TodoItemProps = {
  todo: Todo;
  removeTodo: (id: number) => void;
  toggleCompleteTodo: (id: number) => void;
};
const TodoItem: FC<TodoItemProps> = ({ todo, toggleCompleteTodo, removeTodo }) => {
  const { text, isCompleted, id } = todo;

  return (
    <View style={ isCompleted ? { ...styles.todoItem, ...styles.completed } : styles.todoItem }>
      <Text>{ text }</Text>
      <View style={ styles.todoItemRightSection }>
        <Checkbox isChecked={ isCompleted } onToggle={ () => {
          toggleCompleteTodo(id);
        } }/>
        <TouchableOpacity onPress={ () => removeTodo(id) }>
          <Text style={ styles.todoItemRemoveIcon }> &times; </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type FooterProps = {
  onCompleteAll: () => void;
  onRemoveComplete: () => void;
  hasCompleted: boolean;
  hasTodo: boolean;
};
const Footer: FC<FooterProps> = ({ onCompleteAll, onRemoveComplete, hasCompleted, hasTodo }) => {
  return (
    <View style={ styles.footerWrapper }>
      <TouchableOpacity style={ hasCompleted ? styles.footer : { ...styles.footer, ...styles.disabledFooter } }
                        onPress={ onRemoveComplete }
                        disabled={ !hasCompleted }>
        <Text style={ styles.footerRemoveText }>Remove completed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ styles.footer }
                        onPress={ onCompleteAll }
                        disabled={ !hasTodo }>
        <Text style={ styles.footerCompleteText }>Complete all</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  todoState: state.todos
});

const mapDispatchToProps = (dispatch: Dispatch<TodoActions>) => bindActionCreators(
  {
    addTodo: todoActions.addTodo,
    removeTodo: todoActions.removeTodo,
    toggleCompleteTodo: todoActions.toggleCompleteTodo,
    removeCompletedTodos: todoActions.removeCompletedTodos,
    completeAll: todoActions.completeAll
  },
  dispatch
);

type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
const App: FC<AppProps> = ({ todoState, addTodo, removeCompletedTodos, removeTodo, toggleCompleteTodo, completeAll }) => {
  return (
    <View style={ { flex: 1 } }>
      <Title/>
      <Input onSubmit={ addTodo }/>
      <TodoList todos={ todoState.todos } removeTodo={ removeTodo } toggleCompleteTodo={ toggleCompleteTodo }/>
      <Footer onRemoveComplete={ removeCompletedTodos }
              hasCompleted={ todoState.hasCompleted }
              onCompleteAll={ completeAll }
              hasTodo={ !!todoState.todos.length }/>
    </View>
  );
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default () => {
  return (
    <Provider store={ store() }>
      <ConnectedApp/>
    </Provider>
  );
};
