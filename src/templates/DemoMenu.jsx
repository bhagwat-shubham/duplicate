import Link from 'next/link';
import React from 'react';

import demos from "../data/demodata"

const DemoMenu = () => {

  // specifiy a list of demos to display. each item has a title, description and link
  

  // construct a list of views based on our demo array above
  const demoList = demos.map((data,i) => {
    return (
      <Link key={"datarow"+i} href={data.link}> 
      <div  className="p-4 border-gray-400 border rounded border-4 border-opacity-30 hover:bg-gray-100 hover:cursor-pointer"> 
          <img src= {"/assets/images/parsericons/" + data.icon} width={70} height={70}></img>
          <div className="text-2xl font-semibold">{data.title}</div>
          <div>{data.description}</div>
        
      </div>
      </Link>
    )
  })

  return (
  <div >
     
    <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-6">
    {demoList}
    </div>
  </div>
  )
} 

 

export { DemoMenu };
