import React, { useEffect, useState } from 'react';
import RecipePost from '../../components/recipe_posts/RecipePost';
import Navbars from "../../components/navbars/Navbars";
import {Button} from 'react-bootstrap';

import Turkey from '../../images/turkey.jpg'
import Potatoes from '../../images/potatoes.jpg'
import { render } from 'react-dom';
import './HomePage.css'
/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function HomePage() {

  //state to hold an array of json objects of recipe posts (TWO FILLER POSTS FOR NOW AS EXAMPLES)
  const [recipePostsList, updateRecipePostsList] = useState([{
      id: 1,
      username: "Will Mori",
      title: "Turkey",
      image: Turkey,
      description: "FILLER DESCRIPTION FOR TESTING PURPOSES TURKEY DJLSDJF L:SDJF:SL DFJKSDL:K FJSDL:KFJS: LDKFJ S:LKDFJ: SLDKFJS LDKMJFK SLDF:JS DL:KFJ SDLFJ SDKL:F J:SDLKJF SD:KLFJ S:LDKFJ :SLKD FJS:DLFKJD SL:FKJSD LFKJ",
      ingredients: ["Turkey Ingredient 1", "Turkey Ingredient 2", "Turkey Ingredient 3", "Turkey Ingredient 4"],
      instructions: ["Turkey Instruction 1", "Turkey Instruction 2", "Turkey Instruction 3", "Turkey Instruction 4"]
  }, {
      id: 2,
      username: "Bryan Zamora",
      title: "Potatoes",
      image: Potatoes,
      description: "FILLER DESCRIPTION FOR TESTING PURPOSES POTATOES DJLSDJF L:SDJF:SL DFJKSDL:K FJSDL:KFJS: LDKFJ S:LKDFJ: SLDKFJS LDKMJFK SLDF:JS DL:KFJ SDLFJ SDKL:F J:SDLKJF SD:KLFJ S:LDKFJ :SLKD FJS:DLFKJD SL:FKJSD LFKJ",
      ingredients: ["Potatoes Ingredient 1", "Potatoes Ingredient 2", "Potatoes Ingredient 3", "Potatoes Ingredient 4"],
      instructions: ["Potatoes Instruction 1", "Potatoes Instruction 2", "Potatoes Instruction 3", "Potatoes Instruction 4"]
  }])

  /*
  This will fetch the list of recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable recipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
  /*
  useEffect(() => {
      fetch(URL_GET_RECIPE_POSTS_DATA)
          .then((response) => response.json())
          .then((data) => updateRecipePostsList(data))
  }, [])
  */

  function renderRecipePostComponents() {
      const arrComponents = []
      for (let i = 0; i < recipePostsList.length; i++) {
          arrComponents.unshift(
          <RecipePost username={recipePostsList[i].username}
                      title={recipePostsList[i].title}
                      image={recipePostsList[i].image}
                      description={recipePostsList[i].description}
                      ingredients={recipePostsList[i].ingredients}
                      instructions={recipePostsList[i].instructions} />)
      }
      return arrComponents
  }


  //To display the state variable in the html, use the {} curly brackets.  Simple!
  return (
    <div>
        <Navbars />
        <div className='home-page'> 
            <Button className="new-post-btn" variant="primary">New Post</Button>
            <ul>
                {renderRecipePostComponents()}
            </ul>
        </div>
    </div>
  );
}

export default HomePage;