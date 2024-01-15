import React from 'react'
import './Substraction.css'

const Substraction = () => {


const images = (n) => {
  let arr = []
  const num = () => Math.floor(Math.random() * 2) + 1;

  for (let x=0;x<n;x++) {
    arr.push(<img src="./img/cake.jpg"></img>)
  }
  arr.push(<div className="minus" > - </div>)
  arr.push(num())
  arr.push(<div className="minus"> = </div>)
  arr.push(<br></br>)
  return arr
}

const num1 = () => Math.floor(Math.random() * 10) + 1;


  return (
    <div>
    <div>Substraction</div>
    <input placeholder="number"></input>
    <br></br>
    <br></br>

    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    {images(num1())} 
    
    </div>
  )
}

export default Substraction