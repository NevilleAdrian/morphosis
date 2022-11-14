import React from 'react'
import "./index.css"
import axios from 'axios'
import { useEffect, useState } from 'react';
import NavBar from '../navbar';
import dateFormat from 'dateformat';
import { Alert } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Body() {


    //Retrieve products from Robot api
    const getProducts = () =>
        axios.get('http://localhost:8000/api/robots')
            .then(products => {
                setProducts(products.data.data)
                setFilteredProduct(products.data.data)
    }).catch(err => console.log(err))

//     const getProducts = () =>
//     axios.get('https://laravelapi1.azurewebsites.net/api/products')
//         .then(products => {
//             setProducts(products.data.data)
//             setFilteredProduct(products.data.data)
// }).catch(err => console.log(err))


    //Hooks for products
    const [products, setProducts] = useState([])


    //Hooks to filter products
    const [filteredProduct, setFilteredProduct] = useState([])
 

    //Call getProducts on initstate
    useEffect(() => {
        getProducts()
    }, [])
    console.log('data', products)


    //Initialize items in cart
    const [cartItems, setCartItems] = useState([])


    //Initialize a boolean to display Alert
    const [alert, setAlert] = useState(false)


    //Logic to increment count. display navbar and display alert if item count is greater that 5
    const changeShow = (item) => {
        if(cartItems.length <= 4 ){
            increment(item)
            displayNav(true)
        } else {
          setAlert(true)
        }
    }


    useEffect(() => {
        console.log('array', cartItems)
    }, [cartItems])


    //Check if cart item to be this ID
    const isInCart = (id) => {
        return cartItems.map(a => a.id).includes(id)
    }


    // Add count property to product
    const addCountToProduct = (product) => {
        return { ...product, count: cartItems.find(a => a.id === product.id).count }
    }


    //Increment individual cart item
    const increment = (id, stock) => {
        if (!isInCart(id)) {
            setCartItems([...cartItems, { id, count: 1 }])
        }
        else {
            setCartItems(cartItems.map(a => {
                //if count is less than or equal to stock increment but if count exceeds stock show error
                    if(a.count + 1 <= stock){
                        return a.id === id  ? { ...a, count: a.count + 1 } : a
                    } else {
                        if(a.id === id ){
                        setAlert(true)
                       return  {...a, count: stock }
                        } else {
                          return  {...a, count: a.count }
                        }

                    }
                       
            }))
        }
    }


    //remove item from product
    const removeItem = (id) => {
        setCartItems(cartItems.filter(a => a.id !== id))
    }


    //Decrement individual Cart Item
    const decrement = (id) => {
        
        if (isInCart(id)) {
            const cartItem = cartItems.find(item => item.id === id)
    
            if (cartItem.count === 1) {
                removeItem(id)
            }
            else {
                setCartItems(cartItems.map(a => a.id === id ? { ...a, count: a.count - 1 } : a))
            }
        }

    }


    const [showNav, setShowNav] = useState(false)


    //Display sidebar
    const displayNav = (shouldShow) => {
        if (shouldShow) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        setShowNav(shouldShow)
        console.log(showNav)
    }


    //hide alertBox
    const hidelert = () => {
        setAlert(false)
    }


    //filter by material type
     const handleSearch = (event) => {
      let value = event.target.value.toLowerCase()
      let result = []
      console.log(value)
      result = products.filter((data) => {
          return data.material.toLowerCase().search(value) != -1;
      })
      setFilteredProduct(result);
     }

     
    return (
        <>
        {alert && <SweetAlert
            title={"You cannot select more items"}
            onCancel={hidelert}
            onConfirm={hidelert}>
            </SweetAlert>}
            <NavBar remove={removeItem} showNav={showNav} displayNav={displayNav} increment={increment} decrement={decrement} number={cartItems.length} items={filteredProduct.filter(product => isInCart(product.id)).map(product => addCountToProduct(product))} />
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6">
                        <h1 className="main-weight">All Products</h1>
                        <input type="text" className="search" onChange={(event) => handleSearch(event)} placeholder='Search'/>

                    </div>
                </div>
            </div>
            <div className="grey-bg">
                <div className="container-fluid py-5">
                    <div className="row">
                        {filteredProduct.map((item) => {
            
                          return <div key={item.id} className="col-md-6 col-lg-4 col-sm-6 margin-bottom">
                            <div className="text-center">
                                <img alt="product-img" className="img-fluid img-height" src={item.image} />
                            </div>

                            <p className="text-center title">{item.name}</p>
                            <p className="text-center"><span>From</span> ฿{item.price}</p>
                            <p className="text-center title">Stock: {item.stock}</p>
                            <p className="text-center title">Material: {item.material}</p>
              
                            <p className="text-center title">{dateFormat(item.createdAt, "dS mmmm, yyyy")}</p>
                            
                            <div className="text-center">
                                <button disabled={!item.stock} onClick={() => changeShow(item.id)} className="button-primary">Add to Cart</button>
                            </div>
                        </div>
                        }
                        )}

                    </div>
                </div>
            </div>
         {alert &&  <div className={{position: "fixed"}}>
            <Alert color="primary">
            This is a primary alert — check it out!
           </Alert>
         </div> }

        </>
    )
}
