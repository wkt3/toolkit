'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import {CiShoppingCart} from 'react-icons/ci'


const CartCount = () => {
  // const {cartTotalQty}= useCart()
  const router=useRouter()
  return (
    <div onClick={()=>router.push('/cart')} className='
    relative
    cursor-pointer
    '>
      <div className='text-3xl'>
        <CiShoppingCart size={30}/>
      </div>
      <span className='
       absolute
       top-[-10px]
       right-[-10px]
       bg-orange-500
       h-8
       w-8
       rounded-full
       flex
       items-center
       justify-center
       text-sm
      '>
        0
        {/* {cartTotalQty} */}
        </span>
      
    </div>
  )
}

export default CartCount
