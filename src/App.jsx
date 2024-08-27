import { useReducer } from 'react';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';
import './assets/style.css'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-opertion',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      if(payload.digit === "0" && state.currentOperand === "0")
        return state
      if(payload.digit === "." && state.currentOperand.includes(".")) 
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) return{
        ...state,
        overwrite: false,
        currentOperand: null
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) return {...state, currentOperand: null}
      
      return{...state, currentOperand: state.currentOperand.slice(0, -1)}
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null)
        return state
      if(state.previousOperand == null)
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
        return{
          ...state,
          operation: payload.operation,
          previousOperand: evaluate(state),
          currentOperand: null
        }
    case ACTIONS.EVALUATE:
      if( state.operation == null || state.currentOperand == null || state.previousOperand == null)
        return state
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.CLEAR:
      return {}
  }
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '÷':
      computation = prev / current
      break
    case '*':
      computation = prev * current
      break
  }
  return computation.toString();
}

export default function App (){
  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {})

  return(
  <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{previousOperand} {operation}</div>
      <div className="current-operand">{currentOperand}</div>
    </div>
    <button className="spant-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
    <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
    <OperationButton operation='÷' dispatch={dispatch}/>
    <DigitButton digit='1' dispatch={dispatch}/>
    <DigitButton digit='2' dispatch={dispatch}/>    
    <DigitButton digit='3' dispatch={dispatch}/>
    <OperationButton operation='*' dispatch={dispatch}/>
    <DigitButton digit='4' dispatch={dispatch}/>
    <DigitButton digit='5' dispatch={dispatch}/>
    <DigitButton digit='6' dispatch={dispatch}/>
    <OperationButton operation='+' dispatch={dispatch}/>
    <DigitButton digit='7' dispatch={dispatch}/>
    <DigitButton digit='8' dispatch={dispatch}/>
    <DigitButton digit='9' dispatch={dispatch}/>
    <OperationButton operation='-' dispatch={dispatch}/>
    <DigitButton digit='.' dispatch={dispatch}/>
    <DigitButton digit='0' dispatch={dispatch}/>
    <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
  </div>
  );
};