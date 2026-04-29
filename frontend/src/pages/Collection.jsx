import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem'


const Collection = () => {
  const [showFilter,setshowfilter]= useState(false);
  const {products,search,showSearch}= useContext(ShopContext)
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subcategory,setSubcategory] = useState([]);
  const [sortType,setSortType] = useState('relavent');

  // const [search,showSearch] = useContext(ShopContext);



  const toggleCategory = (e)=>{
    if (category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
      else{
        setCategory(prev => [...prev,e.target.value])
      }
  }

 const toggleSubCategory = (e) =>{
  if (subcategory.includes(e.target.value)){
    setSubcategory(prev=> prev.filter(item => item !== e.target.value))
  }
  else{
    setSubcategory(prev => [...prev,e.target.value])
  }
 }

 const applyfilter = ()=>{
let productsCopy = products.slice();
  if(category.length >0) {
    productsCopy = productsCopy.filter(item => category.includes(item.category))
  }
  if(subcategory.length >0){
    productsCopy = productsCopy.filter(item => subcategory.includes(item.subcategory))
  }
  if(showSearch && search){
    productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search))
  }

  setFilterProducts(productsCopy)
}


const sortProduct = ()=>{
 let fpcopy = filterProducts.slice()

 switch (sortType){
 case 'low-high':
  setFilterProducts(fpcopy.sort((a,b)=>(a.price - b.price)));
  break;

  case 'high-low':
    setFilterProducts(fpcopy.sort((a,b)=>(b.price - a.price)))
   break;

   default:
    applyfilter()
    break;

 }
}

  useEffect(()=> {
setFilterProducts(products)
  },[])

  useEffect(()=>{
 applyfilter()
  },[category,subcategory,search,showSearch,products])

  useEffect(()=>{
sortProduct()
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* filter options */}
      <div className="min-w-60">
        <p onClick={()=>setshowfilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
          <img src={assets.dropdown_icon} className={`h-4 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
        </p>
        {/* category filter  */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : "hidden"} sm:block  `}>
          <p className="mb-3 text-sm font-medium">CATEGORY</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Men'}  onChange={toggleCategory}/>men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Women'} onChange={toggleCategory} />women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Kids'}  onChange={toggleCategory}/>kids
            </p>
          </div>
        </div>
        <div>
          {/* subcategory */}
          <div className={`border border-gray-300 pl-5 py-3 my-6 ${showFilter ? '' : "hidden"} sm:block  `}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Topwear'}  onChange={toggleSubCategory}  />Topwear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Bottomwear'} onChange={toggleSubCategory}  />Bottomwear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className='w-3' value={'Winterwear'}  onChange={toggleSubCategory} />Winterwear
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* right side  */}
    <div className="flex-1 ">
      <div className="flex justify-between text-base sm:text-2xl mb-4">
        <Title text1={'ALL'} text2={'COLLECTION'}/>
        {/* product sort  */}
        <select onChange={(e)=> setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2' > 
          <option value="relavent">Sort By: All</option>
          <option value="low-high">Sort By: Low to High</option>
          <option value="high-low">Sort By: High to Low</option>
        </select>
      </div>
      {/* map product  */}
      <div className=' grid grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-4 gap-y-6'>
        {
          filterProducts.map((item,index)=>(
            <ProductItem key={index} name={item.name} id={item._id}  price={item.price } image={item.image} />
          ))
        }
        
      </div>
    </div>

   
    </div>
  )
}

export default Collection